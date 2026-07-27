import { useEffect, useState } from 'react';
import type { TiktokAccount, Currency } from '@/lib/types';
import { AdminCard } from '../AdminDashboard';
import { Modal, Input, NumberInput, Textarea } from './ServicesSection';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/whatsapp';
import { Plus, Pencil, Trash2, Users } from 'lucide-react';

const EMPTY: Omit<TiktokAccount, 'id' | 'created_at'> = {
  title: '', followers: '0', country: 'United Kingdom', price: 0, currency: 'PKR',
  status: 'available', description: '', image_url: '',
};

export function TiktokSection() {
  const [items, setItems] = useState<TiktokAccount[]>([]);
  const [editing, setEditing] = useState<TiktokAccount | null>(null);
  const [form, setForm] = useState<Omit<TiktokAccount, 'id' | 'created_at'>>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('tiktok_accounts').select('*').order('created_at', { ascending: false });
    setItems((data as TiktokAccount[]) || []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (a: TiktokAccount) => {
    setEditing(a);
    const { id: _id, created_at: _c, ...rest } = a;
    setForm(rest);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await supabase.from('tiktok_accounts').update(form).eq('id', editing.id);
    else await supabase.from('tiktok_accounts').insert(form);
    setShowForm(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this account?')) return;
    await supabase.from('tiktok_accounts').delete().eq('id', id);
    await load();
  };

  const toggleStatus = async (a: TiktokAccount) => {
    const status = a.status === 'available' ? 'sold' : 'available';
    await supabase.from('tiktok_accounts').update({ status }).eq('id', a.id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">UK TikTok Accounts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your TikTok account store.</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm"><Plus className="h-4 w-4" /> Add Account</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((a) => (
          <div key={a.id} className="glass p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-300" />
                <span className="text-white font-medium truncate">{a.title}</span>
              </div>
              <button onClick={() => toggleStatus(a)} className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${a.status === 'available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                {a.status === 'available' ? 'Available' : 'Sold'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-2">{a.followers} followers · {a.country}</p>
            <p className="text-xs text-gray-500 line-clamp-2 mb-2">{a.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-emerald-300 font-bold">{formatPrice(a.price, a.currency)}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(a.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Account' : 'Add Account'} onClose={() => setShowForm(false)}>
          <form onSubmit={save} className="space-y-4">
            <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Followers" value={form.followers} onChange={(v) => setForm({ ...form, followers: v })} placeholder="10,000" />
              <Input label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            </div>
            <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
            <Input label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." />
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberInput label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Currency</label>
                <select className="input-field" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}>
                  <option value="PKR" className="bg-ink-800">PKR</option>
                  <option value="USD" className="bg-ink-800">USD</option>
                  <option value="GBP" className="bg-ink-800">GBP</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-1.5 block">Status</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'available' | 'sold' })}>
                <option value="available" className="bg-ink-800">Available</option>
                <option value="sold" className="bg-ink-800">Sold</option>
              </select>
            </div>
            <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'} Account</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
