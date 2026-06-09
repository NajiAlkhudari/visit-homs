"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resolveImageUrl, useTourismStore } from "@/store/tourismStore";

const ArticleDetailsPage = () => {
  const { slug } = useParams();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  const { article, loading, error, getArticleBySlug } = useTourismStore();

  useEffect(() => {
    if (slug) {
      getArticleBySlug(slug, locale);
    }
  }, [getArticleBySlug, slug, locale]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10" dir={direction}>
      <Link
        href="/search"
        className="mb-6 inline-flex items-center rounded-full border border-stone-300 px-4 py-2 text-sm text-stone-700 transition hover:bg-stone-100"
      >
        {locale === "ar" ? "العودة إلى البحث" : "Back to search"}
      </Link>

      {loading ? (
        <div className="space-y-6">
          <div className="h-80 animate-pulse rounded-3xl bg-stone-200" />
          <div className="h-10 w-1/2 animate-pulse rounded bg-stone-200" />
          <div className="h-24 animate-pulse rounded bg-stone-200" />
        </div>
      ) : !article ? (
        <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-16 text-center text-stone-600">
          {error || (locale === "ar" ? "المقال غير موجود" : "Article not found")}
        </div>
      ) : (
        <article className="space-y-8">
          <div className="relative h-[420px] overflow-hidden rounded-[2rem] bg-stone-200">
            {article.coverImageUrl ? (
              <Image
                src={resolveImageUrl(article.coverImageUrl)}
                alt={article.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-stone-500">
                {locale === "ar" ? "لا توجد صورة" : "No image"}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
              {locale === "ar" ? "مقال" : "Article"}
            </p>
            <h1 className="text-4xl font-bold text-stone-900">{article.title}</h1>
          </div>

          <div
            className="prose prose-lg max-w-none rtl:prose-rtl text-stone-700"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      )}
    </div>
  );
};

export default ArticleDetailsPage;
