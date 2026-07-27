import { useState } from 'react';
import { Reveal, SectionTitle } from '@/components/ui';
import { useSettings } from '@/lib/settings';
import { supabase } from '@/lib/supabase';
import { buildWhatsAppUrl, buildContactMessage } from '@/lib/whatsapp';
import { Mail, MessageCircle, Send, Facebook, Instagram, Twitter, Linkedin, MapPin } from 'lucide-react';

export function ContactPage() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setStatus('sending');
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      message: form.message,
    });
    if (error) {
      setStatus('error');
      return;
    }
    setStatus('sent');
    window.open(
      buildWhatsAppUrl(settings.whatsapp_number, buildContactMessage(form.name, form.email, form.message)),
      '_blank'
    );
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="pt-24 container-x section-pad">
      <Reveal>
        <SectionTitle
          eyebrow="Contact"
          title="Let's talk about your project"
          subtitle="Reach out via WhatsApp, email, or the form below — we usually reply within hours."
        />
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-8">
        <Reveal>
          <div className="glass p-8 h-full space-y-6">
            <h3 className="font-display text-xl font-semibold text-white">Contact Information</h3>

            <a
              href={buildWhatsAppUrl(settings.whatsapp_number, 'Hello ZK AI Studio!')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-emerald-500/10 transition-colors group"
            >
              <div className="h-11 w-11 rounded-xl bg-[#25D366]/20 grid place-items-center">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <div>
                <div className="text-xs text-gray-500">WhatsApp</div>
                <div className="text-white font-medium">{settings.whatsapp_number}</div>
              </div>
            </a>

            <a
              href={`mailto:${settings.email}`}
              className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-emerald-500/10 transition-colors"
            >
              <div className="h-11 w-11 rounded-xl bg-emerald-500/15 grid place-items-center">
                <Mail className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Email</div>
                <div className="text-white font-medium">{settings.email}</div>
              </div>
            </a>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/15 grid place-items-center">
                <MapPin className="h-5 w-5 text-emerald-300" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-white font-medium">Remote · Worldwide</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Follow Us</div>
              <div className="flex gap-3">
                {[
                  { url: settings.facebook, Icon: Facebook },
                  { url: settings.instagram, Icon: Instagram },
                  { url: settings.twitter, Icon: Twitter },
                  { url: settings.linkedin, Icon: Linkedin },
                ].map(({ url, Icon }, i) =>
                  url ? (
                    <a key={i} href={url} target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-xl bg-white/5 hover:bg-emerald-500/20 transition-colors">
                      <Icon className="h-4 w-4" />
                    </a>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <form onSubmit={submit} className="glass p-8 space-y-5">
            <h3 className="font-display text-xl font-semibold text-white">Send a Message</h3>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Your Name</label>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                className="input-field"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Message</label>
              <textarea
                className="input-field min-h-[140px] resize-y"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your project..."
                required
              />
            </div>
            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full">
              {status === 'sending' ? 'Sending...' : 'Send Message'}
              <Send className="h-4 w-4" />
            </button>
            {status === 'sent' && (
              <p className="text-emerald-300 text-sm text-center">Message sent! Opening WhatsApp...</p>
            )}
            {status === 'error' && (
              <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>
            )}
          </form>
        </Reveal>
      </div>

      <div className="mt-12 glass overflow-hidden rounded-2xl">
        <iframe
          title="Map"
          className="w-full h-72 border-0"
          loading="lazy"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-0.2,51.45,0.0,51.55&layer=mapnik"
        />
      </div>
    </div>
  );
}
