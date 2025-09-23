


"use client";
import React, { useState, useRef, useEffect } from "react";
import { BsSearch, BsChevronDown, BsList, BsXLg } from "react-icons/bs";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useSection } from "@/store/sectionStore";
import Image from "next/image";
import { GrLanguage } from "react-icons/gr";
import ButtonIcon from "../ui/ButtonIcon";

const Header = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(null);
  const [hoveredImageUrl, setHoveredImageUrl] = useState(null);
  const timeoutRef = useRef(null);

  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const toggleLanguage = () => {
    const newLocale = locale === "en" ? "ar" : "en";
    const currentPath = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${currentPath}`);
  };

  const { categoriesWithTopics, loading, error, getCategoriesWithTopics } = useSection();

  useEffect(() => {
    getCategoriesWithTopics(locale);
  }, []);

  const handleMouseEnter = (key) => {
    const hasTopics = categoriesWithTopics.find((cat) => cat.id === key)?.topics?.length > 0;
    if (!hasTopics) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setHoveredImageUrl(null);
    setOpenDropdown(key);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
      setHoveredImageUrl(null);
    }, 150);
  };

  const toggleMobileAccordion = (key) => {
    setMobileAccordionOpen((prev) => (prev === key ? null : key));
  };

  return (
    <header className="bg-neutral-800 text-white relative z-50" dir={direction}>
      <div className="flex justify-between items-center px-4 py-0">
        <a className="font-bold text-2xl text-neutral-200 cursor-pointer">
          <Image src="/homs.png" alt="Logo" width={80} height={50} />
        </a>

        <div className="flex items-center gap-4">
          <ButtonIcon icon={BsSearch} text={isRTL ? "بحث" : "search"} />
          <ButtonIcon icon={GrLanguage} text={isRTL ? "AR" : "EN"} ariaLabel={isRTL ? "تغيير اللغة" : "Change Language"} onClick={toggleLanguage} />

          <button
            className="lg:hidden p-2 transform transition duration-300 hover:scale-105 hover:-translate-y-1"
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

      <nav className="hidden lg:flex justify-center border-t border-slate-600 relative" onMouseLeave={handleMouseLeave}>
        <div className={`flex items-center gap-8 ${isRTL ? "flex-row-reverse" : ""}`}>
          {categoriesWithTopics.map((item) => (
            <button
              key={item.id}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:underline hover:decoration-2 hover:decoration-green-900 hover:underline-offset-8 ${isRTL ? "flex-row-reverse" : ""}`}
              onMouseEnter={() => handleMouseEnter(item.id)}
            >
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {openDropdown && (
          <div
            className={`absolute top-full ${isRTL ? "right-1/2 translate-x-1/2" : "left-1/2 -translate-x-1/2"} mt-0 w-[1000px] h-[300px] bg-white text-black rounded-xl shadow-xl p-6 z-50`}
            onMouseEnter={() => clearTimeout(timeoutRef.current)}
            onMouseLeave={handleMouseLeave}
          >
            {categoriesWithTopics
              .filter((category) => category.id === openDropdown)
              .map((category) => (
                <div key={category.id}>
                  <div className="grid grid-cols-2">
                    {category.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          router.push(`/${locale}/topic/${topic.slug}`);
                          setOpenDropdown(null);
                        }}
                        onMouseEnter={() => setHoveredImageUrl(topic.imageUrl)}
                        onMouseLeave={() => setHoveredImageUrl(null)}
                        className={`hover:bg-neutral-100 p-2 rounded w-full ${isRTL ? "text-right" : "text-left"}`}
                      >
                        <div className="font-medium text-gray-800">{topic.title}</div>
                        <div className="text-sm text-gray-500">
                          {isRTL ? `اضغط للانتقال إلى ${topic.slug}` : `Click to navigate to ${topic.slug}`}
                        </div>
                      </button>
                    ))}
                    <div className={`absolute ${isRTL ? "top-0.5 left-4" : "top-0.5 right-4"} w-72 h-72`}>
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/${(hoveredImageUrl || category.imageUrl).replace(/^\/+/, "")}`}
                        alt={category.name || "Category Image"}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </nav>

      {mobileMenuOpen && (
        <nav className="absolute bg-neutral-800 w-full lg:hidden border-t border-slate-600 px-4 py-2 z-50 max-h-[80vh] overflow-y-auto rounded-b-xl">
          {categoriesWithTopics.map((category) => (
            <div key={category.id} className="mb-2 border-b border-slate-600 last:border-none">
              <button
                onClick={() => toggleMobileAccordion(category.id)}
                className={`w-full flex justify-between items-center py-2 text-neutral-200 hover:bg-neutral-600 rounded px-2 ${isRTL ? "text-right" : "text-left"}`}
              >
                <span>{category.name}</span>
                {category.topics.length > 0 && (
                  <BsChevronDown className={`transition-transform ${mobileAccordionOpen === category.id ? "rotate-180" : ""}`} />
                )}
              </button>

              {mobileAccordionOpen === category.id && category.topics.length > 0 && (
                <div className={`mt-1 px-4 ${isRTL ? "text-right" : "text-left"}`}>
                  <div className="flex flex-col space-y-1">
                    {category.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => {
                          router.push(`/${locale}/topic/${topic.slug}`);
                          setMobileMenuOpen(false);
                        }}
                        className={`text-gray-200 hover:bg-neutral-600 p-2 rounded ${isRTL ? "text-right" : "text-left"}`}
                      >
                        {topic.title}
                      </button>
                    ))}
                  </div>
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
