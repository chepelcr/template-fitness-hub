import * as Dialog from '@radix-ui/react-dialog';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useCart, useCartTotals, useIsDemo, useStore } from '@/core';
import { useI18n } from '@/i18n';
import { BASKET_EVENT } from './AddToCart';

export const NAV = [
  { href: '/', key: 'nav.home' },
  { href: '/products', key: 'nav.catalog' },
  { href: '/about', key: 'nav.about' },
  { href: '/contact', key: 'nav.contact' },
] as const;

export function useIsActive() {
  const [location] = useLocation();
  return (href: string) => (href === '/' ? location === '/' : location === href || location.startsWith(`${href}/`));
}

/** Without a logo the store gets a small running track. */
export function TrackMark({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={className}>
      <rect width="40" height="40" rx="8" style={{ fill: 'var(--accent)' }} />
      <rect x="6" y="11" width="28" height="18" rx="9" fill="none" strokeWidth="2.5" style={{ stroke: 'var(--accent-ink)' }} />
      <rect x="11.5" y="16" width="17" height="8" rx="4" fill="none" strokeWidth="2" style={{ stroke: 'var(--accent-ink)' }} />
    </svg>
  );
}

function StoreMark() {
  const { organization, theme } = useStore();
  const logo = theme?.logoUrl ?? organization?.logoUrl ?? null;
  if (!organization) return <span aria-hidden="true" className="skeleton block h-8 w-40" />;
  return (
    <span className="flex items-center gap-3">
      {logo ? <img src={logo} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <TrackMark />}
      <span className="font-display text-2xl leading-none sm:text-[1.75rem]">{organization.name}</span>
    </span>
  );
}

export function Header() {
  const { t, plural } = useI18n();
  const isDemo = useIsDemo();
  const { count } = useCartTotals();
  const openCart = useCart((s) => s.open);
  const isActive = useIsActive();
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adds, setAdds] = useState(0);

  useEffect(() => {
    const onAdded = () => setAdds((n) => n + 1);
    window.addEventListener(BASKET_EVENT, onAdded);
    return () => window.removeEventListener(BASKET_EVENT, onAdded);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className="relative z-30 border-b border-rule bg-surface">
      {isDemo && <p className="bg-surface-deep px-4 py-1.5 text-center text-sm font-medium text-ink-on-deep">{t('demo.notice')}</p>}
      <div className="page flex h-16 items-center gap-3 sm:h-[4.5rem]">
        <Link href="/" className="rounded-lg py-1 pr-2 text-heading">
          <StoreMark />
        </Link>

        <nav aria-label={t('nav.primary')} className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive(href) ? 'page' : undefined}
                  className="relative flex min-h-tap items-center px-3.5 text-lg font-semibold text-ink-soft transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-[5px] after:-skew-x-[24deg] hover:text-heading aria-[current=page]:text-heading aria-[current=page]:after:bg-[color:var(--accent)]"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" onClick={openCart} className="btn btn-accent ml-auto gap-2.5 pl-4 pr-2 md:ml-4">
          <ShoppingBag key={adds} aria-hidden="true" className={`h-5 w-5 ${adds ? 'cart-dash' : ''}`} />
          <span className="hidden sm:inline">{t('nav.cart')}</span>
          <span aria-hidden="true" className="grid h-7 min-w-[1.75rem] place-items-center rounded bg-[color:var(--accent-ink)] px-1.5 font-display text-lg font-extrabold not-italic tabular-nums text-[color:var(--accent)]">
            {count}
          </span>
          <span className="sr-only">{plural('nav.cart.count', count)}</span>
        </button>

        <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
          <Dialog.Trigger className="icon-btn text-heading hover:bg-surface-quiet md:hidden" aria-label={t('nav.menu')}>
            <Menu aria-hidden="true" className="h-6 w-6" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="overlay fixed inset-0 z-40 bg-[color:var(--scrim)]" />
            <Dialog.Content className="sheet track on-track fixed inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-2xl pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <div className="flex items-center justify-between px-5 pb-2 pt-5">
                <Dialog.Title className="font-display text-3xl">{t('nav.menu')}</Dialog.Title>
                <Dialog.Description className="sr-only">{t('nav.primary')}</Dialog.Description>
                <Dialog.Close className="icon-btn -mr-2 hover:bg-[rgb(0_0_0/0.15)]" aria-label={t('nav.close')}>
                  <X aria-hidden="true" className="h-6 w-6" />
                </Dialog.Close>
              </div>
              <nav aria-label={t('nav.primary')}>
                <ul className="lanes">
                  {NAV.map(({ href, key }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        aria-current={isActive(href) ? 'page' : undefined}
                        className="flex min-h-[3.5rem] items-center px-5 font-display text-3xl aria-[current=page]:bg-[rgb(0_0_0/0.18)]"
                      >
                        {t(key)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </header>
  );
}
