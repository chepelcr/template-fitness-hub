import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';
import {
  productsContent,
  showsKindFilter,
  showsOfferFilter,
  useCatalogView,
  useCmsPage,
  usePageMeta,
  type CatalogCategory,
  type CatalogFacets,
  type CatalogItem,
  type CatalogParams,
  type ItemKind,
  type SetCatalogParams,
  type SortKey,
} from '@/core';
import { useI18n } from '@/i18n';
import { RunCard, RunCardSkeleton } from '@/components/RunCard';
import { Sheet } from '@/components/Sheet';
import { SectionError } from '@/components/StoreStates';

const SORTS: SortKey[] = ['featured', 'newest', 'price-asc', 'price-desc', 'name'];

const chip =
  'inline-flex min-h-tap shrink-0 items-center gap-2 rounded-md bg-surface-raised px-4 font-semibold text-heading shadow-[inset_0_0_0_2px_var(--rule)] transition-colors hover:shadow-[inset_0_0_0_2px_var(--heading)] aria-pressed:bg-[color:var(--accent)] aria-pressed:text-[color:var(--accent-ink)] aria-pressed:shadow-none';

/** Type, offers and order: inline on wide screens, in a sheet on phones. */
function Refine({ params, setParams, facets, idPrefix, stacked }: { params: CatalogParams; setParams: SetCatalogParams; facets: CatalogFacets; idPrefix: string; stacked: boolean }) {
  const { t } = useI18n();
  const kinds: Array<{ value: ItemKind | null; key: string }> = [
    { value: null, key: 'catalog.kind.all' },
    { value: 'product', key: 'catalog.kind.product' },
    { value: 'service', key: 'catalog.kind.service' },
  ];
  return (
    <div className={stacked ? 'flex flex-col gap-7' : 'flex flex-wrap items-center gap-3'}>
      {showsKindFilter(facets) && (
        <div role="group" aria-labelledby={`${idPrefix}-kind`} className={stacked ? '' : 'flex items-center gap-2'}>
          <p id={`${idPrefix}-kind`} className={stacked ? 'mb-2 font-bold text-heading' : 'sr-only'}>
            {t('catalog.kind')}
          </p>
          <div className="flex flex-wrap gap-2">
            {kinds.map(({ value, key }) => (
              <button key={key} type="button" aria-pressed={params.kind === value} className={chip} onClick={() => setParams({ kind: value })}>
                {t(key)}
              </button>
            ))}
          </div>
        </div>
      )}
      {showsOfferFilter(facets) && (
        <label className="inline-flex min-h-tap cursor-pointer items-center gap-3 font-semibold text-heading">
          <input type="checkbox" className="h-5 w-5 accent-[color:var(--fh-tartan)]" checked={params.sale} onChange={(e) => setParams({ sale: e.target.checked })} />
          {t('catalog.offers')}
        </label>
      )}
      <div className={stacked ? '' : 'ml-auto'}>
        <label htmlFor={`${idPrefix}-sort`} className={stacked ? 'mb-2 block font-bold text-heading' : 'sr-only'}>
          {t('catalog.sort')}
        </label>
        <select id={`${idPrefix}-sort`} className={`field ${stacked ? '' : 'w-auto min-w-[13rem]'}`} value={params.sort} onChange={(e) => setParams({ sort: e.target.value as SortKey })}>
          {SORTS.map((s) => (
            <option key={s} value={s}>
              {t(`catalog.sort.${s}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Runs({ items, categoryOf }: { items: CatalogItem[]; categoryOf: (id: string | null) => CatalogCategory | undefined }) {
  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {items.map((item) => (
        <li key={item.id}>
          <RunCard item={item} category={categoryOf(item.categoryId)} />
        </li>
      ))}
    </ul>
  );
}

export default function Catalog() {
  const { t, plural } = useI18n();
  const cms = useCmsPage('products');
  const content = productsContent(cms.page);
  usePageMeta(cms.page?.title ?? t('catalog.title'), cms.page?.metaDescription);
  const { catalog, params, setParams, query, setQuery, facets, categories, results, active, grouped, selected, uncategorized, categoryOf, clearAll } =
    useCatalogView();
  const [refineOpen, setRefineOpen] = useState(false);

  return (
    <>
      <section className="track on-track">
        <div className="page flex flex-wrap items-end justify-between gap-4 py-10 md:py-14">
          <div className="max-w-3xl">
            {cms.isLoading ? (
              <div aria-hidden="true" className="flex flex-col gap-3">
                <div className="skeleton-deep h-16 w-72" />
                <div className="skeleton-deep h-5 w-96 max-w-full" />
              </div>
            ) : (
              <>
                <h1 className="text-[clamp(3rem,8vw,5.5rem)]">{content.hero.title ?? t('catalog.title')}</h1>
                {content.hero.subtitle && <p className="mt-3 text-xl">{content.hero.subtitle}</p>}
              </>
            )}
          </div>
          <p aria-live="polite" className="font-display text-2xl">
            {catalog.isLoading ? t('state.loading') : plural('catalog.results', results.length)}
            {selected && ` · ${selected.name}`}
          </p>
        </div>
      </section>
      <div aria-hidden="true" className="h-[3px] bg-[color:var(--fh-lane)]" />

      <div className="page pt-8">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <label htmlFor="catalog-search" className="sr-only">
              {t('catalog.search')}
            </label>
            <div className="relative flex-1">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
              <input id="catalog-search" type="search" className="field pl-10" placeholder={t('catalog.search.placeholder')} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button type="button" className="btn btn-strong px-4 md:hidden" onClick={() => setRefineOpen(true)}>
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
              {t('catalog.filters')}
            </button>
          </div>
          <div className="hidden md:block">
            <Refine params={params} setParams={setParams} facets={facets} idPrefix="bar" stacked={false} />
          </div>
          {categories.length > 1 && (
            <div role="group" aria-label={t('catalog.category')} className="-mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
              <button type="button" aria-pressed={!params.category} className={chip} onClick={() => setParams({ category: null })}>
                {t('catalog.category.all')}
                <span className="tabular-nums opacity-75">{facets.total}</span>
              </button>
              {categories.map((c) => (
                <button key={c.id} type="button" aria-pressed={params.category === c.key} className={chip} onClick={() => setParams({ category: c.key })}>
                  {c.name}
                  <span className="tabular-nums opacity-75">{facets.categories.get(c.id) ?? 0}</span>
                </button>
              ))}
            </div>
          )}
          {active && (
            <button type="button" className="btn btn-quiet w-fit px-4 text-sm" onClick={clearAll}>
              <X aria-hidden="true" className="h-4 w-4" />
              {t('catalog.filters.clear')}
            </button>
          )}
        </div>

        {selected?.description && !grouped && <p className="mt-6 max-w-2xl text-lg text-ink-soft">{selected.description}</p>}

        <div className="mt-10">
          {catalog.isLoading ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {Array.from({ length: 6 }, (_, i) => (
                <RunCardSkeleton key={i} />
              ))}
            </div>
          ) : catalog.isError ? (
            <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
          ) : catalog.items.length === 0 ? (
            <p className="rounded-frame bg-surface-raised p-6 text-ink-soft shadow-soft">{t('catalog.empty.store')}</p>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-start gap-3 rounded-frame bg-surface-raised p-8 shadow-soft">
              <p className="font-display text-3xl text-heading">{t('catalog.empty.title')}</p>
              <p className="text-ink-soft">{t('catalog.empty.body')}</p>
              <button type="button" className="btn btn-strong mt-2" onClick={clearAll}>
                {t('catalog.filters.clear')}
              </button>
            </div>
          ) : grouped ? (
            <div className="flex flex-col gap-14">
              {categories.map((category) => {
                const items = results.filter((i) => i.categoryId === category.id);
                if (!items.length) return null;
                return (
                  <section key={category.id} aria-labelledby={`lane-${category.id}`}>
                    <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b-[3px] border-[color:var(--accent)] pb-2">
                      <h2 id={`lane-${category.id}`} className="text-[clamp(2rem,4vw,2.75rem)] text-heading">
                        {category.name}
                      </h2>
                      {category.description && <p className="text-ink-soft">{category.description}</p>}
                    </div>
                    <Runs items={items} categoryOf={() => undefined} />
                  </section>
                );
              })}
              {uncategorized.length > 0 && <Runs items={uncategorized} categoryOf={categoryOf} />}
            </div>
          ) : (
            <Runs items={results} categoryOf={selected ? () => undefined : categoryOf} />
          )}
        </div>
      </div>

      <Sheet
        open={refineOpen}
        onOpenChange={setRefineOpen}
        title={t('catalog.filters')}
        footer={
          <button type="button" className="btn btn-accent w-full" onClick={() => setRefineOpen(false)}>
            {plural('catalog.filters.show', results.length)}
          </button>
        }
      >
        <Refine params={params} setParams={setParams} facets={facets} idPrefix="sheet" stacked />
      </Sheet>
    </>
  );
}
