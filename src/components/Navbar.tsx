import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Coffee, Menu, X, Sparkles, Shield, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../lib/config';

interface NavbarProps {
  onOpenLeadModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLeadModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isCurrent = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur-md border-b border-coffee-900/10 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-terracotta-600 border-2 border-coffee-950 flex items-center justify-center text-cream-50 shadow-print-sm transition-transform group-hover:-translate-y-0.5">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-coffee-950 leading-none">
              {APP_CONFIG.brandName}
            </span>
            <span className="text-[10px] sm:text-xs text-coffee-600 font-medium tracking-wider uppercase mt-1 hidden sm:inline-block">
              Masa Portalı & Sohbet
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-coffee-800">
          <Link
            to="/"
            className={`transition-colors hover:text-terracotta-600 ${isCurrent('/') ? 'text-terracotta-600 font-semibold' : ''}`}
          >
            Ana Sayfa
          </Link>
          <a
            href="/#nasil-calisir"
            className="transition-colors hover:text-terracotta-600"
          >
            Nasıl Çalışır?
          </a>
          <Link
            to="/games"
            className={`transition-colors hover:text-terracotta-600 ${isCurrent('/games') ? 'text-terracotta-600 font-semibold' : ''}`}
          >
            Oyunlar & Sorular
          </Link>
          <a
            href="/#kafeler-icin"
            className="transition-colors hover:text-terracotta-600"
          >
            Kafeler İçin
          </a>
          <a
            href="/#fiyat"
            className="transition-colors hover:text-terracotta-600"
          >
            Fiyatlandırma
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            to="/t/demo-masa-1"
            className="btn-secondary !py-2 !px-4 !text-xs !font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            Örnek Masayı Gör
          </Link>

          {onOpenLeadModal && (
            <button
              onClick={onOpenLeadModal}
              className="btn-primary !py-2 !px-4 !text-xs !font-bold"
            >
              Kafen İçin Başvur
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <Link
            to="/admin/login"
            className="p-2 rounded-xl text-coffee-500 hover:text-coffee-900 hover:bg-coffee-100 transition-colors"
            title="Yönetici Girişi"
          >
            <Shield className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-coffee-900 hover:bg-cream-200 md:hidden focus:outline-none"
          aria-label="Menüyü aç/kapat"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-coffee-900/10 bg-cream-50 px-5 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-base font-medium text-coffee-900 border-b border-coffee-100"
          >
            Ana Sayfa
          </Link>
          <a
            href="/#nasil-calisir"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-base font-medium text-coffee-900 border-b border-coffee-100"
          >
            Nasıl Çalışır?
          </a>
          <Link
            to="/games"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-base font-medium text-coffee-900 border-b border-coffee-100"
          >
            Oyunlar & Sorular
          </Link>
          <a
            href="/#kafeler-icin"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-base font-medium text-coffee-900 border-b border-coffee-100"
          >
            Kafeler İçin
          </a>
          <a
            href="/#fiyat"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2.5 text-base font-medium text-coffee-900 border-b border-coffee-100"
          >
            Fiyatlandırma
          </a>
          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              to="/t/demo-masa-1"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full btn-secondary !py-3 !text-sm text-center justify-center"
            >
              <Sparkles className="w-4 h-4 text-terracotta-600" />
              Örnek Masayı Dene (Masa 01)
            </Link>
            {onOpenLeadModal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLeadModal();
                }}
                className="w-full btn-primary !py-3 !text-sm text-center justify-center"
              >
                Kafen İçin Başvur
              </button>
            )}
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-coffee-500 hover:text-coffee-900"
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
