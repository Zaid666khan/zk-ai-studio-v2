import { useState } from 'react';
import { useSettings } from '@/lib/settings';
import { supabase } from '@/lib/supabase';
import { Input, Textarea } from './ServicesSection';
import { Save, Check } from 'lucide-react';

export function SettingsSection() {
  const { settings, refresh } = useSettings();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('settings').update(form).eq('id', 1);
    await refresh();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Website Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Update your site content — changes appear instantly.</p>
      </div>

      <form onSubmit={save} className="space-y-6">
        <div className="glass p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Branding</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Website Name" value={form.website_name} onChange={(v) => setForm({ ...form, website_name: v })} />
            <Input label="Logo URL" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} placeholder="https://..." />
          </div>
          <Input label="Footer Text" value={form.footer_text} onChange={(v) => setForm({ ...form, footer_text: v })} />
        </div>

        <div className="glass p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Hero Section</h2>
          <Input label="Hero Title" value={form.hero_title} onChange={(v) => setForm({ ...form, hero_title: v })} />
          <Textarea label="Hero Subtitle" value={form.hero_subtitle} onChange={(v) => setForm({ ...form, hero_subtitle: v })} />
        </div>

        <div className="glass p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="WhatsApp Number" value={form.whatsapp_number} onChange={(v) => setForm({ ...form, whatsapp_number: v })} />
            <Input label="Email Address" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          </div>
        </div>

        <div className="glass p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Social Links</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Input label="Facebook" value={form.facebook} onChange={(v) => setForm({ ...form, facebook: v })} placeholder="https://..." />
            <Input label="Instagram" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} placeholder="https://..." />
            <Input label="Twitter / X" value={form.twitter} onChange={(v) => setForm({ ...form, twitter: v })} placeholder="https://..." />
            <Input label="LinkedIn" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} placeholder="https://..." />
          </div>
        </div>

        <div className="glass p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">About</h2>
          <Textarea label="About Text" value={form.about_text} onChange={(v) => setForm({ ...form, about_text: v })} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save Settings'}
            <Save className="h-4 w-4" />
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-emerald-300 text-sm">
              <Check className="h-4 w-4" /> Saved! Changes are live.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
