import { Reveal, SectionTitle } from '@/components/ui';
import { useSettings } from '@/lib/settings';
import { Sparkles, Target, Rocket, Heart } from 'lucide-react';

const STOCK = (q: string) =>
  `https://images.pexels.com/photos/${q}/pexels-photo-${q}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

export function AboutPage() {
  const { settings } = useSettings();

  return (
    <div className="pt-24 container-x section-pad">
      <Reveal>
        <SectionTitle
          eyebrow="About Us"
          title="Crafting digital experiences that grow businesses"
          subtitle="ZK AI Studio is a modern web studio blending AI, design, and engineering."
        />
      </Reveal>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
        <Reveal>
          <img
            src={STOCK('3184465')}
            alt="ZK AI Studio"
            className="rounded-2xl border border-white/10 w-full aspect-[4/3] object-cover"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="text-gray-300 leading-relaxed text-lg">{settings.about_text}</p>
          <p className="text-gray-400 leading-relaxed mt-4">
            We believe every business deserves a premium online presence. Whether you need an
            AI-powered web app, a high-converting landing page, or a verified UK TikTok account
            to jumpstart your content journey — we deliver with speed, quality, and care.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { v: '500+', l: 'Projects' },
              { v: '98%', l: 'Satisfaction' },
              { v: '24h', l: 'Avg. Response' },
            ].map((s) => (
              <div key={s.l} className="glass p-4 text-center">
                <div className="text-2xl font-bold text-emerald-300">{s.v}</div>
                <div className="text-xs text-gray-500">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Sparkles, title: 'Innovation', desc: 'AI-first approach to every project we build.' },
          { icon: Target, title: 'Precision', desc: 'Pixel-perfect, performance-driven delivery.' },
          { icon: Rocket, title: 'Speed', desc: 'Most projects shipped within 72 hours.' },
          { icon: Heart, title: 'Support', desc: 'Ongoing help even after delivery.' },
        ].map((v, i) => (
          <Reveal key={v.title} delay={i * 60}>
            <div className="glass p-6 h-full">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/15 grid place-items-center border border-emerald-500/20 mb-4">
                <v.icon className="h-5 w-5 text-emerald-300" />
              </div>
              <h4 className="text-white font-semibold">{v.title}</h4>
              <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">{v.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
