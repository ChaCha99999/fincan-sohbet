import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Info } from 'lucide-react';
import { isDemoMode } from '../lib/supabase';

export const DemoBanner: React.FC = () => {
  if (!isDemoMode) {
    return null;
  }

  return (
    <aside aria-label="Demo Modu Bildirimi" className="bg-caramel-50 border-b border-caramel-200 text-coffee-900 text-xs py-2 px-4 no-print">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-caramel-600 shrink-0" />
          <span>
            <strong>Ön İzleme Modu:</strong> Supabase bağlantısı henüz yapılandırılmadı. Tüm arayüz ve 4 oyun yerel demo verileriyle tam fonksiyonel çalışmaktadır.
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/t/demo-masa-1"
            className="inline-flex items-center gap-1 font-semibold text-terracotta-700 hover:text-terracotta-800 underline"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Örnek Masa 01'i Aç
          </Link>
          <span className="text-coffee-300 hidden sm:inline">|</span>
          <Link
            to="/admin/login"
            className="font-medium text-coffee-700 hover:text-coffee-900 underline"
          >
            Demo Admin Paneli
          </Link>
        </div>
      </div>
    </aside>
  );
};
