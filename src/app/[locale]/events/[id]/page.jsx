"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resolveImageUrl, useTourismStore } from "@/store/tourismStore";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const formatDateRange = (locale, startDate, endDate) => {
  const formatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const start = startDate ? formatter.format(new Date(startDate)) : "";
  const end = endDate ? formatter.format(new Date(endDate)) : "";

  if (!start && !end) return locale === "ar" ? "الموعد قريبًا" : "Coming soon";
  if (!end || start === end) return start;

  return `${start} - ${end}`;
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const { event, loading, error, getEventById } = useTourismStore();

  useEffect(() => {
    if (id) {
      getEventById(id, locale);
    }
  }, [getEventById, id, locale]);

  const hasCoordinates =
    typeof event?.latitude === "number" &&
    typeof event?.longitude === "number" &&
    !(event.latitude === 0 && event.longitude === 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10" dir={direction}>
      <Link
        href="/events"
        className="mb-6 inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 transition hover:bg-stone-100"
      >
        {locale === "ar" ? "العودة إلى الفعاليات" : "Back to events"}
      </Link>

      {loading ? (
        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-3xl bg-stone-200" />
          <div className="h-10 w-1/2 animate-pulse rounded bg-stone-200" />
          <div className="h-24 animate-pulse rounded bg-stone-200" />
        </div>
      ) : !event ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-stone-600">
          {error || (locale === "ar" ? "الفعالية غير موجودة" : "Event not found")}
        </div>
      ) : (
        <div className="space-y-8">
          <div className="relative h-[420px] overflow-hidden rounded-[2rem] bg-stone-200">
            {event.imageUrl ? (
              <Image
                src={resolveImageUrl(event.imageUrl)}
                alt={event.title}
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
                  {locale === "ar" ? "تفاصيل الفعالية" : "Event details"}
                </p>
                <h1 className="mt-3 text-4xl font-bold text-stone-900">
                  {event.title}
                </h1>
              </div>

              <div
                className="prose prose-lg max-w-none text-stone-700"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>

            <div className="space-y-4 rounded-[2rem] bg-stone-100 p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  {locale === "ar" ? "التاريخ" : "Date"}
                </p>
                <p className="mt-2 text-base text-stone-800">
                  {formatDateRange(locale, event.startDate, event.endDate)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  {locale === "ar" ? "الموقع" : "Location"}
                </p>
                <p className="mt-2 text-base text-stone-800">
                  {event.location ||
                    (locale === "ar" ? "سيتم الإعلان عنه لاحقًا" : "To be announced")}
                </p>
              </div>
            </div>
          </div>

          {hasCoordinates ? (
            <Map
              center={[event.latitude, event.longitude]}
              markers={[
                {
                  lat: event.latitude,
                  lng: event.longitude,
                  title: event.title,
                },
              ]}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default EventDetailsPage;
