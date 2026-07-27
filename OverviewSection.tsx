import { useMemo } from 'react';
import type { Order, ContactMessage } from '@/lib/types';
import { AdminCard, StatCard } from '../AdminDashboard';
import { formatPrice } from '@/lib/whatsapp';
import { Package, Users, DollarSign, TrendingUp, Bell, Mail } from 'lucide-react';

export function OverviewSection({
  orders, messages, onGoOrders, onGoMessages,
}: {
  orders: Order[];
  messages: ContactMessage[];
  onGoOrders: () => void;
  onGoMessages: () => void;
}) {
  const stats = useMemo(() => {
    const completed = orders.filter((o) => o.status === 'completed');
    const revenue = completed.reduce((sum, o) => sum + Number(o.final_price), 0);
    const customers = new Set(orders.map((o) => o.email || o.phone || o.customer_name)).size;
    const currency = orders[0]?.currency || 'PKR';
    return {
      totalOrders: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      revenue,
      customers,
      currency,
    };
  }, [orders]);

  const recent = orders.slice(0, 5);
  const recentMessages = messages.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back — here's what's happening.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Orders" value={String(stats.totalOrders)} color="bg-emerald-500/15 text-emerald-300" />
        <StatCard icon={Users} label="Customers" value={String(stats.customers)} color="bg-blue-500/15 text-blue-300" />
        <StatCard icon={DollarSign} label="Revenue" value={formatPrice(stats.revenue, stats.currency)} color="bg-amber-500/15 text-amber-300" />
        <StatCard icon={TrendingUp} label="Pending Orders" value={String(stats.pending)} color="bg-purple-500/15 text-purple-300" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard
          title="Recent Orders"
          action={<button onClick={onGoOrders} className="text-sm text-emerald-300 hover:text-emerald-200">View all</button>}
        >
          {recent.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {recent.map((o) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{o.customer_name}</div>
                    <div className="text-xs text-gray-500 truncate">{o.service_title}</div>
                  </div>
                  <div className="text-right ml-3">
                    <div className="text-sm text-emerald-300 font-medium">{formatPrice(Number(o.final_price), o.currency)}</div>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        <AdminCard
          title="Notifications"
          action={<button onClick={onGoMessages} className="text-sm text-emerald-300 hover:text-emerald-200">View messages</button>}
        >
          <div className="space-y-3">
            {stats.pending > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10">
                <Bell className="h-4 w-4 text-emerald-300" />
                <span className="text-sm text-gray-300">{stats.pending} new order{stats.pending > 1 ? 's' : ''} need attention</span>
              </div>
            )}
            {recentMessages.map((m) => (
              <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                <Mail className="h-4 w-4 text-blue-300 mt-0.5" />
                <div className="min-w-0">
                  <div className="text-white text-sm font-medium">{m.name}</div>
                  <div className="text-xs text-gray-500 truncate">{m.message}</div>
                </div>
              </div>
            ))}
            {stats.pending === 0 && recentMessages.length === 0 && (
              <p className="text-gray-500 text-sm">All caught up — no new notifications.</p>
            )}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: Order['status'] }) {
  const colors: Record<Order['status'], string> = {
    pending: 'bg-amber-500/20 text-amber-300',
    accepted: 'bg-blue-500/20 text-blue-300',
    completed: 'bg-emerald-500/20 text-emerald-300',
    rejected: 'bg-red-500/20 text-red-300',
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${colors[status]}`}>{status}</span>
  );
}
