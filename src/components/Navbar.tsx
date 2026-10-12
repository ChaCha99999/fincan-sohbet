import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, Menu, X, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../lib/config';

interface NavbarProps {
  onOpenLeadModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLeadModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isCurrent = (path: string) => location.pathname === path;

  const handleHomeClick = (e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScrollTo = (e: React.MouseEvent, sectionId: string) => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${sectionId}`);
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-coffee-900/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo (Scrolls to top if on home) */}
        <Link 
          to="/" 
          onClick={handleHomeClick}
          className="flex items-center gap-3 shrink-0 group cursor-pointer"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-terracotta-600 border-2 border-coffee-950 flex items-center justify-center text-cream-50 shadow-print-sm transition-transform group-hover:-translate-y-0.5 shrink-0">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif font-black text-xl sm:text-2xl tracking-tight text-coffee-950 leading-none">
              {APP_CONFIG.brandName}
            </span>
            <span className="text-[10px] text-coffee-600 font-bold tracking-wider uppercase mt-1 hidden sm:inline-block whitespace-nowrap">
              Masa Portalı & Sohbet
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-coffee-800 shrink-0">
          <Link
            to="/"
            onClick={handleHomeClick}
            className={`whitespace-nowrap transition-colors hover:text-terracotta-600 cursor-pointer ${
              isCurrent('/') && !location.hash ? 'text-terracotta-600 font-bold' : ''
            }`}
          >
            Ana Sayfa
          </Link>
          <a
            href="/#nasil-calisir"
            onClick={(e) => handleScrollTo(e, 'nasil-calisir')}
            className="whitespace-nowrap transition-colors hover:text-terracotta-600 cursor-pointer"
          >
            Nasıl Çalışır?
          </a>
          <Link
            to="/games"
            className={`whitespace-nowrap transition-colors hover:text-terracotta-600 ${
              isCurrent('/games') ? 'text-terracotta-600 font-bold' : ''
            }`}
          >
            Oyunlar & Sorular
          </Link>
          <a
            href="/#kafeler-icin"
            onClick={(e) => handleScrollTo(e, 'kafeler-icin')}
            className="whitespace-nowrap transition-colors hover:text-terracotta-600 cursor-pointer"
          >
            Kafeler İçin
          </a>
          <a
            href="/#fiyat"
            onClick={(e) => handleScrollTo(e, 'fiyat')}
            className="whitespace-nowrap transition-colors hover:text-terracotta-600 cursor-pointer"
          >
            Fiyatlandırma
          </a>
        </nav>

        {/* Action Buttons & Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            to="/t/demo-masa-1"
            className="hidden sm:inline-flex btn-secondary !py-2 !px-3.5 !text-xs !font-bold whitespace-nowrap items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600 shrink-0" />
            Örnek Masa
          </Link>

          {onOpenLeadModal && (
            <button
              onClick={onOpenLeadModal}
              className="btn-primary !py-2 !px-3.5 sm:!px-4 !text-xs !font-bold whitespace-nowrap flex items-center gap-1.5"
            >
              <span>Kafen İçin Başvur</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
            </button>
          )}

          <Link
            to="/admin/login"
            className="p-2 rounded-xl text-coffee-500 hover:text-coffee-900 hover:bg-cream-200/70 transition-colors hidden sm:inline-flex"
            title="Yönetici Girişi"
          >
            <Shield className="w-4 h-4" />
          </Link>

          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl text-coffee-950 hover:bg-cream-200/80 lg:hidden border border-coffee-950/15 focus:outline-none"
            aria-label="Menüyü aç/kapat"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b-2 border-coffee-950/20 bg-cream-50 px-5 pt-3 pb-6 space-y-3 animate-fadeIn">
          <Link
            to="/"
            onClick={handleHomeClick}
            className="block py-2.5 text-base font-bold text-coffee-900 border-b border-coffee-200/60"
          >
            Ana Sayfa
          </Link>
          <a
            href="/#nasil-calisir"
            onClick={(e) => handleScrollTo(e, 'nasil-calisir')}
            className="block py-2.5 text-base font-bold text-coffee-900 border-b border-coffee-200/60"
          >
            Nasıl Çalışır?
          </a>
          <Link
            to="/games"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-base font-bold text-coffee-900 border-b border-coffee-200/60"
          >
            Oyunlar & Sorular
          </Link>
          <a
            href="/#kafeler-icin"
            onClick={(e) => handleScrollTo(e, 'kafeler-icin')}
            className="block py-2.5 text-base font-bold text-coffee-900 border-b border-coffee-200/60"
          >
            Kafeler İçin
          </a>
          <a
            href="/#fiyat"
            onClick={(e) => handleScrollTo(e, 'fiyat')}
            className="block py-2.5 text-base font-bold text-coffee-900 border-b border-coffee-200/60"
          >
            Fiyatlandırma
          </a>
          
          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              to="/t/demo-masa-1"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full btn-secondary !py-3 !text-sm text-center justify-center flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-terracotta-600" />
              Örnek Masayı Dene (Masa 01)
            </Link>
            
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-coffee-600 hover:text-coffee-950"
            >
              <Shield className="w-3.5 h-3.5" />
              Yönetici Paneli Girişi
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
