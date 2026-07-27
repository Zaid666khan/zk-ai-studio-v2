import { useEffect, useState } from 'react';
import type { Coupon } from '@/lib/types';
import { AdminCard } from '../AdminDashboard';
import { Modal, Input, NumberInput, Toggle } from './ServicesSection';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Ticket } from 'lucide-react';

type CouponForm = {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  expiry_date: string;
  usage_limit: number;
  enabled: boolean;
};

const EMPTY: CouponForm = {
  code: '', discount_type: 'percentage', discount_value: 0, expiry_date: '',
  usage_limit: 0, enabled: true,
};

export function CouponsSection() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CouponForm>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    setItems((data as Coupon[]) || []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({
      code: c.code, discount_type: c.discount_type, discount_value: c.discount_value,
      expiry_date: c.expiry_date || '', usage_limit: c.usage_limit || 0, enabled: c.enabled,
    });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, code: form.code.toUpperCase(), expiry_date: form.expiry_date || null, usage_limit: form.usage_limit || null };
    if (editing) await supabase.from('coupons').update(payload).eq('id', editing.id);
    else await supabase.from('coupons').insert(payload);
    setShowForm(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this coupon?')) return;
    await supabase.from('coupons').delete().eq('id', id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage discount codes.</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm"><Plus className="h-4 w-4" /> Add Coupon</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <div key={c.id} className="glass p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-emerald-300" />
                <span className="text-white font-mono font-medium">{c.code}</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'}`}>
                {c.enabled ? 'Active' : 'Disabled'}
              </span>
            </div>
            <p className="text-sm text-emerald-300">
              {c.discount_type === 'percentage' ? `${c.discount_value}% off` : `Rs${c.discount_value} off`}
            </p>
            <div className="text-xs text-gray-500 mt-1 space-x-2">
              {c.expiry_date && <span>Expires: {c.expiry_date}</span>}
              {c.usage_limit ? <span>Used {c.used_count}/{c.usage_limit}</span> : <span>Used {c.used_count}</span>}
            </div>
            <div className="flex gap-1 mt-3">
              <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => remove(c.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-500 text-sm col-span-full text-center py-10">No coupons yet.</p>}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Coupon' : 'Add Coupon'} onClose={() => setShowForm(false)}>
          <form onSubmit={save} className="space-y-4">
            <Input label="Coupon Code" value={form.code} onChange={(v) => setForm({ ...form, code: v.toUpperCase() })} required placeholder="SAVE20" />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Discount Type</label>
                <select className="input-field" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as 'percentage' | 'fixed' })}>
                  <option value="percentage" className="bg-ink-800">Percentage</option>
                  <option value="fixed" className="bg-ink-800">Fixed Amount</option>
                </select>
              </div>
              <NumberInput label="Discount Value" value={form.discount_value} onChange={(v) => setForm({ ...form, discount_value: v })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Expiry Date</label>
                <input type="date" className="input-field" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
              </div>
              <NumberInput label="Usage Limit (0 = unlimited)" value={form.usage_limit} onChange={(v) => setForm({ ...form, usage_limit: v })} />
            </div>
            <Toggle label="Enabled" checked={form.enabled} onChange={(v) => setForm({ ...form, enabled: v })} />
            <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'} Coupon</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
