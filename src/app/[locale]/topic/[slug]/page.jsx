"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSection } from "@/store/sectionStore";
import { useLocale } from "next-intl";
import Image from "next/image";
import { resolveImageUrl } from "@/store/tourismStore";

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug;
  const locale = useLocale();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const { topicBySlug, getTopicBySlug, loading, error } = useSection();

  useEffect(() => {
    if (!slug) return;
    getTopicBySlug(slug, locale);
  }, [slug, getTopicBySlug, locale]);

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p>{error}</p>;
  if (!topicBySlug) return <p>لم يتم العثور على الموضوع.</p>;

  return (
    <div className="p-4" dir={direction}>
      <h1 className="p-4 text-3xl font-bold text-black">{topicBySlug.title}</h1>
      <Image
        src={resolveImageUrl(topicBySlug.imageUrl)}
        alt={topicBySlug.title}
        className="mt-4 w-full max-w-md"
        width={400}
        height={200}
      />
      {topicBySlug?.content && (
        <div
          className="prose prose-lg max-w-none rtl:prose-rtl"
          dangerouslySetInnerHTML={{ __html: topicBySlug.content }}
        />
      )}
    </div>
  );
}
