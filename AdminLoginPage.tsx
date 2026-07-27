import { useState } from 'react';
import { useAuth, ADMIN_EMAIL } from '@/lib/auth';
import { Link } from '@/lib/router';
import { Lock, LogIn, ShieldCheck } from 'lucide-react';

export function AdminLoginPage() {
  const { signIn, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="pt-32 container-x min-h-[60vh] grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-400 animate-spin" />
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="pt-32 container-x min-h-[60vh] grid place-items-center text-center">
        <div className="glass-strong p-10 max-w-md">
          <ShieldCheck className="h-10 w-10 text-emerald-300 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-white">Already signed in</h2>
          <p className="text-gray-400 mt-2">Go to your dashboard.</p>
          <Link to="/admin/dashboard" className="btn-primary mt-6">Open Dashboard</Link>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    if (email.toLowerCase() !== ADMIN_EMAIL) {
      setError('Access denied. This area is restricted to the site administrator.');
      setSubmitting(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) setError(error);
    setSubmitting(false);
  };

  return (
    <div className="pt-24 container-x min-h-[80vh] grid place-items-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 grid place-items-center mx-auto mb-4 shadow-[0_0_30px_-4px_rgba(16,185,129,0.6)]">
            <Lock className="h-7 w-7 text-ink-950" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-gray-500 text-sm mt-2">Secure access to the ZK AI Studio dashboard</p>
        </div>

        <form onSubmit={submit} className="glass p-6 md:p-8 space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-1.5 block">Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Signing in...' : 'Sign In'}
            <LogIn className="h-4 w-4" />
          </button>
          <p className="text-xs text-gray-500 text-center">
            Admin access is restricted. Only the authorized administrator can sign in.
          </p>
        </form>
      </div>
    </div>
  );
}
