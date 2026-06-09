"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resolveImageUrl, useTourismStore } from "@/store/tourismStore";

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

const EventsPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const { events, loading, error, getUpcomingEvents } = useTourismStore();

  useEffect(() => {
    getUpcomingEvents(locale);
  }, [getUpcomingEvents, locale]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10" dir={direction}>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
          {t("events")}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-stone-900">
          {locale === "ar" ? "فعاليات قادمة في حمص" : "Upcoming events in Homs"}
        </h1>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
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
      ) : events.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-stone-600">
          {t("noResults")}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`}
              className="group overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 bg-stone-200">
                {event.imageUrl ? (
                  <Image
                    src={resolveImageUrl(event.imageUrl)}
                    alt={event.title}
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
                <h2 className="text-2xl font-semibold text-stone-900">
                  {event.title}
                </h2>
                <p className="text-sm text-stone-500">
                  {formatDateRange(locale, event.startDate, event.endDate)}
                </p>
                <p className="text-sm text-stone-700">
                  {event.location ||
                    (locale === "ar" ? "الموقع سيُعلن لاحقًا" : "Location to be announced")}
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

export default EventsPage;
