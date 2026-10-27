import { aboutContent, paragraphs, useCmsPage, usePageMeta } from '@/core';
import { useI18n } from '@/i18n';
import { CmsIcon } from '@/components/CmsIcon';
import { LaneLines } from '@/components/LaneLines';
import { Placeholder } from '@/components/Placeholder';
import { SectionError } from '@/components/StoreStates';
import { StoreImage } from '@/components/StoreImage';

export default function About() {
  const { t } = useI18n();
  const cms = useCmsPage('about');
  const about = aboutContent(cms.page);
  usePageMeta(cms.page?.title ?? t('nav.about'), cms.page?.metaDescription);
  const story = paragraphs(about.story.content);

  return (
    <>
      <section className="track on-track relative overflow-hidden">
        <div className="page grid items-stretch gap-10 md:grid-cols-12">
          <div className="py-12 md:col-span-6 md:py-20 md:pr-16">
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-3">
                <div className="skeleton-deep h-16 w-64" />
                <div className="skeleton-deep h-5 w-80 max-w-full" />
              </div>
            ) : cms.isError ? (
              <SectionError title={t('state.error.title')} onRetry={cms.refetch} />
            ) : (
              <>
                <h1 className="text-[clamp(3rem,8vw,6rem)]">{about.hero.title ?? t('nav.about')}</h1>
                {about.hero.subtitle && <p className="mt-5 max-w-xl text-xl">{about.hero.subtitle}</p>}
              </>
            )}
          </div>
          {about.hero.image && (
            <div className="relative -mx-[var(--gutter)] min-h-[16rem] md:col-span-6 md:mx-0 md:-mr-[var(--gutter)] md:min-h-0">
              <div className="slant absolute inset-0 bg-surface-deep">
                <StoreImage src={about.hero.image} alt="" priority sizes="(min-width: 768px) 50vw, 100vw" maxWidth={1400} fallback={<Placeholder tone="deep" />} />
              </div>
              <LaneLines />
            </div>
          )}
        </div>
      </section>

      <div className="page">
        {(about.story.title || story.length > 0) && (
          <section className="grid gap-10 pt-16 md:grid-cols-12 md:items-center">
            <div className={about.story.image ? 'md:col-span-7' : 'md:col-span-9'}>
              {about.story.title && <h2 className="text-[clamp(2.4rem,5vw,3.75rem)] text-heading">{about.story.title}</h2>}
              <div className="mt-4 flex max-w-[62ch] flex-col gap-3 text-lg text-ink-soft">
                {story.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            {about.story.image && (
              <div className="slant aspect-[4/3] overflow-hidden bg-surface-quiet md:col-span-5">
                <StoreImage src={about.story.image} alt="" sizes="(min-width: 768px) 35vw, 100vw" maxWidth={960} fallback={<Placeholder />} />
              </div>
            )}
          </section>
        )}

        {about.values.items.length > 0 && (
          <section className="pt-16">
            {about.values.title && <h2 className="mb-6 text-[clamp(2.4rem,5vw,3.75rem)] text-heading">{about.values.title}</h2>}
            <ul className="track on-track lanes overflow-hidden rounded-frame">
              {about.values.items.map((value) => (
                <li key={value.title} className="flex items-start gap-4 px-5 py-6 sm:px-8">
                  <CmsIcon icon={value.icon} className="mt-1 h-7 w-7 shrink-0" strokeWidth={2} />
                  <div>
                    <h3 className="text-3xl">{value.title}</h3>
                    {value.description && <p className="mt-1 text-lg">{value.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
