"use client";

import React, { useEffect, useRef, useState } from "react";
import { BsChevronDown, BsList, BsSearch, BsXLg } from "react-icons/bs";
import { GrLanguage } from "react-icons/gr";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/navigation";
import Image from "next/image";
import { resolveImageUrl } from "@/store/tourismStore";
import ButtonIcon from "../ui/ButtonIcon";
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(null);
  const [hoveredChild, setHoveredChild] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [parentCategories, setParentCategories] = useState([]);
  const timeoutRef = useRef(null);

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();

  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  // جلب الكاتيغوريز من API مباشرة
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/Category/tree`, { headers: { Version: "1" } })
      .then((res) => setParentCategories(res.data.data ?? []))
      .catch(() => {});
  }, []);

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: newLocale });
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) {
      setSearchOpen((prev) => !prev);
      return;
    }
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  };

  const handleMouseEnter = (id) => {
    const cat = parentCategories.find((c) => c.id === id);
    if (!cat?.children?.length) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredChild(null);
    setOpenDropdown(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setHoveredChild(null);
    }, 150);
  };

  const toggleMobileAccordion = (key) => {
    setMobileAccordionOpen((prev) => (prev === key ? null : key));
  };

  const activeParent = parentCategories.find((c) => c.id === openDropdown);

  return (
    <header className="relative z-50 bg-neutral-800 text-white" dir={direction}>
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 px-4 py-1">
        <Link href="/" className="cursor-pointer">
          <Image src="/homs.png" alt="Logo" width={80} height={50} />
        </Link>

        <div className="flex items-center gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className={`flex items-center overflow-hidden rounded-full border border-white/20 bg-white/10 transition-all duration-300 ${
              searchOpen ? "w-56 sm:w-72 px-3 py-2" : "w-11 px-0 py-0"
            }`}
          >
            <button
              type="submit"
              className="flex h-11 w-11 items-center justify-center text-white"
              aria-label={t("search")}
            >
              <BsSearch />
            </button>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              placeholder={t("search")}
              className={`bg-transparent text-sm text-white placeholder:text-white/70 outline-none transition-all ${
                searchOpen ? "ml-2 w-full opacity-100" : "w-0 opacity-0"
              } ${isRTL ? "text-right" : "text-left"}`}
            />
          </form>

          <ButtonIcon
            icon={GrLanguage}
            text={isRTL ? "AR" : "EN"}
            ariaLabel={isRTL ? "تغيير اللغة" : "Change Language"}
            onClick={toggleLanguage}
          />

          <button
            className="p-2 transition duration-300 hover:-translate-y-1 hover:scale-105 lg:hidden"
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileAccordionOpen(null);
            }}
            aria-label={isRTL ? "فتح القائمة" : "Toggle Menu"}
          >
            {mobileMenuOpen ? <BsXLg /> : <BsList />}
          </button>
        </div>
      </div>

      {/* Desktop nav */}
      <nav
        className="relative hidden justify-center border-t border-slate-600 lg:flex"
        onMouseLeave={handleMouseLeave}
      >
        <div className={`flex items-center gap-2 px-6 ${isRTL ? "flex-row-reverse" : ""}`}>
          {/* ثابت: الفعاليات */}
          <Link
            href="/events"
            className="px-4 py-3 text-sm font-medium transition hover:underline hover:decoration-2 hover:decoration-green-400 hover:underline-offset-8"
          >
            {t("events")}
          </Link>

          {/* Parent categories */}
          {parentCategories.map((parent) => (
            <div
              key={parent.id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(parent.id)}
            >
              <button
                onClick={() => {
                  router.push(`/places?category=${parent.id}`);
                  setOpenDropdown(null);
                }}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium transition hover:underline hover:decoration-2 hover:decoration-green-400 hover:underline-offset-8 ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <span>{parent.name}</span>
                {parent.children?.length > 0 && (
                  <BsChevronDown
                    className={`text-xs transition-transform duration-200 ${
                      openDropdown === parent.id ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Dropdown */}
        {openDropdown && activeParent?.children?.length > 0 && (
          <div
            className={`absolute top-full mt-0 w-[680px] rounded-2xl bg-white p-5 text-black shadow-2xl ${
              isRTL ? "right-1/2 translate-x-1/2" : "left-1/2 -translate-x-1/2"
            }`}
            onMouseEnter={() => clearTimeout(timeoutRef.current)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex gap-4">
              {/* Children list */}
              <div className="flex flex-1 flex-col gap-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-stone-400">
                  {activeParent.name}
                </p>
                {activeParent.children.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => {
                      router.push(`/places?category=${child.id}`);
                      setOpenDropdown(null);
                    }}
                    onMouseEnter={() => setHoveredChild(child)}
                    onMouseLeave={() => setHoveredChild(null)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-stone-100 ${
                      isRTL ? "flex-row-reverse text-right" : "text-left"
                    }`}
                  >
                    {/* صورة صغيرة */}
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={resolveImageUrl(child.imageUrl) || "/homs.png"}
                        alt={child.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-stone-800">
                        {child.name}
                      </div>
                      {child.description && (
                        <div className="line-clamp-1 text-xs text-stone-500">
                          {child.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* صورة preview على اليمين/اليسار */}
              <div className="relative hidden h-48 w-48 shrink-0 overflow-hidden rounded-2xl md:block">
                <Image
                  src={
                    resolveImageUrl(
                      hoveredChild?.imageUrl || activeParent.imageUrl
                    ) || "/homs.png"
                  }
                  alt={hoveredChild?.name || activeParent.name}
                  fill
                  className="object-cover transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <p className="absolute bottom-3 left-3 right-3 text-center text-xs font-semibold text-white">
                  {hoveredChild?.name || activeParent.name}
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <nav className="absolute z-50 max-h-[80vh] w-full overflow-y-auto rounded-b-xl border-t border-slate-600 bg-neutral-800 px-4 py-4 lg:hidden">
          <Link
            href="/events"
            className="mb-2 block rounded px-2 py-2 text-neutral-200 hover:bg-neutral-600"
            onClick={() => setMobileMenuOpen(false)}
          >
            {t("events")}
          </Link>

          {parentCategories.map((parent) => (
            <div
              key={parent.id}
              className="mb-2 border-b border-slate-600 last:border-none"
            >
              <button
                onClick={() => toggleMobileAccordion(parent.id)}
                className={`flex w-full items-center justify-between rounded px-2 py-2 text-neutral-200 hover:bg-neutral-600 ${
                  isRTL ? "text-right" : "text-left"
                }`}
              >
                <span>{parent.name}</span>
                {parent.children?.length > 0 && (
                  <BsChevronDown
                    className={`transition-transform ${
                      mobileAccordionOpen === parent.id ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {mobileAccordionOpen === parent.id && parent.children?.length > 0 && (
                <div className={`mt-1 px-3 ${isRTL ? "text-right" : "text-left"}`}>
                  {/* الانتقال للـ parent نفسه */}
                  <button
                    onClick={() => {
                      router.push(`/places?category=${parent.id}`);
                      setMobileMenuOpen(false);
                    }}
                    className={`mb-1 w-full rounded px-2 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-neutral-600 ${
                      isRTL ? "text-right" : "text-left"
                    }`}
                  >
                    {isRTL ? `عرض كل ${parent.name}` : `View all ${parent.name}`}
                  </button>
                  {parent.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => {
                        router.push(`/places?category=${child.id}`);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-2 rounded px-2 py-2 text-gray-200 hover:bg-neutral-600 ${
                        isRTL ? "flex-row-reverse text-right" : "text-left"
                      }`}
                    >
                      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={resolveImageUrl(child.imageUrl) || "/homs.png"}
                          alt={child.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm">{child.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;