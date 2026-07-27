import { useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/lib/auth';
import { Link, useRouter } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type {
  Order, Service, TiktokAccount, Coupon, PortfolioItem,
  Testimonial, ContactMessage, Settings,
} from '@/lib/types';
import {
  LayoutDashboard, Package, Users, Ticket, FolderOpen, Star,
  Mail, Settings as SettingsIcon, LogOut, Menu, X, ShoppingBag,
  TrendingUp, DollarSign, Bell,
} from 'lucide-react';
import { OverviewSection } from './sections/OverviewSection';
import { OrdersSection } from './sections/OrdersSection';
import { ServicesSection } from './sections/ServicesSection';
import { TiktokSection } from './sections/TiktokSection';
import { CouponsSection } from './sections/CouponsSection';
import { PortfolioSection } from './sections/PortfolioSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { MessagesSection } from './sections/MessagesSection';
import { SettingsSection } from './sections/SettingsSection';

type Tab =
  | 'overview' | 'orders' | 'services' | 'tiktok' | 'coupons'
  | 'portfolio' | 'testimonials' | 'messages' | 'settings';

const NAV: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'orders', label: 'Orders', icon: Package },
  { id: 'services', label: 'Services', icon: ShoppingBag },
  { id: 'tiktok', label: 'TikTok Accounts', icon: Users },
  { id: 'coupons', label: 'Coupons', icon: Ticket },
  { id: 'portfolio', label: 'Portfolio', icon: FolderOpen },
  { id: 'testimonials', label: 'Testimonials', icon: Star },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export function AdminDashboard() {
  const { user, signOut, isAdmin } = useAuth();
  const { navigate } = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin');
      return;
    }
    (async () => {
      const [{ data: o }, { data: m }] = await Promise.all([
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
      ]);
      setOrders((o as Order[]) || []);
      setMessages((m as ContactMessage[]) || []);
    })();
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  const newOrders = orders.filter((o) => o.status === 'pending').length;
  const newMessages = messages.filter((m) => !m.replied).length;

  return (
    <div className="min-h-screen bg-ink-950 pt-16 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 bg-ink-900/80 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 flex items-center justify-between lg:hidden">
          <span className="text-white font-semibold">Dashboard</span>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => { setTab(n.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === n.id
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <n.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{n.label}</span>
              {n.id === 'orders' && newOrders > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-ink-950 font-bold">{newOrders}</span>
              )}
              {n.id === 'messages' && newMessages > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500 text-ink-950 font-bold">{newMessages}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 mt-auto border-t border-white/5">
          <div className="px-3 py-2 text-xs text-gray-500 truncate">{user?.email}</div>
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <div className="lg:hidden p-4 flex items-center justify-between sticky top-16 bg-ink-950/80 backdrop-blur-xl border-b border-white/5 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-300">
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-white font-semibold capitalize">{tab}</span>
          <div className="w-6" />
        </div>

        <div className="p-5 md:p-8">
          {tab === 'overview' && <OverviewSection orders={orders} messages={messages} onGoOrders={() => setTab('orders')} onGoMessages={() => setTab('messages')} />}
          {tab === 'orders' && <OrdersSection orders={orders} setOrders={setOrders} />}
          {tab === 'services' && <ServicesSection />}
          {tab === 'tiktok' && <TiktokSection />}
          {tab === 'coupons' && <CouponsSection />}
          {tab === 'portfolio' && <PortfolioSection />}
          {tab === 'testimonials' && <TestimonialsSection />}
          {tab === 'messages' && <MessagesSection messages={messages} setMessages={setMessages} />}
          {tab === 'settings' && <SettingsSection />}
        </div>
      </main>
    </div>
  );
}

export function AdminCard({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <div className="glass p-5 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-lg font-semibold text-white">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, color }: { icon: typeof TrendingUp; label: string; value: string; color: string }) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-xs text-gray-500 mt-1">{label}</div>
        </div>
        <div className={`h-11 w-11 rounded-xl grid place-items-center ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
