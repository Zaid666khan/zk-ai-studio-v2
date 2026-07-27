import { useEffect, useState } from 'react';
import { Reveal, SectionTitle } from '@/components/ui';
import { supabase } from '@/lib/supabase';
import type { PortfolioItem } from '@/lib/types';
import { ExternalLink } from 'lucide-react';

const STOCK = (q: string) =>
  `https://images.pexels.com/photos/${q}/pexels-photo-${q}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
      setItems((data as PortfolioItem[]) || []);
    })();
  }, []);

  const categories = ['All', ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))];
  const shown = filter === 'All' ? items : items.filter((i) => i.category === filter);

  return (
    <div className="pt-24 container-x section-pad">
      <Reveal>
        <SectionTitle
          eyebrow="Portfolio"
          title="Our Recent Work"
          subtitle="A curated selection of websites and applications we've delivered."
        />
      </Reveal>

      {categories.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === c
                  ? 'bg-emerald-500 text-ink-950'
                  : 'glass text-gray-300 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className="text-center text-gray-500 py-20">No projects yet — check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((p, i) => (
            <Reveal key={p.id} delay={i * 60}>
              <div className="glass card-hover overflow-hidden group">
                <div className="aspect-[16/10] overflow-hidden bg-ink-800">
                  <img
                    src={p.image_url || STOCK('270404')}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-5">
                  {p.category && (
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-emerald-400/80">
                      {p.category}
                    </span>
                  )}
                  <h3 className="font-display text-lg font-semibold text-white mt-1">{p.title}</h3>
                  <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{p.description}</p>
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-emerald-300 hover:text-emerald-200 mt-3"
                    >
                      Visit Project <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
