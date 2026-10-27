import { Link } from 'wouter';
import { categoriesWithItems, facetsFor, featuredItems, homeContent, paragraphs, useCatalog, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CmsIcon } from '@/components/CmsIcon';
import { LaneLines } from '@/components/LaneLines';
import { Placeholder } from '@/components/Placeholder';
import { RunCard, RunCardSkeleton } from '@/components/RunCard';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';
import { TrackLanes } from '@/components/TrackLanes';

export default function Home() {
  const { t } = useI18n();
  const cms = useCmsPage('home');
  const home = homeContent(cms.page);
  const catalog = useCatalog();
  usePageMeta(cms.page?.title, cms.page?.metaDescription);

  const featured = featuredItems(catalog.items, 6);
  const lanes = categoriesWithItems(catalog.categories, catalog.items);
  const counts = facetsFor(catalog.items).categories;
  const categoryOf = (id: string | null) => catalog.categories.find((c) => c.id === id);
  const story = paragraphs(home.story.content);

  return (
    <>
      <section className="track on-track relative overflow-hidden">
        <div className="page grid items-stretch gap-10 md:grid-cols-12">
          <div className="py-12 md:col-span-6 md:py-20 md:pr-16">
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-4">
                <div className="skeleton-deep h-7 w-48" />
                <div className="skeleton-deep h-20 w-full" />
                <div className="skeleton-deep h-5 w-3/4" />
              </div>
            ) : cms.isError ? (
              <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
            ) : (
              <>
                {home.hero.badge && <p className="mb-5 w-fit rounded-md bg-[rgb(0_0_0/0.2)] px-3 py-1 font-semibold">{home.hero.badge}</p>}
                {home.hero.title && <h1 className="text-[clamp(3.25rem,9vw,7rem)]">{home.hero.title}</h1>}
                {home.hero.subtitle && <p className="mt-6 max-w-[34rem] text-xl">{home.hero.subtitle}</p>}
                <div className="mt-9 flex flex-wrap gap-3">
                  {home.hero.ctaPrimary && (
                    <Link href="/products" className="btn btn-lane">
                      {home.hero.ctaPrimary}
                    </Link>
                  )}
                  {home.hero.ctaSecondary && (
                    <Link href="/contact" className="btn btn-on-deep">
                      {home.hero.ctaSecondary}
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
          {home.hero.image && (
            <div className="relative -mx-[var(--gutter)] min-h-[18rem] md:col-span-6 md:mx-0 md:-mr-[var(--gutter)] md:min-h-0">
              <div className="slant absolute inset-0 bg-surface-deep">
                <StoreImage src={home.hero.image} alt="" priority sizes="(min-width: 768px) 50vw, 100vw" maxWidth={1400} fallback={<Placeholder tone="deep" />} />
              </div>
              <LaneLines />
            </div>
          )}
        </div>
      </section>

      {(lanes.length > 0 || catalog.isLoading) && (
        <section aria-labelledby={home.categories.title ? 'home-lanes' : undefined} className="page pt-16">
          {(home.categories.title || home.categories.subtitle) && (
            <div className="mb-6 max-w-2xl">
              {home.categories.title && (
                <h2 id="home-lanes" className="text-[clamp(2.4rem,5vw,3.75rem)] text-heading">
                  {home.categories.title}
                </h2>
              )}
              {home.categories.subtitle && <p className="mt-2 text-lg text-ink-soft">{home.categories.subtitle}</p>}
            </div>
          )}
          {catalog.isLoading ? (
            <div aria-hidden="true" className="skeleton h-72 rounded-frame" />
          ) : (
            <TrackLanes categories={lanes} counts={counts} />
          )}
        </section>
      )}

      <section aria-labelledby={home.featured.title ? 'home-start' : undefined} className="page pt-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {home.featured.badge && <p className="mb-2 font-semibold text-accent-text">{home.featured.badge}</p>}
            {home.featured.title && (
              <h2 id="home-start" className="text-[clamp(2.4rem,5vw,3.75rem)] text-heading">
                {home.featured.title}
              </h2>
            )}
            {home.featured.subtitle && <p className="mt-2 text-lg text-ink-soft">{home.featured.subtitle}</p>}
          </div>
          {catalog.items.length > 0 && (
            <Link href="/products" className="btn btn-quiet">
              {t('catalog.viewAll')}
            </Link>
          )}
        </div>
        {catalog.isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <RunCardSkeleton key={i} />
            ))}
          </div>
        ) : catalog.isError ? (
          <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
        ) : featured.length === 0 ? (
          <p className="rounded-frame bg-surface-raised p-6 text-ink-soft shadow-soft">{t('catalog.empty.store')}</p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {featured.map((item) => (
              <li key={item.id}>
                <RunCard item={item} category={categoryOf(item.categoryId)} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {home.benefits.length > 0 && (
        <section className="page pt-20">
          <div aria-hidden="true" className="lane-rule mb-10" />
          <ul className="grid gap-8 md:grid-cols-3">
            {home.benefits.map((benefit) => (
              <li key={benefit.title} className="flex gap-4">
                <span className="grid h-12 w-12 shrink-0 -skew-x-6 place-items-center rounded-md bg-[color:var(--accent)] text-[color:var(--accent-ink)]">
                  <CmsIcon icon={benefit.icon} className="h-6 w-6 skew-x-6" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-2xl text-heading">{benefit.title}</h3>
                  {benefit.description && <p className="mt-1 text-ink-soft">{benefit.description}</p>}
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(home.story.title || story.length > 0) && (
        <section className="page pt-20">
          <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-12">
            {home.story.image && (
              <div className="slant aspect-[4/3] overflow-hidden bg-surface-quiet md:col-span-6">
                <StoreImage src={home.story.image} alt="" sizes="(min-width: 768px) 45vw, 100vw" maxWidth={1280} fallback={<Placeholder />} />
              </div>
            )}
            <div className={home.story.image ? 'md:col-span-6' : 'md:col-span-9'}>
              {home.story.title && <h2 className="text-[clamp(2.4rem,5vw,3.75rem)] text-heading">{home.story.title}</h2>}
              <div className="mt-4 flex max-w-[60ch] flex-col gap-3 text-lg text-ink-soft">
                {story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link href="/about" className="btn btn-quiet mt-7">
                {t('nav.about')}
              </Link>
            </div>
          </div>
        </section>
      )}

      {(home.cta.title || home.cta.description) && (
        <section className="page pt-20">
          <div className="on-deep flex flex-col gap-6 rounded-frame bg-surface-deep p-8 text-ink-on-deep md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              {home.cta.title && <h2 className="text-[clamp(2.4rem,5vw,3.5rem)]">{home.cta.title}</h2>}
              {home.cta.description && <p className="mt-2 text-lg text-ink-on-deep-soft">{home.cta.description}</p>}
            </div>
            {home.cta.buttonText && (
              <Link href="/contact" className="btn btn-lane shrink-0">
                {home.cta.buttonText}
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
