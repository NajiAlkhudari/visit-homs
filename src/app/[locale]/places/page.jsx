"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { resolveImageUrl, useTourismStore } from "@/store/tourismStore";

const flattenCategories = (items, output = []) => {
  items.forEach((item) => {
    output.push(item);

    if (item.children?.length) {
      flattenCategories(item.children, output);
    }
  });

  return output;
};

const PlacesPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const selectedCategoryValue = searchParams.get("category") || "all";

  const { places, loading, error, getPublishedPlaces } = useTourismStore();
  const [categories, setCategories] = useState([]);
  const isGuid = /^[0-9a-fA-F-]{36}$/.test(selectedCategoryValue);

  const activeCategory =
    selectedCategoryValue === "all"
      ? null
      : categories.find(
          (category) =>
            category.id === selectedCategoryValue ||
            category.slug === selectedCategoryValue
        ) || null;

  const categoryId =
    selectedCategoryValue === "all"
      ? null
      : activeCategory?.id || (isGuid ? selectedCategoryValue : null);

  useEffect(() => {
    getPublishedPlaces(locale, categoryId);
  }, [categoryId, getPublishedPlaces, locale]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Category/tree?lang=${locale}`,
          {
            headers: {
              "Content-Type": "application/json",
              Version: 1.0,
            },
          }
        );

        setCategories(flattenCategories(response.data.data ?? []));
      } catch (fetchError) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, [locale]);

  const categoryLookup = categories.reduce((lookup, category) => {
    lookup[category.id] = category.name;
    return lookup;
  }, {});

  const handleCategoryChange = (value) => {
    if (value === "all") {
      router.push("/places");
      return;
    }

    router.push(`/places?category=${value}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10" dir={direction}>
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
            {t("places")}
          </p>
          <h1 className="mt-2 text-4xl font-bold text-stone-900">
            {locale === "ar" ? "اكتشف أجمل الأماكن في حمص" : "Discover Homs Places"}
          </h1>
        </div>

        <div
          className={`flex flex-wrap items-center gap-3 ${
            isRTL ? "justify-end" : "justify-start"
          }`}
        >
          <button
            type="button"
            onClick={() => handleCategoryChange("all")}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              selectedCategoryValue === "all"
                ? "border-stone-900 bg-stone-900 text-white"
                : "border-stone-300 bg-white text-stone-700"
            }`}
          >
            {locale === "ar" ? "الكل" : "All"}
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategoryChange(category.slug || category.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                activeCategory?.id === category.id
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-300 bg-white text-stone-700"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-3xl border border-stone-200 bg-white"
            >
              <div className="h-56 animate-pulse bg-stone-200" />
              <div className="space-y-3 p-6">
                <div className="h-6 w-2/3 animate-pulse rounded bg-stone-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-stone-200" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-stone-200" />
              </div>
            </div>
          ))}
        </div>
      ) : places.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-stone-600">
          {t("noResults")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {places.map((place) => (
            <Link
              key={place.id}
              href={`/places/${place.id}`}
              className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden bg-stone-200">
                {place.heroImageUrl ? (
                  <Image
                    src={resolveImageUrl(place.heroImageUrl)}
                    alt={place.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-stone-500">
                    {locale === "ar" ? "لا توجد صورة" : "No image"}
                  </div>
                )}
              </div>

              <div className="space-y-3 p-6">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-stone-900">
                    {place.name}
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                    {place.priceRange || (locale === "ar" ? "غير محدد" : "Unlisted")}
                  </span>
                </div>

                <p className="text-sm text-stone-500">
                  {categoryLookup[place.categoryId] ||
                    (locale === "ar" ? "بدون تصنيف" : "Uncategorized")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {error ? (
        <p className="mt-6 text-center text-sm text-red-600">{error}</p>
      ) : null}
    </div>
  );
};

export default PlacesPage;
