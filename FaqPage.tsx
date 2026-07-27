import { useState } from 'react';
import { Reveal, SectionTitle } from '@/components/ui';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'How long does it take to build a website?',
    a: 'Most landing pages and business websites are delivered within 24-72 hours. Larger web apps and e-commerce stores may take 1-2 weeks depending on scope.',
  },
  {
    q: 'What do I need to provide to start?',
    a: 'Just your business details, any branding (logo, colors), and content preferences. We handle the rest — design, development, and deployment.',
  },
  {
    q: 'Are the UK TikTok accounts real and safe?',
    a: 'Yes. All our UK TikTok accounts are aged, with real followers, and come with full login credentials. They are ready for rebranding and content posting.',
  },
  {
    q: 'How do I pay?',
    a: 'After you place an order via the Order form or WhatsApp, we share payment details (bank transfer, Easypaisa, JazzCash, or PayPal). Work starts once payment is confirmed.',
  },
  {
    q: 'Do you offer support after delivery?',
    a: 'Absolutely. Every project includes free support for bug fixes and small tweaks. Ongoing maintenance plans are also available.',
  },
  {
    q: 'Can I get a refund?',
    a: 'If work has not started yet, you can request a full refund. Once development begins, refunds are handled case-by-case based on progress.',
  },
  {
    q: 'Do you offer discounts?',
    a: 'Yes! We run coupon codes regularly. Enter a coupon at checkout (on the order form) to apply an instant discount. Bulk orders also get custom pricing.',
  },
  {
    q: 'Will my website be mobile friendly and SEO optimized?',
    a: 'Every site we build is fully responsive and follows modern SEO best practices — fast loading, semantic markup, and meta tags included.',
  },
];

export function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="pt-24 container-x section-pad max-w-3xl">
      <Reveal>
        <SectionTitle
          eyebrow="FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know before ordering."
        />
      </Reveal>

      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={i} delay={i * 40}>
            <div className="glass overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="text-white font-medium">{f.q}</span>
                <ChevronDown
                  className={`h-5 w-5 text-emerald-400 transition-transform ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-gray-400 leading-relaxed text-sm">{f.a}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
