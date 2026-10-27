import { Link } from 'wouter';
import { isPurchasable, type CatalogCategory, type CatalogItem } from '@/core';
import { useI18n } from '@/i18n';
import { AddToCart } from './AddToCart';
import { Availability } from './Availability';
import { Placeholder } from './Placeholder';
import { Price } from './Price';
import { Scoreboard } from './Scoreboard';
import { StoreImage } from './StoreImage';

/** A horizontal card: photo on the left, the item's numbers on the right. */
export function RunCard({ item, category, headingLevel = 'h3' }: { item: CatalogItem; category?: CatalogCategory; headingLevel?: 'h2' | 'h3' }) {
  const { t } = useI18n();
  const Heading = headingLevel;
  return (
    <article className="group relative grid h-full grid-cols-[7.5rem_1fr] overflow-hidden rounded-frame bg-surface-raised shadow-soft transition-shadow hover:shadow-lift has-[a:focus-visible]:outline has-[a:focus-visible]:outline-[3px] has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-[color:var(--focus)] sm:grid-cols-[11rem_1fr]">
      <div className={`relative min-h-[10rem] overflow-hidden bg-surface-quiet ${isPurchasable(item) ? '' : 'grayscale'}`}>
        <div className="absolute inset-0">
          <StoreImage src={item.imageUrl} alt="" sizes="(min-width: 640px) 11rem, 7.5rem" maxWidth={480} fallback={<Placeholder />} />
        </div>
        {item.kind === 'service' && (
          <span className="absolute left-2 top-2 rounded bg-[color:var(--accent)] px-2 py-0.5 text-xs font-bold text-[color:var(--accent-ink)]">{t('product.service')}</span>
        )}
      </div>
      <div className="flex min-w-0 flex-col gap-1.5 p-4">
        {category && <p className="text-sm font-semibold text-accent-text">{category.name}</p>}
        <Heading className="text-2xl leading-none text-heading">
          <Link href={`/products/${item.id}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none group-hover:underline">
            {item.name}
          </Link>
        </Heading>
        {item.duration && (
          <div className="pt-1">
            <Scoreboard value={item.duration} />
          </div>
        )}
        <div className="mt-auto flex flex-col gap-1 pt-2">
          <Price item={item} />
          <div className="flex flex-wrap gap-x-3">
            <Availability item={item} showDuration={false} />
          </div>
        </div>
        <div className="relative z-10 pt-2">
          <AddToCart item={item} variant="compact" tone="quiet" />
        </div>
      </div>
    </article>
  );
}

export function RunCardSkeleton() {
  return (
    <div aria-hidden="true" className="grid grid-cols-[7.5rem_1fr] overflow-hidden rounded-frame bg-surface-raised shadow-soft sm:grid-cols-[11rem_1fr]">
      <div className="skeleton min-h-[10rem] rounded-none" />
      <div className="flex flex-col gap-2 p-4">
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-7 w-3/4" />
        <div className="skeleton mt-4 h-6 w-24" />
      </div>
    </div>
  );
}
