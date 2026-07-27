import { useEffect, useState } from 'react';
import { ServiceCard } from '@/components/ServiceCard';
import { Reveal, SectionTitle } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { Service, TiktokAccount } from '@/lib/types';
import { Link } from '@/lib/router';
import { Check, Users } from 'lucide-react';
import { effectivePrice, formatPrice } from '@/lib/whatsapp';

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [accounts, setAccounts] = useState<TiktokAccount[]>([]);

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: a }] = await Promise.all([
        supabase.from('services').select('*').eq('enabled', true).order('sort_order'),
        supabase.from('tiktok_accounts').select('*').order('created_at', { ascending: false }),
      ]);
      setServices((s as Service[]) || []);
      setAccounts((a as TiktokAccount[]) || []);
    })();
  }, []);

  return (
    <div className="pt-24 container-x section-pad">
      <Reveal>
        <SectionTitle
          eyebrow="Our Services"
          title="Everything we build & sell"
          subtitle="Browse our full range of AI web development services and premium UK TikTok accounts."
        />
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={i * 60}>
            <ServiceCard service={s} />
          </Reveal>
        ))}
      </div>

      {accounts.length > 0 && (
        <>
          <div className="mt-20">
            <Reveal>
              <SectionTitle
                eyebrow="UK TikTok Store"
                title="Premium UK TikTok Accounts"
                subtitle="Verified, aged UK TikTok accounts ready for your brand or content business."
              />
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {accounts.map((a, i) => (
                <Reveal key={a.id} delay={i * 60}>
                  <div className="glass card-hover overflow-hidden flex flex-col">
                    <div className="aspect-[16/10] bg-ink-800 overflow-hidden">
                      {a.image_url ? (
                        <img src={a.image_url} alt={a.title} loading="lazy" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center bg-grid-emerald bg-[size:24px_24px]">
                          <Users className="h-10 w-10 text-emerald-700/60" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400/80">
                          {a.country}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${a.status === 'available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                          {a.status === 'available' ? 'Available' : 'Sold'}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-white">{a.title}</h3>
                      <p className="text-sm text-gray-400 mt-1.5 leading-relaxed flex-1">{a.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xl font-bold text-emerald-300">{formatPrice(a.price, a.currency)}</span>
                        <span className="text-xs text-gray-500">{a.followers} followers</span>
                      </div>
                      {a.status === 'available' && (
                        <Link
                          to={`/order?service=${encodeURIComponent(a.title)}`}
                          className="btn-primary w-full mt-4 text-sm"
                        >
                          <Check className="h-4 w-4" /> Order Now
                        </Link>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
