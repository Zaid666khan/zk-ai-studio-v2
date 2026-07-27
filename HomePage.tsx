import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Globe2,
  Star,
  Users,
  Clock,
  Rocket,
  Code2,
  Palette,
  Search,
  CheckCircle2,
  ChevronDown,
  TrendingUp,
  Award,
  MessageSquare,
} from 'lucide-react';
import { Link } from '@/lib/router';
import { Reveal, SectionTitle, StarRating } from '@/components/ui';
import { ServiceCard } from '@/components/ServiceCard';
import { useSettings } from '@/lib/settings';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { supabase } from '@/lib/supabase';
import type { Service, Testimonial, PortfolioItem } from '@/lib/types';

const STOCK = (q: string) =>
  `https://images.pexels.com/photos/${q}/pexels-photo-${q}.jpeg?auto=compress&cs=tinysrgb&w=1200`;

const CLIENT_LOGOS = ['TechFlow', 'NovaPay', 'Cloudify', 'Zenith', 'OrbitLabs', 'PulseAI'];

const STATS = [
  { icon: Users, label: 'Happy Clients', value: 500, suffix: '+' },
  { icon: Rocket, label: 'Projects Delivered', value: 320, suffix: '+' },
  { icon: Clock, label: 'Avg. Delivery', value: 48, suffix: 'h' },
  { icon: Award, label: 'Client Satisfaction', value: 98, suffix: '%' },
];

const STEPS = [
  { icon: MessageSquare, title: 'Tell Us Your Idea', desc: 'Share your project requirements through the order form or WhatsApp.' },
  { icon: Palette, title: 'We Design & Build', desc: 'Our team crafts a modern, AI-powered website tailored to your brand.' },
  { icon: Code2, title: 'Review & Refine', desc: 'You review the work, request changes, and we refine until perfect.' },
  { icon: Rocket, title: 'Launch & Support', desc: 'We deploy your site and provide ongoing support after delivery.' },
];

const FAQS = [
  { q: 'How long does it take to build a website?', a: 'Most landing pages and business websites are delivered within 24-72 hours. Larger web apps and e-commerce stores may take 1-2 weeks depending on scope.' },
  { q: 'What do I need to provide to start?', a: 'Just your business details, any branding (logo, colors), and content preferences. We handle the rest — design, development, and deployment.' },
  { q: 'Are the UK TikTok accounts real and safe?', a: 'Yes. All our UK TikTok accounts are aged, with real followers, and come with full login credentials. They are ready for rebranding and content posting.' },
  { q: 'How do I pay?', a: 'After you place an order via the Order form or WhatsApp, we share payment details (bank transfer, Easypaisa, JazzCash, or PayPal). Work starts once payment is confirmed.' },
  { q: 'Do you offer support after delivery?', a: 'Absolutely. Every project includes free support for bug fixes and small tweaks. Ongoing maintenance plans are also available.' },
];

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold text-white">
      {count}
      <span className="text-emerald-400">{suffix}</span>
    </div>
  );
}

function useVisitorCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const key = 'zk-visitor-seed';
    let seed = parseInt(sessionStorage.getItem(key) || '0', 10);
    if (!seed) {
      seed = 1200 + Math.floor(Math.random() * 400);
      sessionStorage.setItem(key, String(seed));
    }
    const interval = setInterval(() => {
      setCount((c) => {
        if (c >= seed) return c;
        return Math.min(c + Math.ceil((seed - c) / 8) + 1, seed);
      });
    }, 120);
    return () => clearInterval(interval);
  }, []);
  return count;
}

