import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '@/lib/settings';
import { useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { Service, TiktokAccount, Coupon, Currency } from '@/lib/types';
import {
  buildWhatsAppUrl,
  buildOrderMessage,
  effectivePrice,
  formatPrice,
} from '@/lib/whatsapp';
import { Reveal } from '@/components/ui';
import { Check, Tag, X, Send, ShoppingBag } from 'lucide-react';

const COUNTRIES = [
  'Pakistan', 'United Kingdom', 'United States', 'India', 'Canada',
  'Australia', 'Germany', 'France', 'Saudi Arabia', 'UAE', 'Other',
];

export function OrderPage() {
  const { settings } = useSettings();
  const { path } = useRouter();

  const [services, setServices] = useState<(Service | TiktokAccount)[]>([]);
  const [form, setForm] = useState({
    customer_name: '',
    email: '',
    phone: '',
    country: 'Pakistan',
    service_title: '',
    requirements: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: a }] = await Promise.all([
        supabase.from('services').select('*').eq('enabled', true).order('sort_order'),
        supabase.from('tiktok_accounts').select('*').eq('status', 'available').order('created_at', { ascending: false }),
      ]);
      const combined = [...(s as Service[]) || [], ...(a as TiktokAccount[]) || []];
      setServices(combined);

      const params = new URLSearchParams(path.split('?')[1] || '');
      const pre = params.get('service');
      if (pre) setForm((f) => ({ ...f, service_title: pre }));
    })();
  }, [path]);

  const selected = useMemo(
    () => services.find((s) => s.title === form.service_title) as Service | TiktokAccount | undefined,
    [services, form.service_title]
  );

  const currency: Currency = (selected as Service | undefined)?.currency || 'PKR';
  const basePrice = selected
    ? 'sale_price' in selected
      ? effectivePrice(selected as Service)
      : (selected as TiktokAccount).price
    : 0;

  const discountAmount = useMemo(() => {
    if (!coupon || !selected) return 0;
    if (coupon.discount_type === 'percentage') {
      return Math.round(basePrice * (coupon.discount_value / 100));
    }
    return Math.min(coupon.discount_value, basePrice);
  }, [coupon, basePrice, selected]);

  const finalPrice = Math.max(0, basePrice - discountAmount);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg('');
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.trim().toUpperCase())
      .eq('enabled', true)
      .maybeSingle();
    if (error || !data) {
      setCoupon(null);
      setCouponMsg('Invalid or expired coupon.');
      return;
    }
    const c = data as Coupon;
    if (c.expiry_date && new Date(c.expiry_date) < new Date()) {
      setCoupon(null);
      setCouponMsg('This coupon has expired.');
      return;
    }
    if (c.usage_limit && c.used_count >= c.usage_limit) {
      setCoupon(null);
      setCouponMsg('This coupon has reached its usage limit.');
      return;
    }
    setCoupon(c);
    setCouponMsg('Coupon applied!');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.service_title) return;
    setStatus('submitting');

    const orderInsert = {
      customer_name: form.customer_name,
      email: form.email,
      phone: form.phone,
      country: form.country,
      service_title: form.service_title,
      service_id: (selected as Service)?.id ?? null,
      price: basePrice,
      currency,
      requirements: form.requirements,
      coupon_code: coupon?.code || '',
      discount_amount: discountAmount,
      final_price: finalPrice,
      status: 'pending',
    };

    const { error } = await supabase.from('orders').insert(orderInsert);
    if (error) {
      setStatus('error');
      return;
    }

    if (coupon) {
      await supabase
        .from('coupons')
        .update({ used_count: coupon.used_count + 1 })
        .eq('id', coupon.id);
    }

    const waMsg = buildOrderMessage({
      customerName: form.customer_name,
      serviceTitle: form.service_title,
      price: basePrice,
      currency,
      email: form.email,
      phone: form.phone,
      country: form.country,
      requirements: form.requirements,
      couponCode: coupon?.code,
      discountAmount,
      finalPrice,
    });

    window.open(buildWhatsAppUrl(settings.whatsapp_number, waMsg), '_blank');
    setStatus('done');
  };

  if (status === 'done') {
    return (
      <div className="pt-32 container-x min-h-[60vh] grid place-items-center text-center">
        <Reveal>
          <div className="glass-strong p-10 max-w-md">
            <div className="h-16 w-16 rounded-full bg-emerald-500/20 grid place-items-center mx-auto mb-5 animate-pulse-glow">
              <Check className="h-8 w-8 text-emerald-300" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white">Order Placed!</h2>
            <p className="text-gray-400 mt-3">
              Your order has been saved and WhatsApp is opening with the full details. We'll be in touch shortly.
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setForm({ customer_name: '', email: '', phone: '', country: 'Pakistan', service_title: '', requirements: '' });
                setCoupon(null);
                setCouponCode('');
              }}
              className="btn-ghost mt-6"
            >
              Place Another Order
            </button>
          </div>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="pt-24 container-x section-pad">
      <div className="max-w-3xl mx-auto">
        <Reveal>
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-emerald-300 mb-4">
              <ShoppingBag className="h-3.5 w-3.5" /> Order Form
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">Place Your Order</h1>
            <p className="text-gray-400 mt-3">Fill in your details — we'll save the order and open WhatsApp with everything ready to send.</p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <form onSubmit={submit} className="glass p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Your Name *">
                <input className="input-field" required value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} placeholder="John Doe" />
              </Field>
              <Field label="Email">
                <input type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
              </Field>
              <Field label="Phone Number">
                <input className="input-field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XXXXXXXXX" />
              </Field>
              <Field label="Country">
                <select className="input-field" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                  {COUNTRIES.map((c) => <option key={c} value={c} className="bg-ink-800">{c}</option>)}
                </select>
              </Field>
            </div>

            <Field label="Select Service *">
              <select
                className="input-field"
                required
                value={form.service_title}
                onChange={(e) => setForm({ ...form, service_title: e.target.value })}
              >
                <option value="" className="bg-ink-800">Choose a service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.title} className="bg-ink-800">
                    {s.title} — {formatPrice('sale_price' in s ? effectivePrice(s as Service) : (s as TiktokAccount).price, (s as Service).currency || 'PKR')}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Requirements / Order Details">
              <textarea className="input-field min-h-[120px] resize-y" value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} placeholder="Describe what you need..." />
            </Field>

            {/* Coupon */}
            <div className="border-t border-white/5 pt-5">
              <label className="text-sm text-gray-400 mb-1.5 block flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  className="input-field flex-1"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                />
                <button type="button" onClick={applyCoupon} className="btn-ghost px-5">Apply</button>
                {coupon && (
                  <button type="button" onClick={() => { setCoupon(null); setCouponCode(''); setCouponMsg(''); }} className="px-3 rounded-xl bg-red-500/10 text-red-300 hover:bg-red-500/20">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {couponMsg && (
                <p className={`text-xs mt-2 ${coupon ? 'text-emerald-300' : 'text-red-400'}`}>{couponMsg}</p>
              )}
            </div>

            {/* Summary */}
            {selected && (
              <div className="glass p-5 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Service</span>
                  <span className="text-white">{form.service_title}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Price</span>
                  <span className="text-white">{formatPrice(basePrice, currency)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-emerald-300">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-white/5">
                  <span className="text-white">Total</span>
                  <span className="text-emerald-300">{formatPrice(finalPrice, currency)}</span>
                </div>
              </div>
            )}

            <button type="submit" disabled={status === 'submitting'} className="btn-whatsapp w-full">
              {status === 'submitting' ? 'Placing order...' : 'Place Order & Open WhatsApp'}
              <Send className="h-4 w-4" />
            </button>
            {status === 'error' && <p className="text-red-400 text-sm text-center">Could not save order. Please try again or contact us on WhatsApp.</p>}
          </form>
        </Reveal>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
