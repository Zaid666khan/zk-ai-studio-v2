import { useEffect, useState } from 'react';
import type { PortfolioItem } from '@/lib/types';
import { AdminCard } from '../AdminDashboard';
import { Modal, Input, Textarea } from './ServicesSection';
import { supabase } from '@/lib/supabase';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';

const EMPTY: Omit<PortfolioItem, 'id' | 'created_at'> = {
  title: '', description: '', image_url: '', category: '', link: '',
};

export function PortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [form, setForm] = useState<Omit<PortfolioItem, 'id' | 'created_at'>>(EMPTY);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
    setItems((data as PortfolioItem[]) || []);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing(null); setShowForm(true); };
  const openEdit = (p: PortfolioItem) => {
    setEditing(p);
    const { id: _id, created_at: _c, ...rest } = p;
    setForm(rest);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) await supabase.from('portfolio').update(form).eq('id', editing.id);
    else await supabase.from('portfolio').insert(form);
    setShowForm(false);
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await supabase.from('portfolio').delete().eq('id', id);
    await load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Portfolio</h1>
          <p className="text-gray-500 text-sm mt-1">Showcase your projects.</p>
        </div>
        <button onClick={openNew} className="btn-primary text-sm"><Plus className="h-4 w-4" /> Add Project</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="glass overflow-hidden">
            <div className="aspect-video bg-ink-800">
              {p.image_url && <img src={p.image_url} alt={p.title} className="h-full w-full object-cover" />}
            </div>
            <div className="p-4">
              {p.category && <span className="text-[10px] uppercase tracking-wider text-emerald-400/80 font-semibold">{p.category}</span>}
              <h3 className="text-white font-medium mt-1 truncate">{p.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mt-1">{p.description}</p>
              <div className="flex gap-1 mt-3">
                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-16">
            <FolderOpen className="h-10 w-10 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No projects yet.</p>
          </div>
        )}
      </div>

      {showForm && (
        <Modal title={editing ? 'Edit Project' : 'Add Project'} onClose={() => setShowForm(false)}>
          <form onSubmit={save} className="space-y-4">
            <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
              <Input label="Project Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} placeholder="https://..." />
            </div>
            <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} />
            <Input label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." />
            <button type="submit" className="btn-primary w-full">{editing ? 'Update' : 'Create'} Project</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
