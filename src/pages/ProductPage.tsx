import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'wouter';
import { catalogHref, paragraphs, usePageMeta, useProductView } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from '@/components/AddToCart';
import { Placeholder } from '@/components/Placeholder';
import { Price } from '@/components/Price';
import { QuantityStepper } from '@/components/QuantityStepper';
import { RunCard } from '@/components/RunCard';
import { Scoreboard } from '@/components/Scoreboard';
import { StoreImage } from '@/components/StoreImage';
import { SectionError } from '@/components/StoreStates';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { t, plural } = useI18n();
  const { item, catalog, category, related, max, quantity, setQuantity } = useProductView(id);
  usePageMeta(item?.name, item?.description);

  if (catalog.isLoading) {
    return (
      <div aria-hidden="true" className="page grid gap-10 pt-10 md:grid-cols-12">
        <div className="skeleton aspect-[4/3] md:col-span-6" />
        <div className="flex flex-col gap-4 md:col-span-6">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton h-16 w-3/4" />
          <div className="skeleton h-9 w-36" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (catalog.isError) {
    return (
      <div className="page pt-16">
        <SectionError title={t('catalog.error.title')} onRetry={catalog.refetch} />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="page pt-16">
        <div className="flex flex-col items-start gap-4 rounded-frame bg-surface-raised p-8 shadow-soft md:p-12">
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] text-heading">{t('product.notFound.title')}</h1>
          <p className="max-w-xl text-lg text-ink-soft">{t('product.notFound.body')}</p>
          <Link href="/products" className="btn btn-strong">
            {t('product.back')}
          </Link>
        </div>
      </div>
    );
  }

  const text = paragraphs(item.description);
  const stock = item.availability;
  const stockText =
    stock.state === 'sold_out'
      ? t('product.soldOut')
      : stock.state === 'low'
        ? plural('product.low', stock.quantity)
        : stock.state === 'in_stock'
          ? t('product.spec.inStock')
          : null;
  const facts = [
    category && { label: t('product.spec.category'), value: category.name },
    item.kind === 'service' && { label: t('product.spec.type'), value: t('product.service') },
    item.difficulty && { label: t('product.spec.level'), value: item.difficulty },
    stockText && { label: t('product.spec.availability'), value: stockText, alert: stock.state !== 'in_stock' },
  ].filter(Boolean) as Array<{ label: string; value: string; alert?: boolean }>;

  return (
    <>
      <div className="page pt-6">
        <Link href={category ? catalogHref({ category: category.key }) : '/products'} className="inline-flex min-h-tap items-center gap-2 font-semibold text-heading hover:underline">
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {category ? category.name : t('product.back')}
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-6">
            <div className="slant aspect-[4/3] overflow-hidden bg-surface-quiet">
              <StoreImage src={item.imageUrl} alt={item.name} priority sizes="(min-width: 768px) 38rem, 100vw" maxWidth={1280} fallback={<Placeholder label={t('product.imageMissing')} />} />
            </div>
            <div aria-hidden="true" className="lane-rule mt-4" />
          </div>

          <div className="flex flex-col gap-5 md:col-span-6">
            <h1 className="text-[clamp(2.6rem,6vw,4.25rem)] text-heading">{item.name}</h1>
            <Price item={item} size="lg" />
            {item.duration && <Scoreboard value={item.duration} size="lg" />}
            {text.length > 0 && (
              <div className="flex max-w-[60ch] flex-col gap-3 text-lg text-ink-soft">
                {text.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}

            {facts.length > 0 && (
              <dl className="grid max-w-lg grid-cols-2 gap-px overflow-hidden rounded-frame bg-[color:var(--rule)] shadow-soft">
                {facts.map((fact) => (
                  <div key={fact.label} className="bg-surface-raised px-4 py-3">
                    <dt className="text-sm text-ink-soft">{fact.label}</dt>
                    <dd className={`font-display text-2xl ${fact.alert ? 'text-offer' : 'text-heading'}`}>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {item.availability.state !== 'sold_out' && <QuantityStepper value={quantity} max={max} onChange={setQuantity} label={item.name} />}
              <AddToCart item={item} quantity={quantity} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related" className="page pt-20">
          <h2 id="related" className="mb-6 text-[clamp(2.2rem,4.5vw,3.25rem)] text-heading">
            {t('product.related')}
          </h2>
          <ul className="grid gap-4 lg:grid-cols-2">
            {related.map((r) => (
              <li key={r.id}>
                <RunCard item={r} category={catalog.categories.find((c) => c.id === r.categoryId)} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
