import { useI18n } from '@/i18n';

/**
 * A session's duration as a scoreboard figure. Only the store's own text is
 * shown: a leading number becomes the big figure, the rest its unit.
 */
export function Scoreboard({ value, size = 'md' }: { value: string; size?: 'md' | 'lg' }) {
  const { t } = useI18n();
  const match = value.trim().match(/^(\d+(?:[.,]\d+)?)\s+(.+)$/);
  return (
    <span className="inline-flex w-fit items-baseline gap-2 rounded-md bg-surface-deep px-3 py-1.5 text-ink-on-deep">
      <span className="sr-only">{t('product.spec.duration')}:</span>
      {match ? (
        <>
          <span className={`font-display font-extrabold not-italic tabular-nums leading-none ${size === 'lg' ? 'text-5xl' : 'text-3xl'}`}>{match[1]}</span>
          <span className={`font-semibold text-ink-on-deep-soft ${size === 'lg' ? 'text-lg' : 'text-sm'}`}>{match[2]}</span>
        </>
      ) : (
        <span className="font-semibold">{value}</span>
      )}
    </span>
  );
}
