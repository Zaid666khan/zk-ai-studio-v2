import { useState } from 'react';
import type { ContactMessage } from '@/lib/types';
import { AdminCard } from '../AdminDashboard';
import { supabase } from '@/lib/supabase';
import { Mail, Trash2, Reply, Check } from 'lucide-react';

export function MessagesSection({
  messages, setMessages,
}: {
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
}) {
  const [reply, setReply] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const markReplied = async (id: string) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, replied: true } : m)));
    await supabase.from('contact_messages').update({ replied: true }).eq('id', id);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    await supabase.from('contact_messages').delete().eq('id', id);
  };

  const sendReply = (m: ContactMessage) => {
    const subject = encodeURIComponent(`Re: Your message to ZK AI Studio`);
    const body = encodeURIComponent(`Hi ${m.name},\n\n${replyText}\n\nBest regards,\nZK AI Studio`);
    window.location.href = `mailto:${m.email}?subject=${subject}&body=${body}`;
    markReplied(m.id);
    setReply(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-gray-500 text-sm mt-1">View and reply to customer inquiries.</p>
      </div>

      {messages.length === 0 ? (
        <AdminCard title="No messages">
          <p className="text-gray-500 text-sm text-center py-10">No contact messages yet.</p>
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className="glass p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="h-10 w-10 rounded-xl bg-blue-500/15 grid place-items-center shrink-0">
                    <Mail className="h-5 w-5 text-blue-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{m.name}</span>
                      {m.replied && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">Replied</span>}
                    </div>
                    <a href={`mailto:${m.email}`} className="text-xs text-gray-500 hover:text-emerald-300">{m.email}</a>
                    <p className="text-sm text-gray-300 mt-2">{m.message}</p>
                    <div className="text-xs text-gray-600 mt-2">{new Date(m.created_at).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {m.email && (
                    <button onClick={() => setReply(reply === m.id ? null : m.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300" title="Reply">
                      <Reply className="h-3.5 w-3.5" />
                    </button>
                  )}
                  {!m.replied && m.email && (
                    <button onClick={() => markReplied(m.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300" title="Mark replied">
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button onClick={() => remove(m.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-300" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {reply === m.id && m.email && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <textarea
                    className="input-field min-h-[100px]"
                    placeholder="Type your reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <button onClick={() => sendReply(m)} className="btn-primary mt-3 text-sm" disabled={!replyText.trim()}>
                    Send Reply via Email
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
