import { useEffect } from 'react';
import { RouterProvider, useRouter } from '@/lib/router';
import { SettingsProvider } from '@/lib/settings';
import { AuthProvider, useAuth } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ServicesPage } from '@/pages/ServicesPage';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { PricingPage } from '@/pages/PricingPage';
import { AboutPage } from '@/pages/AboutPage';
import { ContactPage } from '@/pages/ContactPage';
import { FaqPage } from '@/pages/FaqPage';
import { PrivacyPage, TermsPage } from '@/pages/LegalPages';
import { OrderPage } from '@/pages/OrderPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';

function Routes() {
  const { path } = useRouter();
  const { isAdmin, loading } = useAuth();

  const route = path.split('?')[0];

  const isPublic = !route.startsWith('/admin');
  const isAdminRoute = route.startsWith('/admin');

  useEffect(() => {
    const title = 'ZK AI Studio — AI Website Development & UK TikTok Accounts';
    document.title = title;
  }, []);

  if (isAdminRoute) {
    if (loading) {
      return (
        <div className="min-h-screen grid place-items-center bg-ink-950">
          <div className="h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
        </div>
      );
    }
    if (!isAdmin && route === '/admin/dashboard') {
      return (
        <div className="min-h-screen bg-ink-950">
          <Navbar />
          <AdminLoginPage />
        </div>
      );
    }
    if (route === '/admin/dashboard' && isAdmin) {
      return (
        <div className="min-h-screen bg-ink-950">
          <Navbar />
          <AdminDashboard />
        </div>
      );
    }
    // default admin route = login
    return (
      <div className="min-h-screen bg-ink-950">
        <Navbar />
        <AdminLoginPage />
      </div>
    );
  }

  let page: React.ReactNode;
  switch (route) {
    case '/': page = <HomePage />; break;
    case '/services': page = <ServicesPage />; break;
    case '/portfolio': page = <PortfolioPage />; break;
    case '/pricing': page = <PricingPage />; break;
    case '/about': page = <AboutPage />; break;
    case '/contact': page = <ContactPage />; break;
    case '/faq': page = <FaqPage />; break;
    case '/privacy': page = <PrivacyPage />; break;
    case '/terms': page = <TermsPage />; break;
    case '/order': page = <OrderPage />; break;
    default: page = <HomePage />;
  }

  return (
    <div className="min-h-screen bg-ink-950 flex flex-col">
      <Navbar />
      <main className="flex-1">{page}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <SettingsProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </SettingsProvider>
    </RouterProvider>
  );
}

export default App;
