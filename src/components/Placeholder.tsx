import { ProductFallbackIcon } from './CmsIcon';

/** Identity placeholder: infield with lane lines and the store's fallback icon. */
export function Placeholder({ label, tone = 'light' }: { label?: string; tone?: 'light' | 'deep' }) {
  const deep = tone === 'deep';
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${deep ? 'bg-surface-deep-raised text-ink-on-deep-soft' : 'bg-surface-quiet text-heading'}`}
      role={label ? 'img' : undefined}
      aria-label={label}
    >
      <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full opacity-30">
        {[20, 40, 60, 80].map((x) => (
          <path key={x} d={`M${x + 12} 0L${x - 12} 100`} stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        ))}
      </svg>
      <ProductFallbackIcon className="relative h-9 w-9" strokeWidth={1.6} />
    </div>
  );
}
