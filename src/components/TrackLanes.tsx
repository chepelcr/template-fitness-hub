import { Link } from 'wouter';
import { catalogHref, parseHex, type CatalogCategory } from '@/core';
import { useI18n } from '@/i18n';

/** Categories as lanes of the track, each with its own colour as a lane marker. */
export function TrackLanes({ categories, counts }: { categories: CatalogCategory[]; counts: Map<string, number> }) {
  const { plural } = useI18n();
  return (
    <ul className="track lanes on-track overflow-hidden rounded-frame">
      {categories.map((category) => {
        const marker = parseHex(category.backgroundColor) ? category.backgroundColor! : 'var(--fh-lane)';
        return (
          <li key={category.id}>
            <Link href={catalogHref({ category: category.key })} className="group flex min-h-[5rem] items-center gap-4 px-5 py-4 transition-colors hover:bg-[rgb(0_0_0/0.12)] sm:gap-6 sm:px-8">
              <span aria-hidden="true" className="h-10 w-2.5 shrink-0 -skew-x-12 rounded-sm shadow-[0_0_0_2px_var(--fh-lane)]" style={{ background: marker }} />
              <span className="font-display text-[clamp(1.75rem,4vw,2.75rem)] group-hover:underline">{category.name}</span>
              {category.description && <span className="hidden min-w-0 flex-1 truncate text-lg md:block">{category.description}</span>}
              <span className="ml-auto shrink-0 rounded-md bg-[rgb(0_0_0/0.2)] px-2.5 py-1 font-bold tabular-nums">{plural('category.count', counts.get(category.id) ?? 0)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
