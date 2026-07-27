import { useEffect, useState } from 'react';
import type { Service, Currency } from '@/lib/types';
import { AdminCard } from '../AdminDashboard';
import { supabase } from '@/lib/supabase';
import { formatPrice, effectivePrice } from '@/lib/whatsapp';
import { Plus, Pencil, Trash2, X, Star, Crown } from 'lucide-react';

const EMPTY: Omit<Service, 'id' | 'created_at'> = {
  title: '', description: '', price: 0, sale_price: 0, discount_percentage: 0,
  currency: 'PKR', image_url: '', category: '', featured: false, best_seller: false,
  enabled: true, sort_order: 0,
};

export function ServicesSection() {
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, 'id' | 'created_at'>>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('services').select('*').order('sort_order');
    setItems((data as Service[]) || []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (s: Service) => {
    setEditing(s);
    const { id: _id, created_at: _c, ...rest } = s;
    setForm(rest);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await supabase.from('services').update(form).eq('id', editing.id);
    } else {
      await supabase.from('services').insert(form);
    }
    setShowForm(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Services</h1>
          <p className="text-gray-500 text-sm mt-1">Add, edit, and manage your services.</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((s) => (
          <div key={s.id} className="glass p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  {s.best_seller && <Crown className="h-3.5 w-3.5 text-amber-300" />}
                  {s.featured && <Star className="h-3.5 w-3.5 text-emerald-300" />}
                </div>
                <h3 className="text-white font-medium mt-1 truncate">{s.title}</h3>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${s.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-500/20 text-gray-400'}`}>
                {s.enabled ? 'Active' : 'Hidden'}
              </span>
            </div>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{s.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 font-bold">{formatPrice(effectivePrice(s), s.currency)}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => remove(s.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-300">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Service' : 'Add Service'} onClose={() => setShowForm(false)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            </div>
            <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
            <Input label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." />
            <div className="grid sm:grid-cols-3 gap-4">
              <NumberInput label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
              <NumberInput label="Sale Price" value={form.sale_price || 0} onChange={(v) => setForm({ ...form, sale_price: v })} />
              <NumberInput label="Discount %" value={form.discount_percentage || 0} onChange={(v) => setForm({ ...form, discount_percentage: v })} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Currency</label>
                <select className="input-field" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}>
                  <option value="PKR" className="bg-ink-800">PKR</option>
                  <option value="USD" className="bg-ink-800">USD</option>
                  <option value="GBP" className="bg-ink-800">GBP</option>
                </select>
              </div>
              <NumberInput label="Sort Order" value={form.sort_order} onChange={(v) => setForm({ ...form, sort_order: v })} />
            </div>
            <div className="flex flex-wrap gap-4">
              <Toggle label="Featured" checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} />
              <Toggle label="Best Seller" checked={form.best_seller} onChange={(v) => setForm({ ...form, best_seller: v })} />
              <Toggle label="Enabled" checked={form.enabled} onChange={(v) => setForm({ ...form, enabled: v })} />
            </div>
            <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'} Service</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

// Shared form helpers (reused across sections)
export function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="glass-strong w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Input({ label, value, onChange, required, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1.5 block">{label}</label>
      <input type={type} className="input-field" value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} />
    </div>
  );
}

export function NumberInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1.5 block">{label}</label>
      <input type="number" className="input-field" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-sm text-gray-400 mb-1.5 block">{label}</label>
      <textarea className="input-field min-h-[100px] resize-y" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-2">
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-emerald-500' : 'bg-white/10'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </span>
      <span className="text-sm text-gray-300">{label}</span>
    </button>
  );
}
