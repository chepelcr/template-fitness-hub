import { Link } from 'wouter';
import { useIsDemo, useStore } from '@/core';
import { useI18n } from '@/i18n';
import { ContactDetails } from './ContactDetails';
import { NAV } from './Header';

export function Footer() {
  const { organization } = useStore();
  const isDemo = useIsDemo();
  const { t } = useI18n();
  return (
    <footer className="mt-24">
      <div aria-hidden="true" className="track h-4" />
      <div aria-hidden="true" className="h-[3px] bg-[color:var(--fh-lane)]" />
      <div className="on-deep bg-surface-deep text-ink-on-deep">
        <div className="page grid gap-10 py-12 md:grid-cols-12 md:py-16">
          <div className="md:col-span-4">
            <p className="font-display text-4xl">{organization?.name}</p>
            {!isDemo && organization?.description && <p className="mt-3 max-w-sm text-ink-on-deep-soft">{organization.description}</p>}
            {isDemo && <p className="mt-3 max-w-sm text-sm text-ink-on-deep-soft">{t('demo.notice')}</p>}
          </div>
          <nav aria-label={t('footer.navigation')} className="md:col-span-3">
            <ul className="grid grid-cols-2 gap-1 md:grid-cols-1">
              {NAV.map(({ href, key }) => (
                <li key={href}>
                  <Link href={href} className="inline-flex min-h-tap items-center text-lg font-semibold hover:underline">
                    {t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-5">
            <ContactDetails tone="deep" compact />
          </div>
        </div>
        <div className="page flex flex-wrap justify-between gap-2 border-t border-rule-deep py-5 text-sm text-ink-on-deep-soft">
          <span>
            © {new Date().getFullYear()} {organization?.name}
          </span>
          <span>{t('footer.madeWith')}</span>
        </div>
      </div>
    </footer>
  );
}
