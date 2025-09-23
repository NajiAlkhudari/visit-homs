"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSection } from "@/store/sectionStore";
import { useLocale } from "next-intl";
import Image from "next/image";

export default function TopicPage() {
  const params = useParams();
  const slug = params.slug;
  const locale = useLocale();
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";


  function unescapeHtml(escaped) {
  const parser = new DOMParser();
  const decoded = parser.parseFromString(escaped, 'text/html');
  return decoded.body.textContent || '';
}
  const { topicBySlug, getTopicBySlug, loading, error } = useSection();

  useEffect(() => {
    if (!slug) return;
    getTopicBySlug(slug , locale); // أو اللغة حسب الحاجة
  }, [slug, getTopicBySlug]);

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p>{error}</p>;
  if (!topicBySlug) return <p>لم يتم العثور على الموضوع.</p>;


   return (
  <div className="p-4" dir={direction}>
    <h1 className="p-4 text-3xl font-bold text-black">{topicBySlug.title}</h1>
       <Image 
     src={`${process.env.NEXT_PUBLIC_API_URL}/${(topicBySlug.imageUrl)}`} alt={topicBySlug.title} className="mt-4 w-full max-w-md" 
     width={400}
     height={200}
     />
{topicBySlug?.content && (
  <div
    dangerouslySetInnerHTML={{
      __html: unescapeHtml(topicBySlug.content),
    }}
  />
)}    
 
  </div>
);
  
}
