"use client";

import axios from "axios";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import WeatherDashboard from "@/components/WeatherDashboard";
import { resolveImageUrl } from "@/store/tourismStore";
import { BsArrowDown, BsCalendarEvent, BsGeoAlt } from "react-icons/bs";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// IDs الجديدة للـ parent categories
const EXPLORE_HOMS_ID   = "cbb85c16-34f1-4c4c-bfb9-c790be5a1b1f";
const FOOD_DRINK_ID     = "cf76f43f-7295-4b0e-bf9c-cb636282cc80";
const STAY_ID           = "b59869f2-91de-45f0-87b6-04ecdaf16f36";
const NATURE_ID         = "0e66e26a-f0b7-4297-b353-762e298979e6";
// IDs الجديدة للـ child categories
const RESTAURANTS_ID    = "f6ea75ca-d4f6-49f5-b06f-c207b09632d2";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const flattenCategories = (items, output = []) => {
  items.forEach((item) => {
    output.push(item);
    if (item.children?.length) flattenCategories(item.children, output);
  });
  return output;
};

const stripHtml = (value = "") =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const formatDateRange = (locale, startDate, endDate, fallbackLabel) => {
  const formatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-SY" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const start = startDate ? formatter.format(new Date(startDate)) : "";
  const end   = endDate   ? formatter.format(new Date(endDate))   : "";
  if (!start && !end) return fallbackLabel;
  if (!end || start === end) return start;
  return `${start} - ${end}`;
};

function AnimatedSection({ children, className = "", variants = fadeUp, amount = 0.2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount });
  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({ eyebrow, title, subtitle, cta, isRTL }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className={isRTL ? "md:text-right" : "md:text-left"}>
        {eyebrow && (
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700/80">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 text-3xl font-semibold text-stone-950 md:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-600">{subtitle}</p>
        )}
      </div>
      {cta}
    </div>
  );
}

