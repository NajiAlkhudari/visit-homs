"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resolveImageUrl, useTourismStore } from "@/store/tourismStore";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const PlacesDetailsPage = () => {
  const { id } = useParams();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const { place, loading, error, getPlaceById } = useTourismStore();

  useEffect(() => {
    if (id) {
      getPlaceById(id, locale);
    }
  }, [getPlaceById, id, locale]);

  const hasCoordinates =
    typeof place?.latitude === "number" &&
    typeof place?.longitude === "number" &&
    !(place.latitude === 0 && place.longitude === 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10" dir={direction}>
      <Link
        href="/places"
        className="mb-6 inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 transition hover:bg-stone-100"
      >
        {locale === "ar" ? "العودة إلى الأماكن" : "Back to places"}
      </Link>

      {loading ? (
        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-3xl bg-stone-200" />
          <div className="h-10 w-1/2 animate-pulse rounded bg-stone-200" />
          <div className="h-24 animate-pulse rounded bg-stone-200" />
        </div>
      ) : !place ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-stone-600">
          {error || (locale === "ar" ? "المكان غير موجود" : "Place not found")}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="relative h-[420px] overflow-hidden rounded-[2rem] bg-stone-200">
            {place.heroImageUrl ? (
              <Image
                src={resolveImageUrl(place.heroImageUrl)}
                alt={place.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-500">
                {locale === "ar" ? "لا توجد صورة" : "No image"}
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
                  {locale === "ar" ? "تفاصيل المكان" : "Place details"}
                </p>
                <h1 className="mt-3 text-4xl font-bold text-stone-900">
                  {place.name}
                </h1>
              </div>

              <div
                className="prose prose-lg max-w-none text-stone-700"
                dangerouslySetInnerHTML={{ __html: place.description }}
              />
            </div>

            <div className="space-y-4 rounded-[2rem] bg-stone-100 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  {locale === "ar" ? "العنوان" : "Address"}
                </p>
                <p className="mt-2 text-base text-stone-800">
                  {place.address || (locale === "ar" ? "غير متوفر" : "Not available")}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  {locale === "ar" ? "ساعات العمل" : "Opening hours"}
                </p>
                <p className="mt-2 text-base text-stone-800">
                  {place.openingHours ||
                    (locale === "ar" ? "غير متوفرة" : "Not available")}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  {locale === "ar" ? "التكلفة" : "Price range"}
                </p>
                <p className="mt-2 text-base text-stone-800">
                  {place.priceRange ||
                    (locale === "ar" ? "غير محددة" : "Not available")}
                </p>
              </div>
            </div>
          </div>

          {hasCoordinates ? (
            <Map
              center={[place.latitude, place.longitude]}
              markers={[
                {
                  lat: place.latitude,
                  lng: place.longitude,
                  title: place.name,
                },
              ]}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default PlacesDetailsPage;
