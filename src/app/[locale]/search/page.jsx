"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resolveImageUrl, useTourismStore } from "@/store/tourismStore";

const SearchPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const { searchResults, loading, error, search } = useTourismStore();

  useEffect(() => {
    if (query.trim()) {
      search(query.trim());
    }
  }, [query, search]);

  const groups = [
    {
      key: "place",
      label: locale === "ar" ? "الأماكن" : "Places",
      href: (item) => `/places/${item.slugOrId}`,
    },
    {
      key: "event",
      label: locale === "ar" ? "الفعاليات" : "Events",
      href: (item) => `/events/${item.slugOrId}`,
    },
    {
      key: "article",
      label: locale === "ar" ? "المقالات" : "Articles",
      href: (item) => `/articles/${item.slugOrId}`,
    },
    {
      key: "topic",
      label: locale === "ar" ? "المواضيع" : "Topics",
      href: (item) => `/topic/${item.slugOrId}`,
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-10" dir={direction}>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
          {t("search")}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-stone-900">
          {query
            ? `${locale === "ar" ? "نتائج البحث عن" : "Search results for"} "${query}"`
            : t("search")}
        </h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl bg-stone-200"
            />
          ))}
        </div>
      ) : !query.trim() || searchResults.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-stone-600">
          {t("noResults")}
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((group) => {
            const items = searchResults.filter((item) => item.type === group.key);

            if (items.length === 0) return null;

            return (
              <section key={group.key} className="space-y-4">
                <h2 className="text-2xl font-semibold text-stone-900">
                  {group.label}
                </h2>

                <div className="space-y-3">
                  {items.map((item) => (
                    <Link
                      key={`${group.key}-${item.id}`}
                      href={group.href(item)}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-white px-5 py-4 text-stone-800 shadow-sm transition hover:border-stone-900 hover:shadow-md"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 flex-none overflow-hidden rounded-2xl bg-stone-100">
                          {item.imageUrl ? (
                            <Image
                              src={resolveImageUrl(item.imageUrl)}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xs text-stone-400">
                              {locale === "ar" ? "بدون صورة" : "No image"}
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-lg font-medium">{item.title}</p>
                          <p className="mt-1 text-sm text-stone-500">
                            {group.label}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-stone-400">
                        {locale === "ar" ? "عرض" : "View"}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {error ? (
        <p className="mt-6 text-center text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
};

export default SearchPage;