export default function HomePage() {
  const locale    = useLocale();
  const t         = useTranslations();
  const isRTL     = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const arrow     = isRTL ? "\u2190" : "\u2192";

  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [categories, setCategories] = useState([]);
  const [places,     setPlaces]     = useState([]);
  const [events,     setEvents]     = useState([]);
  const [articles,   setArticles]   = useState([]);

  useEffect(() => {
    let cancelled = false;
    const fetchHomeData = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = { "Content-Type": "application/json", Version: "1" };
        const [catRes, placesRes, eventsRes, articlesRes] = await Promise.all([
          axios.get(`${apiUrl}/api/Category/tree?lang=${locale}`,      { headers }),
          axios.get(`${apiUrl}/api/Place/published?lang=${locale}`,    { headers }),
          axios.get(`${apiUrl}/api/Event/upcoming?lang=${locale}`,     { headers }),
          axios.get(`${apiUrl}/api/Article?lang=${locale}`,            { headers }),
        ]);
        if (cancelled) return;
        setCategories(flattenCategories(catRes.data.data ?? []));
        setPlaces(placesRes.data.data ?? []);
        setEvents(eventsRes.data.data ?? []);
        setArticles((articlesRes.data.data ?? []).filter((a) => a.isPublished));
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchHomeData();
    return () => { cancelled = true; };
  }, [locale]);

  const categoryById = useMemo(
    () => categories.reduce((acc, c) => { acc[c.id] = c; return acc; }, {}),
    [categories]
  );

  const featuredPlaces    = places.slice(0, 6);
  const featuredEvents    = events.slice(0, 3);
  const featuredArticles  = articles.slice(0, 3);
  const restaurantPlaces  = places
    .filter((p) => p.categoryId === RESTAURANTS_ID)
    .slice(0, 4);
  const mapMarkers = places
    .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude) && p.latitude !== 0 && p.longitude !== 0)
    .map((p) => ({ lat: p.latitude, lng: p.longitude, title: p.name }));

  // Quick category bar — parent categories بالـ IDs الجديدة
  const quickCategories = [
    { emoji: "🏛️", label: t("home.quickCategories.items.explore"),    href: `/places?category=${EXPLORE_HOMS_ID}` },
    { emoji: "🍽️", label: t("home.quickCategories.items.food"),       href: `/places?category=${FOOD_DRINK_ID}` },
    { emoji: "🏨", label: t("home.quickCategories.items.stay"),        href: `/places?category=${STAY_ID}` },
    { emoji: "🌿", label: t("home.quickCategories.items.nature"),      href: `/places?category=${NATURE_ID}` },
    { emoji: "📅", label: t("home.quickCategories.items.events"),      href: "/events" },
    { emoji: "📰", label: t("home.quickCategories.items.articles"),    href: "/articles" },
  ];

  return (
    <div
      dir={direction}
      lang={locale}
      className="bg-[linear-gradient(180deg,#f5f0e8_0%,#fffdf9_22%,#f7f6f2_62%,#eef4f1_100%)] text-stone-900"
    >
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.15)_0%,rgba(10,10,10,0.48)_45%,rgba(10,10,10,0.82)_100%)]" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center text-white"
        >
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.45em] text-white/80">
            {t("home.hero.eyebrow")}
          </p>
          <h1 className="text-5xl font-semibold md:text-7xl">{t("home.hero.title")}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/85 md:text-2xl">
            {t("home.hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white"
        >
          <div className="flex flex-col items-center gap-2 text-sm tracking-[0.2em]">
            <span>{t("home.hero.scroll")}</span>
            <BsArrowDown className="text-xl" />
          </div>
        </motion.div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Quick Categories */}
        <AnimatedSection className="mb-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex snap-x gap-4 overflow-x-auto pb-4"
          >
            {quickCategories.map((item) => (
              <motion.div key={item.label} variants={fadeUp} className="min-w-[140px] snap-start">
                <Link
                  href={item.href}
                  className="group flex h-full min-h-[130px] flex-col items-center justify-center rounded-[28px] border border-white/70 bg-white/90 p-5 text-center shadow-[0_18px_60px_-30px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_24px_70px_-28px_rgba(5,150,105,0.4)]"
                >
                  <span className="text-3xl">{item.emoji}</span>
                  <span className="mt-3 text-sm font-semibold text-stone-900">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {/* Featured Places */}
        <AnimatedSection className="mb-16">
          <SectionHeading
            eyebrow={t("home.featuredPlaces.eyebrow")}
            title={t("home.featuredPlaces.title")}
            subtitle={t("home.featuredPlaces.subtitle")}
            cta={
              <Link href="/places" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
                {t("home.common.viewAll")} {arrow}
              </Link>
            }
            isRTL={isRTL}
          />
          {loading ? (
            <div className="flex gap-5 overflow-x-auto pb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[320px] min-w-[280px] animate-pulse rounded-[30px] bg-stone-200" />
              ))}
            </div>
          ) : featuredPlaces.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center text-stone-600">
              {t("noResults")}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex snap-x gap-5 overflow-x-auto pb-4"
            >
              {featuredPlaces.map((place) => (
                <motion.div key={place.id} variants={fadeRight} className="min-w-[280px] max-w-[320px] flex-1 snap-start">
                  <Link
                    href={`/places/${place.id}`}
                    className="group relative block h-[320px] overflow-hidden rounded-[30px] shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <Image
                      src={resolveImageUrl(place.heroImageUrl) || "/homs.png"}
                      alt={place.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.78)_100%)]" />
                    <div className="absolute inset-x-0 top-0 flex justify-end p-5">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-800">
                        {categoryById[place.categoryId]?.name || t("home.common.uncategorized")}
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <h3 className="text-2xl font-semibold">{place.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatedSection>

        {/* Events */}
        <AnimatedSection className="mb-16">
          <SectionHeading
            eyebrow={t("home.events.eyebrow")}
            title={t("home.events.title")}
            cta={
              <Link href="/events" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
                {t("home.events.viewAll")} {arrow}
              </Link>
            }
            isRTL={isRTL}
          />
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[360px] animate-pulse rounded-[28px] bg-stone-200" />
              ))}
            </div>
          ) : featuredEvents.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center text-stone-600">
              {t("noResults")}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {featuredEvents.map((event) => (
                <motion.div key={event.id} variants={fadeUp}>
                  <Link
                    href={`/events/${event.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_-36px_rgba(5,150,105,0.32)]"
                  >
                    <div className="relative h-56 overflow-hidden bg-stone-200">
                      <Image
                        src={resolveImageUrl(event.imageUrl) || "/homs.png"}
                        alt={event.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-6">
                      <h3 className="text-2xl font-semibold text-stone-950">{event.title}</h3>
                      <div className="flex items-start gap-3 text-sm text-stone-600">
                        <BsCalendarEvent className="mt-1 text-emerald-700" />
                        <span>{formatDateRange(locale, event.startDate, event.endDate, t("home.events.dateFallback"))}</span>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-stone-600">
                        <BsGeoAlt className="mt-1 text-emerald-700" />
                        <span>{event.location || t("home.events.locationFallback")}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatedSection>

        {/* About */}
        <AnimatedSection className="mb-16 rounded-[36px] bg-white/80 p-6 shadow-[0_30px_90px_-48px_rgba(15,23,42,0.42)] md:p-10">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }}>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-700/80">
                {t("home.about.eyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-stone-950 md:text-4xl">
                {t("about.title")}
              </h2>
              <p className="mt-5 text-base leading-8 text-stone-600">{t("about.description")}</p>
              <Link
                href="/articles"
                className="mt-8 inline-flex rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                {t("home.about.readMore")}
              </Link>
            </motion.div>
            <motion.div
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              className="relative h-[320px] overflow-hidden rounded-[32px] md:h-[440px]"
            >
              <Image
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
                alt={t("home.about.imageAlt")}
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </AnimatedSection>

        {/* Restaurants */}
        <AnimatedSection className="mb-16">
          <SectionHeading
            eyebrow={t("home.restaurants.eyebrow")}
            title={t("home.restaurants.title")}
            cta={
              <Link href={`/places?category=${FOOD_DRINK_ID}`} className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
                {t("home.restaurants.viewAll")} {arrow}
              </Link>
            }
            isRTL={isRTL}
          />
          {loading ? (
            <div className="flex gap-5 overflow-x-auto pb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[300px] min-w-[260px] animate-pulse rounded-[30px] bg-stone-200" />
              ))}
            </div>
          ) : restaurantPlaces.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center text-stone-600">
              {t("noResults")}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="flex snap-x gap-5 overflow-x-auto pb-4"
            >
              {restaurantPlaces.map((place) => (
                <motion.div key={place.id} variants={fadeLeft} className="min-w-[260px] max-w-[320px] snap-start">
                  <Link
                    href={`/places/${place.id}`}
                    className="group relative block h-[300px] overflow-hidden rounded-[30px] shadow-[0_24px_80px_-32px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <Image
                      src={resolveImageUrl(place.heroImageUrl) || "/homs.png"}
                      alt={place.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08)_0%,rgba(15,23,42,0.82)_100%)]" />
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <div className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-white/70">
                        {place.priceRange || t("home.common.uncategorized")}
                      </div>
                      <h3 className="text-2xl font-semibold">{place.name}</h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatedSection>

        {/* Articles */}
        <AnimatedSection className="mb-16">
          <SectionHeading
            eyebrow={t("home.articles.eyebrow")}
            title={t("home.articles.title")}
            cta={
              <Link href="/articles" className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800">
                {t("home.articles.viewAll")} {arrow}
              </Link>
            }
            isRTL={isRTL}
          />
          {loading ? (
            <div className="grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[360px] animate-pulse rounded-[28px] bg-stone-200" />
              ))}
            </div>
          ) : featuredArticles.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/70 px-6 py-16 text-center text-stone-600">
              {t("noResults")}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {featuredArticles.map((article) => (
                <motion.div key={article.id} variants={fadeUp}>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_-36px_rgba(5,150,105,0.32)]"
                  >
                    <div className="relative h-56 overflow-hidden bg-stone-200">
                      <Image
                        src={resolveImageUrl(article.coverImageUrl) || "/homs.png"}
                        alt={article.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-2xl font-semibold text-stone-950">{article.title}</h3>
                      <p className="mt-4 line-clamp-4 text-sm leading-7 text-stone-600">
                        {stripHtml(article.content).slice(0, 100)}
                        {stripHtml(article.content).length > 100 ? "..." : ""}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatedSection>

        {/* Map */}
        <AnimatedSection className="mb-16 rounded-[36px] bg-emerald-50/70 px-6 py-10 md:px-8">
          <SectionHeading
            eyebrow={t("home.map.eyebrow")}
            title={t("home.map.title")}
            subtitle={t("home.map.subtitle")}
            isRTL={isRTL}
          />
          <div className="overflow-hidden rounded-[28px] border border-emerald-100 bg-white p-3 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
            <Map markers={mapMarkers} />
          </div>
        </AnimatedSection>

        {/* Weather */}
        <AnimatedSection className="mb-16">
          <WeatherDashboard />
        </AnimatedSection>

        {/* Plan Your Visit */}
        <AnimatedSection className="mb-10">
          <SectionHeading
            eyebrow={t("home.plan.eyebrow")}
            title={t("home.plan.title")}
            isRTL={isRTL}
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"
          >
            {[
              { icon: "🌤️", title: t("home.plan.cards.bestTime.title"),  text: t("home.plan.cards.bestTime.text") },
              { icon: "🕌", title: t("home.plan.cards.culture.title"),   text: t("home.plan.cards.culture.text") },
              { icon: "🚗", title: t("home.plan.cards.transport.title"), text: t("home.plan.cards.transport.text") },
              { icon: "💱", title: t("home.plan.cards.currency.title"),  text: t("home.plan.cards.currency.text") },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_80px_-45px_rgba(15,23,42,0.42)]"
              >
                <div className="text-4xl">{item.icon}</div>
                <h3 className="mt-5 text-xl font-semibold text-stone-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatedSection>

        {error && (
          <div className="rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}