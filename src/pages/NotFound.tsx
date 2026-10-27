import { Link } from 'wouter';
import { usePageMeta } from '@/core';
import { useI18n } from '@/i18n';

export default function NotFound() {
  const { t } = useI18n();
  usePageMeta(t('notFound.title'));
  return (
    <section className="track on-track relative overflow-hidden">
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M${62 + i * 9} 0L${48 + i * 9} 100`} fill="none" strokeWidth="3" vectorEffect="non-scaling-stroke" style={{ stroke: 'var(--lane-line)', strokeOpacity: 0.55 }} />
        ))}
      </svg>
      <div className="page relative py-20 md:py-28">
        <h1 className="max-w-2xl text-[clamp(3rem,8vw,6rem)]">{t('notFound.title')}</h1>
        <p className="mt-5 max-w-md text-xl">{t('notFound.body')}</p>
        <Link href="/" className="btn btn-lane mt-8">
          {t('notFound.cta')}
        </Link>
      </div>
    </section>
  );
}
