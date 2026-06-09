"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resolveImageUrl } from "@/store/tourismStore";

const ArticlesPage = () => {
  const locale = useLocale();
  const t = useTranslations();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/Article?lang=${locale}`,
          {
            headers: {
              "Content-Type": "application/json",
              Version: 1.0,
            },
          }
        );

        if (cancelled) {
          return;
        }

        setArticles((response.data.data ?? []).filter((article) => article.isPublished));
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError?.response?.data?.message || fetchError.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10" dir={direction}>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
          {t("home.articles.eyebrow")}
        </p>
        <h1 className="mt-2 text-4xl font-bold text-stone-900">
          {t("home.articles.title")}
        </h1>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-[360px] animate-pulse rounded-[28px] bg-stone-200"
            />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-stone-600">
          {t("noResults")}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="group overflow-hidden rounded-[28px] border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-56 overflow-hidden bg-stone-200">
                <Image
                  src={resolveImageUrl(article.coverImageUrl) || "/homs.png"}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="space-y-3 p-6">
                <h2 className="text-2xl font-semibold text-stone-900">
                  {article.title}
                </h2>
                <p className="line-clamp-4 text-sm leading-7 text-stone-600">
                  {article.content.replace(/<[^>]*>/g, " ").slice(0, 140)}
                  {article.content.length > 140 ? "..." : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {error ? <p className="mt-6 text-center text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default ArticlesPage;
