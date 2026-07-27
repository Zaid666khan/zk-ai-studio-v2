import { useEffect, useState } from 'react';
import type { Testimonial } from '@/lib/types';
import { AdminCard } from '../AdminDashboard';
import { Modal, Input, Textarea, NumberInput } from './ServicesSection';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';

const EMPTY: Omit<Testimonial, 'id' | 'created_at'> = {
  name: '', rating: 5, review: '', avatar_url: '', role: '',
};

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Omit<Testimonial, 'id' | 'created_at'>>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    setItems((data as Testimonial[]) || []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (t: Testimonial) => {
    setEditing(t);
    const { id: _id, created_at: _c, ...rest } = t;
    setForm(rest);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await supabase.from('testimonials').update(form).eq('id', editing.id);
    else await supabase.from('testimonials').insert(form);
    setShowForm(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Testimonials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage customer reviews.</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm"><Plus className="h-4 w-4" /> Add Review</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((t) => (
          <div key={t.id} className="glass p-4">
            <div className="flex items-center gap-3 mb-2">
              {t.avatar_url ? (
                <img src={t.avatar_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 grid place-items-center text-emerald-300 font-semibold">{t.name.charAt(0)}</div>
              )}
              <div className="min-w-0">
                <div className="text-white font-medium text-sm truncate">{t.name}</div>
                <div className="text-xs text-gray-500 truncate">{t.role}</div>
              </div>
            </div>
            <div className="flex gap-0.5 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? 'text-emerald-400' : 'text-gray-700'}`} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-gray-400 line-clamp-3">{t.review}</p>
            <div className="flex gap-1 mt-3">
              <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300"><Pencil className="h-3.5 w-3.5" /></button>
              <button onClick={() => remove(t.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-gray-500 text-sm col-span-full text-center py-10">No reviews yet.</p>}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Review' : 'Add Review'} onClose={() => setShowForm(false)}>
          <form onSubmit={save} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <Input label="Role" value={form.role} onChange={(v) => setForm({ ...form, role: v })} placeholder="Business Owner" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <NumberInput label="Rating (1-5)" value={form.rating} onChange={(v) => setForm({ ...form, rating: Math.min(5, Math.max(1, v)) })} />
              <Input label="Avatar URL" value={form.avatar_url} onChange={(v) => setForm({ ...form, avatar_url: v })} placeholder="https://..." />
            </div>
            <Textarea label="Review" value={form.review} onChange={(v) => setForm({ ...form, review: v })} />
            <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'} Review</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
