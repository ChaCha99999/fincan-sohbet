import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  QrCode, 
  Play, 
  Layers, 
  Database, 
  RefreshCw,
  Bell,
  ArrowRight
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { getDashboardStats } from '../lib/api';
import type { DashboardStats } from '../lib/api';

export const AdminDashboardPage: React.FC = () => {
  const { isPlatformAdmin } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const loadStats = () => {
    setLoading(true);
    getDashboardStats().then((res) => {
      setStats(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getGameLabel = (slug?: string | null) => {
    switch (slug) {
      case 'sohbeti-baslat':
        return 'Sohbeti Başlat';
      case 'ikilemde-kal':
        return 'İkilemde Kal';
      case 'kim-daha-muhtemel':
        return 'Kim Daha Muhtemel?';
      case 'ne-kadar-taniyoruz':
        return 'Birbirimizi Ne Kadar Tanıyoruz?';
      default:
        return 'Genel';
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'table_open':
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">QR / Masa Açılışı</span>;
      case 'game_start':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">Oyun Başladı</span>;
      case 'game_complete':
        return <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold">Oyun Bitti</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md bg-coffee-100 text-coffee-800 text-[10px] font-bold">{type}</span>;
    }
  };

  return (
    <AdminLayout
      title={isPlatformAdmin ? 'Platform Özeti' : 'Kafe Özeti'}
      subtitle={
        isPlatformAdmin
          ? 'Kayıtlı işletmeler, masalar ve masa başı etkileşim verileri'
          : 'Kafenizin masaları ve masa başı etkileşim verileri'
      }
    >
      {/* Real vs Demo Data Notice Banner */}
      {stats && (
        <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
          stats.isRealData 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2.5">
            <Database className="w-4 h-4 shrink-0" />
            <span>
              <strong>Veri Kaynağı: </strong>
              {stats.isRealData
                ? 'Canlı Supabase PostgreSQL veri tabanından anlık olarak çekildi.'
                : 'Ön İzleme (Demo) Modu: Supabase bağlantısı henüz tanımlanmadığından yerel test verileri gösterilmektedir.'}
            </span>
          </div>
          <button
            onClick={loadStats}
            className="p-1.5 rounded-lg hover:bg-black/5 text-coffee-700 transition-colors shrink-0"
            title="Yenile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      )}

      {loading || !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-white rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* 5 Core Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Masa Çağrıları (Garson & Hesap) */}
            <Link
              to="/admin/calls"
              className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 hover:border-amber-500 shadow-warm-sm space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between text-amber-800">
                <span className="text-xs font-bold uppercase tracking-wider">Masa Çağrıları</span>
                <Bell className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-black text-3xl text-coffee-950">
                  {stats.pendingServiceRequestsCount || 0}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                  (stats.pendingServiceRequestsCount || 0) > 0
                    ? 'bg-amber-500 text-white animate-pulse'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {(stats.pendingServiceRequestsCount || 0) > 0 ? 'Bekliyor' : 'Aktif Yok'}
                </span>
              </div>
              <p className="text-[11px] text-amber-900 font-semibold flex items-center justify-between pt-0.5">
                <span>Garson & Hesap</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-1 transition-transform" />
              </p>
            </Link>

            {/* 2. Cafes */}
            <div className="p-5 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm space-y-2">
              <div className="flex items-center justify-between text-coffee-500">
                <span className="text-xs font-bold uppercase tracking-wider">Kayıtlı Kafe</span>
                <Store className="w-4 h-4 text-terracotta-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-black text-3xl text-coffee-950">
                  {stats.totalCafes}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {stats.activeCafes} Aktif
                </span>
              </div>
              <p className="text-[11px] text-coffee-500">
                {stats.passiveCafes} pasif işletme
              </p>
            </div>

            {/* 3. Tables */}
            <div className="p-5 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm space-y-2">
              <div className="flex items-center justify-between text-coffee-500">
                <span className="text-xs font-bold uppercase tracking-wider">Tanımlı Masa</span>
                <Layers className="w-4 h-4 text-caramel-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-black text-3xl text-coffee-950">
                  {stats.totalTables}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                  {stats.activeTables} Aktif
                </span>
              </div>
              <p className="text-[11px] text-coffee-500">
                Tüm kafeler toplamı
              </p>
            </div>

            {/* 4. Table Opens */}
            <div className="p-5 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm space-y-2">
              <div className="flex items-center justify-between text-coffee-500">
                <span className="text-xs font-bold uppercase tracking-wider">QR Okutma</span>
                <QrCode className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-black text-3xl text-coffee-950">
                  {stats.totalTableOpens}
                </span>
                <span className="text-[11px] text-coffee-500 font-medium">
                  table_open
                </span>
              </div>
              <p className="text-[11px] text-coffee-500">
                Müşteri masa açılış sayısı
              </p>
            </div>

            {/* 5. Game Starts */}
            <div className="p-5 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm space-y-2">
              <div className="flex items-center justify-between text-coffee-500">
                <span className="text-xs font-bold uppercase tracking-wider">Oyun Başlatma</span>
                <Play className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="font-serif font-black text-3xl text-coffee-950">
                  {stats.totalGameStarts}
                </span>
                <span className="text-[11px] text-coffee-500 font-medium">
                  game_start
                </span>
              </div>
              <p className="text-[11px] text-coffee-500">
                Masalarda oynanan turlar
              </p>
            </div>
          </div>

          {/* Category Usage Distribution */}
          <div className="p-6 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-coffee-950">
              Oyun Türlerine Göre Kullanım
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(stats.categoryDistribution).map(([catSlug, count]) => (
                <div key={catSlug} className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-1">
                  <span className="text-xs font-bold text-coffee-900 block truncate">
                    {getGameLabel(catSlug)}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-black text-xl text-coffee-950">{count}</span>
                    <span className="text-[10px] text-coffee-500 font-medium">başlatma</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Usage Event Stream */}
          <div className="p-6 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-coffee-950">
                Son Masa ve Oyun Olayları
              </h3>
              <span className="text-xs text-coffee-500 font-medium">
                Son {stats.recentEvents.length} kayıt
              </span>
            </div>

            {stats.recentEvents.length === 0 ? (
              <div className="text-center py-8 text-coffee-500 text-xs">
                Henüz kaydedilmiş bir kullanım olayı bulunmuyor.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-cream-50 text-coffee-700 uppercase font-semibold text-[10px] border-b border-coffee-200">
                    <tr>
                      <th className="py-2.5 px-3">Olay Türü</th>
                      <th className="py-2.5 px-3">Kafe / Masa</th>
                      <th className="py-2.5 px-3">Oyun</th>
                      <th className="py-2.5 px-3">Zaman</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-coffee-100">
                    {stats.recentEvents.map((evt) => (
                      <tr key={evt.id} className="hover:bg-cream-50/60 transition-colors">
                        <td className="py-3 px-3">
                          {getEventBadge(evt.event_type)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-coffee-900 block">{evt.cafe_name}</span>
                          <span className="text-coffee-500 text-[11px]">{evt.table_label}</span>
                        </td>
                        <td className="py-3 px-3 text-coffee-700">
                          {evt.game_type ? getGameLabel(evt.game_type) : '-'}
                        </td>
                        <td className="py-3 px-3 text-coffee-500 whitespace-nowrap">
                          {new Date(evt.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
