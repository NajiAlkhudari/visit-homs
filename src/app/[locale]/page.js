'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import CarouselDemo from '@/components/partials/CarouselDemo';
import WeatherDashboard from '@/components/WeatherDashboard';

export default function HomePage() {
  const t = useTranslations('about');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const direction = isRTL ? 'rtl' : 'ltr';

  return (
    <div dir={direction} lang={locale}>
      <div>
        <CarouselDemo />
      </div>

      <div className="px-6 py-10 text-gray-900 max-w-7xl mx-auto ">
        <h1 className="text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-base text-gray-600 mt-4 leading-relaxed">{t('description')}</p>
      </div>
      <WeatherDashboard />
    </div>
  );
}