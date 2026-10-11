import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Coffee, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { isSupabaseConfigured } from '../lib/supabase';
import { APP_CONFIG } from '../lib/config';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithSupabase, loginDemo } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSupabaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Lütfen e-posta adresinizi ve parolanızı girin.');
      return;
    }

    setIsSubmitting(true);
    const result = await loginWithSupabase(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Giriş başarısız oldu.');
    }
  };

  const handleDemoLogin = () => {
    loginDemo();
    navigate('/admin/dashboard');
  };

  return (
    <main className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-warm-lg border border-coffee-200 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-coffee-950 text-white flex items-center justify-center mx-auto shadow-warm">
            <Shield className="w-6 h-6 text-terracotta-400" />
          </div>
          <h1 className="font-serif font-black text-2xl text-coffee-950">
            Yönetici Girişi
          </h1>
          <p className="text-xs text-coffee-600">
            {APP_CONFIG.brandName} • Kafe ve İçerik Yönetim Paneli
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Supabase Login Form */}
        <form onSubmit={handleSupabaseSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-coffee-800 mb-1">
              Yönetici E-posta
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-coffee-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@kafeniz.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-coffee-200 bg-cream-50/50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-coffee-800 mb-1">
              Parola
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-coffee-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-coffee-200 bg-cream-50/50 text-xs text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500/40 focus:border-terracotta-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-coffee-900 hover:bg-black text-white font-bold text-xs shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50"
          >
            {isSubmitting ? 'Doğrulanıyor...' : 'Supabase ile Giriş Yap'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Mode Instant Login */}
        <div className="pt-4 border-t border-coffee-100 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-coffee-700">
            <Sparkles className="w-4 h-4 text-caramel-600" />
            <span>Geliştirici / Ön İzleme Erişimi</span>
          </div>
          <p className="text-[11px] text-coffee-600 leading-relaxed">
            {isSupabaseConfigured 
              ? 'Canlı Supabase bağlantınız mevcuttur. Dilerseniz test amacıyla demo modunda da oturum açabilirsiniz.'
              : 'Supabase henüz bağlanmadığı için bu butona tıklayarak yerel demo verileriyle tüm paneli inceleyebilirsiniz.'}
          </p>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-caramel-100 hover:bg-caramel-200 text-coffee-900 font-bold text-xs border border-caramel-300 transition-colors flex items-center justify-center gap-2"
          >
            <Coffee className="w-4 h-4 text-caramel-700" />
            Demo Yönetici Olarak Panele Gir
          </button>
        </div>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="text-xs text-coffee-500 hover:text-coffee-800 transition-colors"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
};