export function HomePage() {
  const { settings } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [tIndex, setTIndex] = useState(0);
  const visitorCount = useVisitorCount();

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: t }, { data: p }] = await Promise.all([
        supabase.from('services').select('*').eq('enabled', true).order('sort_order', { ascending: true }),
        supabase.from('testimonials').select('*').limit(8),
        supabase.from('portfolio').select('*').limit(6),
      ]);
      setServices((s as Service[]) || []);
      setTestimonials((t as Testimonial[]) || []);
      setPortfolio((p as PortfolioItem[]) || []);
    })();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => {
      setTIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const featuredServices = services.filter((s) => s.featured).slice(0, 3);
  const showServices = (featuredServices.length > 0 ? featuredServices : services).slice(0, 3);

  return (
    <div className="pt-16">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-emerald bg-[size:40px_40px] opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[60rem] bg-emerald-500/20 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute top-20 -left-20 h-72 w-72 bg-emerald-400/10 blur-[100px] rounded-full animate-float" />
        <div className="absolute top-40 -right-20 h-72 w-72 bg-teal-400/10 blur-[100px] rounded-full animate-float-delay" />

        <div className="container-x relative pt-20 md:pt-28 pb-24 text-center">
          <Reveal>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-emerald-300 mb-6">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" /> AI-Powered Web Studio
            </span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.05]">
              {settings.hero_title.split('&')[0]}
              {settings.hero_title.includes('&') && (
                <span className="text-gradient">
                  {' '}& {settings.hero_title.split('&').slice(1).join('&')}
                </span>
              )}
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-6 text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
              {settings.hero_subtitle}
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/order" className="btn-primary group">
                Order Now
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={buildWhatsAppUrl(settings.whatsapp_number, 'Hello ZK AI Studio, I would like to discuss a project.')}
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                Contact on WhatsApp
              </a>
            </div>
          </Reveal>

          {/* Live visitor counter */}
          <Reveal delay={320}>
            <div className="mt-12 inline-flex items-center gap-2.5 glass px-5 py-2.5 text-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-gray-300">
                <span className="text-emerald-300 font-semibold">{visitorCount.toLocaleString()}</span> visitors online now
              </span>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { icon: Zap, label: 'Fast Delivery', value: '24-72h' },
                { icon: ShieldCheck, label: 'Secure', value: '100%' },
                { icon: Globe2, label: 'Worldwide', value: 'Global' },
                { icon: Star, label: 'Happy Clients', value: '500+' },
              ].map((s) => (
                <div key={s.label} className="glass px-4 py-5 hover:border-emerald-500/30 transition-colors">
                  <s.icon className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CLIENT LOGOS SLIDER */}
      <section className="py-12 border-y border-white/5 bg-ink-900/30">
        <div className="container-x">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-gray-500 mb-8">
            Trusted by growing businesses
          </p>
          <div className="relative overflow-hidden">
            <div className="flex gap-12 animate-marquee whitespace-nowrap">
              {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((logo, i) => (
                <span
                  key={i}
                  className="font-display text-2xl font-bold text-gray-600 hover:text-emerald-400 transition-colors cursor-default"
                >
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMPANY STATISTICS */}
      <section className="section-pad">
        <div className="container-x">
          <Reveal>
            <SectionTitle
              eyebrow="By the Numbers"
              title="Results that speak for themselves"
              subtitle="Our track record of delivering quality, fast, and at scale."
            />
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="glass p-6 text-center hover:border-emerald-500/30 transition-colors h-full">
                  <s.icon className="h-7 w-7 text-emerald-400 mx-auto mb-3" />
                  <AnimatedNumber value={s.value} suffix={s.suffix} />
                  <div className="text-sm text-gray-500 mt-1">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section-pad bg-ink-900/40">
        <div className="container-x grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative">
              <img
                src={STOCK('3184465')}
                alt="AI development"
                className="rounded-2xl border border-white/10 w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 glass-strong px-6 py-4 hidden md:block">
                <div className="text-3xl font-bold text-emerald-300">98%</div>
                <div className="text-xs text-gray-400">Client Satisfaction</div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <SectionTitle
                center={false}
                eyebrow="Why ZK AI Studio"
                title="Built for performance, designed to convert"
              />
              <div className="space-y-5">
                {[
                  { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for speed and Core Web Vitals — pages load in milliseconds.' },
                  { icon: ShieldCheck, title: 'Secure by Design', desc: 'Best-practice security on every layer, from auth to database.' },
                  { icon: Globe2, title: 'Fully Responsive', desc: 'Pixel-perfect on mobile, tablet, and desktop out of the box.' },
                  { icon: Sparkles, title: 'AI-Enhanced', desc: 'Modern AI integrations that automate and elevate your business.' },
                ].map((f) => (
                  <div key={f.title} className="flex gap-4">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-emerald-500/15 grid place-items-center border border-emerald-500/20">
                      <f.icon className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{f.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section-pad">
        <div className="container-x">
          <Reveal>
            <SectionTitle
              eyebrow="How It Works"
              title="From idea to launch in 4 simple steps"
              subtitle="A streamlined process that gets your project live fast — without sacrificing quality."
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 100}>
                <div className="glass p-6 h-full relative hover:border-emerald-500/30 transition-colors">
                  <div className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-emerald-500 text-ink-950 font-bold text-sm grid place-items-center">
                    {i + 1}
                  </div>
                  <step.icon className="h-8 w-8 text-emerald-400 mb-4" />
                  <h4 className="font-display text-lg font-semibold text-white">{step.title}</h4>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">{step.desc}</p>
                  {i < STEPS.length - 1 && (
                    <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 h-5 w-5 text-emerald-500/40" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="section-pad bg-ink-900/40">
        <div className="container-x">
          <Reveal>
            <SectionTitle
              eyebrow="What We Do"
              title="Our Premium Services"
              subtitle="From AI-powered websites to verified UK TikTok accounts — everything you need to grow your online business."
            />
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {showServices.map((s, i) => (
              <Reveal key={s.id} delay={i * 80}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="btn-ghost group">
              View All Services
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PORTFOLIO */}
      {portfolio.length > 0 && (
        <section className="section-pad">
          <div className="container-x">
            <Reveal>
              <SectionTitle
                eyebrow="Our Work"
                title="Featured Projects"
                subtitle="A glimpse of the websites and apps we've crafted for our clients."
              />
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <div className="glass card-hover overflow-hidden group">
                    <div className="aspect-[16/10] overflow-hidden">
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
                      <p className="text-sm text-gray-400 mt-1.5 line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/portfolio" className="btn-ghost group">
                View Full Portfolio
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS SLIDER */}
      {testimonials.length > 0 && (
        <section className="section-pad bg-ink-900/40">
          <div className="container-x">
            <Reveal>
              <SectionTitle
                eyebrow="Testimonials"
                title="What Our Clients Say"
                subtitle="Real reviews from real customers who grew with us."
              />
            </Reveal>
            <div className="max-w-3xl mx-auto">
              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${tIndex * 100}%)` }}
                >
                  {testimonials.map((t) => (
                    <div key={t.id} className="w-full shrink-0 px-1">
                      <div className="glass p-8 md:p-10 text-center">
                        <StarRating rating={t.rating} />
                        <p className="mt-5 text-gray-300 leading-relaxed text-lg">"{t.review}"</p>
                        <div className="mt-6 flex items-center justify-center gap-3">
                          {t.avatar_url ? (
                            <img src={t.avatar_url} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-emerald-500/20 grid place-items-center text-emerald-300 font-semibold text-lg">
                              {t.name.charAt(0)}
                            </div>
                          )}
                          <div className="text-left">
                            <div className="text-white font-medium">{t.name}</div>
                            <div className="text-xs text-gray-500">{t.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setTIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === tIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-gray-700 hover:bg-gray-600'
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* FAQ ACCORDION */}
      <section className="section-pad">
        <div className="container-x max-w-3xl">
          <Reveal>
            <SectionTitle
              eyebrow="FAQ"
              title="Frequently Asked Questions"
              subtitle="Quick answers to the most common questions."
            />
          </Reveal>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="glass overflow-hidden">
                  <button
                    onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-white font-medium">{f.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-emerald-400 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <div className={`grid transition-all duration-300 ${faqOpen === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-gray-400 leading-relaxed text-sm">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad">
        <div className="container-x">
          <Reveal>
            <div className="glass-strong relative overflow-hidden p-10 md:p-16 text-center">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-96 bg-emerald-500/20 blur-[100px] rounded-full" />
              <TrendingUp className="h-10 w-10 text-emerald-400 mx-auto mb-4 relative" />
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white relative">
                Ready to grow your business online?
              </h2>
              <p className="mt-4 text-gray-400 max-w-xl mx-auto relative">
                Order a website, buy a UK TikTok account, or just say hello — we're one message away.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center relative">
                <Link to="/order" className="btn-primary group">
                  Order Now
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={buildWhatsAppUrl(settings.whatsapp_number, 'Hello ZK AI Studio!')}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  WhatsApp Us
                </a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-500 relative">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> No upfront payment</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> 24-72h delivery</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Free support</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
