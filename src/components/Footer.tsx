import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Shield, Mail, Phone, Heart } from 'lucide-react';
import { APP_CONFIG } from '../lib/config';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer: React.FC = () => {
  return (
    <footer className="bg-coffee-950 text-coffee-200 pt-16 pb-12 border-t-2 border-coffee-900 mt-auto no-print">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-coffee-900">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-terracotta-600 border border-coffee-800 flex items-center justify-center text-cream-50 shadow-print-sm">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-2xl text-cream-50 tracking-tight">
                {APP_CONFIG.brandName}
              </span>
            </div>
            <p className="text-coffee-300 text-sm max-w-sm leading-relaxed">
              Kafeler için QR ve NFC tabanlı masa deneyimi: 7 mini buz kırıcı oyun, dijital menü, hızlı Wi-Fi ve anlık garson çağırma.
            </p>
            <div className="p-4 rounded-2xl bg-coffee-900/60 border border-coffee-800 text-xs text-caramel-300 font-serif italic">
              "{APP_CONFIG.slogan}"
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="eyebrow text-coffee-400">
              Hızlı Bağlantılar
            </h4>
            <ul className="space-y-2 text-sm text-coffee-300">
              <li>
                <Link to="/" className="hover:text-cream-50 transition-colors">
                  Tanıtım Sayfası
                </Link>
              </li>
              <li>
                <Link to="/games" className="hover:text-cream-50 transition-colors">
                  Mini Oyunlar & Sorular
                </Link>
              </li>
              <li>
                <Link to="/t/demo-masa-1" className="hover:text-cream-50 transition-colors">
                  Örnek Masa Deneyimi
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-cream-50 transition-colors">
                  Gizlilik & Güvenlik
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-cream-50 transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-terracotta-400" />
                  Yönetici Girişi
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="space-y-3">
            <h4 className="eyebrow text-coffee-400">
              İletişim & Başvuru
            </h4>
            <div className="space-y-2.5 text-sm text-coffee-300">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-terracotta-400 shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed break-all">
                  {APP_CONFIG.contactEmail}
                </span>
              </div>
              {APP_CONFIG.contactPhone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-terracotta-400 shrink-0" />
                  <span className="text-xs">{APP_CONFIG.contactPhone}</span>
                </div>
              )}
              <p className="text-[11px] text-coffee-500 pt-2 leading-relaxed">
                Kafeniz için kurulum ve özel kart taleplerinde bize dilediğiniz zaman ulaşabilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-400">
          <p>© {CURRENT_YEAR} {APP_CONFIG.brandName}. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-1.5 text-coffee-400">
            <span>Kahve ve sohbet aşkıyla tasarlandı</span>
            <Heart className="w-3.5 h-3.5 text-terracotta-400 fill-terracotta-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
