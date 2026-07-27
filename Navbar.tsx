import { useEffect, useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';
import { useSettings } from '@/lib/settings';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/faq', label: 'FAQ' },
];

export function Navbar() {
  const { path } = useRouter();
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (to: string) =>
    to === '/' ? path === '/' : path.startsWith(to);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-ink-950/80 backdrop-blur-xl border-b border-white/5'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex items-center justify-between h-16 md:h-18">
        <Link to="/" className="flex items-center gap-2.5 group">
          {settings.logo_url ? (
            <img
              src={settings.logo_url}
              alt={settings.website_name}
              className="h-9 w-9 rounded-lg object-cover"
            />
          ) : (
            <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center shadow-[0_0_20px_-4px_rgba(16,185,129,0.6)] group-hover:scale-110 transition-transform">
              <Sparkles className="h-5 w-5 text-ink-950" />
            </span>
          )}
          <span className="font-display font-bold text-lg text-white tracking-tight">
            {settings.website_name}
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(l.to)
                  ? 'text-emerald-300 bg-emerald-500/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/admin" className="btn-ghost text-sm px-4 py-2">
            Admin
          </Link>
          <Link to="/order" className="btn-primary text-sm px-4 py-2">
            Order Now
          </Link>
        </div>

        <button
          className="lg:hidden text-gray-200 p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden glass-strong border-t border-white/5 px-5 py-4 space-y-1 animate-fade-in">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium ${
                isActive(l.to)
                  ? 'text-emerald-300 bg-emerald-500/10'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="btn-ghost flex-1 text-sm"
            >
              Admin
            </Link>
            <Link
              to="/order"
              onClick={() => setOpen(false)}
              className="btn-primary flex-1 text-sm"
            >
              Order Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
