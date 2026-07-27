import { useEffect, useState } from 'react';
import { Reveal, SectionTitle } from '@/components/ui';
import { ServiceCard } from '@/components/ServiceCard';
import { supabase } from '@/lib/supabase';
import type { Service } from '@/lib/types';
import { Check } from 'lucide-react';
import { Link } from '@/lib/router';

export function PricingPage() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('enabled', true)
        .order('sort_order');
      setServices((data as Service[]) || []);
    })();
  }, []);

  return (
    <div className="pt-24 container-x section-pad">
      <Reveal>
        <SectionTitle
          eyebrow="Pricing"
          title="Transparent, competitive pricing"
          subtitle="Pick a service and order in minutes. Custom quotes available on WhatsApp."
        />
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <Reveal key={s.id} delay={i * 60}>
            <ServiceCard service={s} />
          </Reveal>
        ))}
      </div>

      <div className="mt-16 glass-strong p-8 md:p-12 text-center">
        <h3 className="font-display text-2xl font-bold text-white">Need a custom plan?</h3>
        <p className="text-gray-400 mt-3 max-w-xl mx-auto">
          Tell us your requirements and budget on WhatsApp — we'll put together a tailored proposal.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/order" className="btn-primary">
            <Check className="h-4 w-4" /> Place an Order
          </Link>
          <Link to="/contact" className="btn-ghost">Contact Us</Link>
        </div>
      </div>
    </div>
  );
}
