import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Store, 
  HelpCircle, 
  LogOut, 
  ExternalLink, 
  Coffee,
  Bell,
  Inbox
} from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { APP_CONFIG } from '../lib/config';
import { getActiveServiceRequestsCount } from '../lib/api';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, subtitle }) => {
  const { isAuthenticated, isLoading, userEmail, logout, isPlatformAdmin } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCallsCount, setPendingCallsCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    const fetchCount = () => {
      getActiveServiceRequestsCount().then(count => {
        if (isMounted) setPendingCallsCount(count);
      });
    };

    fetchCount();
    const interval = setInterval(fetchCount, 8000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-terracotta-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-coffee-700">Yetkiler kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/admin/login');
    return null;
  }

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-coffee-950 text-white border-b border-coffee-900 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-terracotta-600 flex items-center justify-center text-white">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-cream-50">
                {APP_CONFIG.brandName}
              </span>
            </Link>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-coffee-800 text-coffee-300">
              Panel
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <span className="text-xs text-coffee-300 hidden md:inline truncate max-w-xs">
              {userEmail}
            </span>

            {/* Masa Çağrıları Hızlı Zil Butonu */}
            <Link
              to="/admin/calls"
              className={`relative p-2 rounded-xl border transition-colors flex items-center gap-1.5 ${
                location.pathname.startsWith('/admin/calls')
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-coffee-900 text-coffee-300 hover:text-white border-coffee-800'
              }`}
              title="Masa Çağrıları (Garson & Hesap)"
            >
              <Bell className="w-4 h-4" />
              {pendingCallsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white font-black text-[10px] flex items-center justify-center animate-bounce shadow-sm">
                  {pendingCallsCount}
                </span>
              )}
            </Link>

            <Link
              to="/"
              target="_blank"
              className="text-xs text-coffee-300 hover:text-white flex items-center gap-1 transition-colors"
              title="Siteyi Gör"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Siteyi Gör</span>
            </Link>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-coffee-800 hover:bg-coffee-700 text-coffee-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body with Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-coffee-200 pb-3 overflow-x-auto scrollbar-none">
          <Link
            to="/admin/dashboard"
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
              isCurrent('/admin/dashboard')
                ? 'bg-coffee-900 text-white shadow-warm-sm'
                : 'bg-white text-coffee-700 hover:bg-cream-100 border border-coffee-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Genel Bakış
          </Link>

          <Link
            to="/admin/calls"
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
              location.pathname.startsWith('/admin/calls')
                ? 'bg-coffee-900 text-white shadow-warm-sm'
                : 'bg-white text-coffee-700 hover:bg-cream-100 border border-coffee-200'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-500" />
            <span>Masa Çağrıları</span>
            {pendingCallsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black animate-pulse">
                {pendingCallsCount}
              </span>
            )}
          </Link>

          {isPlatformAdmin && (
            <Link
              to="/admin/leads"
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                location.pathname.startsWith('/admin/leads')
                  ? 'bg-coffee-900 text-white shadow-warm-sm'
                  : 'bg-white text-coffee-700 hover:bg-cream-100 border border-coffee-200'
              }`}
            >
              <Inbox className="w-4 h-4" />
              Başvurular
            </Link>
          )}

          <Link
            to="/admin/cafes"
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
              location.pathname.startsWith('/admin/cafes')
                ? 'bg-coffee-900 text-white shadow-warm-sm'
                : 'bg-white text-coffee-700 hover:bg-cream-100 border border-coffee-200'
            }`}
          >
            <Store className="w-4 h-4" />
            Kafeler & Masalar
          </Link>

          {isPlatformAdmin && (
            <Link
              to="/admin/questions"
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap ${
                isCurrent('/admin/questions')
                  ? 'bg-coffee-900 text-white shadow-warm-sm'
                  : 'bg-white text-coffee-700 hover:bg-cream-100 border border-coffee-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Soru Havuzu
            </Link>
          )}
        </div>

        {/* Page Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif font-black text-2xl sm:text-3xl text-coffee-950">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs sm:text-sm text-coffee-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};
