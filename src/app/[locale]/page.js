import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Header from '@/components/partials/Header';

export default function HomePage() {
  const t = useTranslations('HomePage');
  
  return (
    <div>
      <Header />
      {/* <h1>{t('title')}</h1>
      <Link href="/home">{t('home')}</Link> */}
    </div>
  );
}
