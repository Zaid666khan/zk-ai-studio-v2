import { useState } from 'react';
import type { Order } from '@/lib/types';
import { AdminCard } from '../AdminDashboard';
import { StatusBadge } from './OverviewSection';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/whatsapp';
import { Search, Check, X, CheckCheck, Trash2 } from 'lucide-react';

export function OrdersSection({
  orders, setOrders,
}: {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | Order['status']>('all');

  const filtered = orders.filter((o) => {
    const matchSearch =
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.service_title.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || o.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = async (id: string, status: Order['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await supabase.from('orders').update({ status }).eq('id', id);
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this order?')) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    await supabase.from('orders').delete().eq('id', id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-500 text-sm mt-1">Manage all customer orders.</p>
      </div>

      <AdminCard title={`${filtered.length} order${filtered.length !== 1 ? 's' : ''}`}>
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              className="input-field pl-10"
              placeholder="Search by name, service, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="input-field sm:w-44" value={filter} onChange={(e) => setFilter(e.target.value as 'all' | Order['status'])}>
            <option value="all" className="bg-ink-800">All Status</option>
            <option value="pending" className="bg-ink-800">Pending</option>
            <option value="accepted" className="bg-ink-800">Accepted</option>
            <option value="completed" className="bg-ink-800">Completed</option>
            <option value="rejected" className="bg-ink-800">Rejected</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-500 text-sm py-10 text-center">No orders found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => (
              <div key={o.id} className="glass p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium">{o.customer_name}</span>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{o.service_title}</div>
                    <div className="text-xs text-gray-500 mt-1 space-x-3">
                      {o.email && <span>{o.email}</span>}
                      {o.phone && <span>{o.phone}</span>}
                      {o.country && <span>{o.country}</span>}
                    </div>
                    {o.requirements && <p className="text-xs text-gray-500 mt-2">{o.requirements}</p>}
                    {o.coupon_code && <p className="text-xs text-emerald-400 mt-1">Coupon: {o.coupon_code} (-{formatPrice(Number(o.discount_amount), o.currency)})</p>}
                    <div className="text-xs text-gray-600 mt-2">{new Date(o.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-300">{formatPrice(Number(o.final_price), o.currency)}</div>
                    {Number(o.discount_amount) > 0 && (
                      <div className="text-xs text-gray-500 line-through">{formatPrice(Number(o.price), o.currency)}</div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/5">
                  <button onClick={() => updateStatus(o.id, 'accepted')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-300 hover:bg-blue-500/25 text-xs font-medium">
                    <Check className="h-3.5 w-3.5" /> Accept
                  </button>
                  <button onClick={() => updateStatus(o.id, 'completed')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 text-xs font-medium">
                    <CheckCheck className="h-3.5 w-3.5" /> Complete
                  </button>
                  <button onClick={() => updateStatus(o.id, 'rejected')} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 text-xs font-medium">
                    <X className="h-3.5 w-3.5" /> Reject
                  </button>
                  <button onClick={() => remove(o.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 text-red-300 hover:bg-red-500/25 text-xs font-medium ml-auto">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
