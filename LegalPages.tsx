import { Reveal, SectionTitle } from '@/components/ui';
import { useSettings } from '@/lib/settings';

export function PrivacyPage() {
  const { settings } = useSettings();
  return (
    <div className="pt-24 container-x section-pad max-w-3xl">
      <Reveal>
        <SectionTitle center={false} eyebrow="Legal" title="Privacy Policy" />
      </Reveal>
      <div className="glass p-8 md:p-10 space-y-5 text-sm text-gray-400 leading-relaxed">
        <p className="text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          {settings.website_name} ("we", "us") respects your privacy. This policy explains how we
          collect, use, and protect information when you use our website.
        </p>
        <h3 className="text-white font-semibold text-base">Information We Collect</h3>
        <p>
          When you place an order or contact us, we collect your name, email, phone number, country,
          and any details you provide about your project. We do not collect sensitive financial data
          on this site — payments are arranged privately.
        </p>
        <h3 className="text-white font-semibold text-base">How We Use It</h3>
        <p>
          Your information is used solely to fulfill your order, respond to inquiries, and improve
          our services. We never sell or rent your data to third parties.
        </p>
        <h3 className="text-white font-semibold text-base">Data Storage</h3>
        <p>
          Orders and messages are stored securely in our database and accessible only to authorized
          administrators.
        </p>
        <h3 className="text-white font-semibold text-base">Cookies</h3>
        <p>
          We use essential cookies to keep you signed in and remember preferences. No third-party
          tracking cookies are used.
        </p>
        <h3 className="text-white font-semibold text-base">Contact</h3>
        <p>
          Questions about privacy? Email us at {settings.email} or message us on WhatsApp at{' '}
          {settings.whatsapp_number}.
        </p>
      </div>
    </div>
  );
}

export function TermsPage() {
  const { settings } = useSettings();
  return (
    <div className="pt-24 container-x section-pad max-w-3xl">
      <Reveal>
        <SectionTitle center={false} eyebrow="Legal" title="Terms & Conditions" />
      </Reveal>
      <div className="glass p-8 md:p-10 space-y-5 text-sm text-gray-400 leading-relaxed">
        <p className="text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
        <p>
          By using {settings.website_name}, you agree to these terms. Please read them carefully.
        </p>
        <h3 className="text-white font-semibold text-base">Services</h3>
        <p>
          We provide web development and TikTok account sales. All services are described on the
          Services and Pricing pages. Final deliverables are agreed upon before work begins.
        </p>
        <h3 className="text-white font-semibold text-base">Orders & Payment</h3>
        <p>
          Orders placed through this site are requests, not binding contracts until payment is
          confirmed. Prices are listed in PKR, USD, or GBP. Work begins after payment is received.
        </p>
        <h3 className="text-white font-semibold text-base">Refunds</h3>
        <p>
          If work has not started, a full refund is available. Once development begins, refunds are
          issued based on work completed. TikTok accounts, once credentials are delivered, are
          non-refundable.
        </p>
        <h3 className="text-white font-semibold text-base">TikTok Accounts</h3>
        <p>
          We are not affiliated with TikTok. Accounts are sold as-is. Buyers are responsible for
          securing accounts after handover (changing password, email, and 2FA).
        </p>
        <h3 className="text-white font-semibold text-base">Intellectual Property</h3>
        <p>
          Final website code and designs are transferred to the client upon full payment. We may
          display completed work in our portfolio unless you request otherwise.
        </p>
        <h3 className="text-white font-semibold text-base">Contact</h3>
        <p>
          Questions? Email {settings.email} or WhatsApp {settings.whatsapp_number}.
        </p>
      </div>
    </div>
  );
}
