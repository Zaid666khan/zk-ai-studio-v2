import { Sparkles, Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from '@/lib/router';
import { useSettings } from '@/lib/settings';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="relative mt-20 border-t border-white/5 bg-ink-900/60">
      <div className="container-x py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center">
              <Sparkles className="h-5 w-5 text-ink-950" />
            </span>
            <span className="font-display font-bold text-lg text-white">
              {settings.website_name}
            </span>
          </div>
          <p className="text-sm text-gray-400 max-w-md leading-relaxed">
            {settings.about_text}
          </p>
          <div className="flex items-center gap-3 mt-5">
            {settings.facebook && (
              <a href={settings.facebook} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 hover:bg-emerald-500/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 hover:bg-emerald-500/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {settings.twitter && (
              <a href={settings.twitter} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 hover:bg-emerald-500/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noreferrer" className="h-9 w-9 grid place-items-center rounded-lg bg-white/5 hover:bg-emerald-500/20 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Pages</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/services" className="text-gray-400 hover:text-emerald-300 transition-colors">Services</Link></li>
            <li><Link to="/portfolio" className="text-gray-400 hover:text-emerald-300 transition-colors">Portfolio</Link></li>
            <li><Link to="/pricing" className="text-gray-400 hover:text-emerald-300 transition-colors">Pricing</Link></li>
            <li><Link to="/about" className="text-gray-400 hover:text-emerald-300 transition-colors">About</Link></li>
            <li><Link to="/faq" className="text-gray-400 hover:text-emerald-300 transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="text-gray-400 hover:text-emerald-300 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-gray-400 hover:text-emerald-300 transition-colors">
                <Mail className="h-4 w-4" /> {settings.email}
              </a>
            </li>
            <li>
              <a
                href={buildWhatsAppUrl(settings.whatsapp_number, 'Hello ZK AI Studio, I have a question.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
              >
                WhatsApp: {settings.whatsapp_number}
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-300">Privacy Policy</Link>
            <span className="text-gray-700">·</span>
            <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-300">Terms</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x py-5 text-center text-xs text-gray-500">
          {settings.footer_text}
        </div>
      </div>
    </footer>
  );
}
