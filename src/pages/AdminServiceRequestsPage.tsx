import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Bell, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Store, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  CreditCard, 
  Banknote, 
  Ticket, 
  Check,
  Play
} from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { 
  getServiceRequests, 
  updateServiceRequestStatus, 
  getCafes 
} from '../lib/api';
import { playCallChime } from '../lib/sound';
import type { 
  ServiceRequest, 
  ServiceRequestStatus, 
  ServiceRequestType, 
  Cafe 
} from '../types';

const formatTimeAgo = (dateStr: string) => {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'Az önce';
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  return `${hours} saat önce`;
};

export const AdminServiceRequestsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const cafeParam = searchParams.get('cafe') || 'all';

  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCafe, setSelectedCafe] = useState<string>(cafeParam);
  const [statusFilter, setStatusFilter] = useState<ServiceRequestStatus | 'all'>('pending');
  const [typeFilter, setTypeFilter] = useState<ServiceRequestType | 'all'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('fincan_admin_sound') !== 'false';
  });

  const prevPendingCountRef = useRef<number | null>(null);

  const loadData = useCallback(async (isPolling = false) => {
    if (!isPolling) setLoading(true);

    try {
      const [allCafes, allRequests] = await Promise.all([
        getCafes(),
        getServiceRequests({
          cafe_id: selectedCafe === 'all' ? undefined : selectedCafe,
          status: 'all',
        }),
      ]);

      setCafes(allCafes);
      setRequests(allRequests);

      // Yeni bekleyen çağrı geldiyse ses çal
      const currentPendingCount = allRequests.filter(r => r.status === 'pending').length;
      if (
        prevPendingCountRef.current !== null && 
        currentPendingCount > prevPendingCountRef.current &&
        soundEnabled
      ) {
        playCallChime();
      }
      prevPendingCountRef.current = currentPendingCount;
    } catch (err) {
      console.error('Error loading service requests:', err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [selectedCafe, soundEnabled]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Periyodik Polling (Her 6 saniyede bir otomatik yenileme)
  useEffect(() => {
    const interval = setInterval(() => {
      loadData(true);
    }, 6000);

    return () => clearInterval(interval);
  }, [loadData]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('fincan_admin_sound', String(next));
    if (next) {
      playCallChime();
    }
  };

  const handleStatusChange = async (requestId: string, newStatus: ServiceRequestStatus) => {
    try {
      await updateServiceRequestStatus(requestId, newStatus);
      // Hızlı arayüz güncellemesi
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
    } catch (err: any) {
      alert('Durum güncellenirken hata oluştu: ' + err?.message);
    }
  };

  const handleCafeFilterChange = (cafeId: string) => {
    setSelectedCafe(cafeId);
    if (cafeId === 'all') {
      searchParams.delete('cafe');
    } else {
      searchParams.set('cafe', cafeId);
    }
    setSearchParams(searchParams);
  };

  // Filtrelenmiş istekler
  const filteredRequests = requests.filter(req => {
    if (selectedCafe !== 'all' && req.cafe_id !== selectedCafe) return false;
    if (statusFilter !== 'all' && req.status !== statusFilter) return false;
    if (typeFilter !== 'all' && req.request_type !== typeFilter) return false;
    return true;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  return (
    <AdminLayout
      title="Masa Çağrıları & Servis İstekleri"
      subtitle="Garson çağırma ve hesap isteme bildirimlerini anlık olarak takip edin"
    >
      <div className="space-y-5">
        {/* Üst Bar: Sayaçlar & Ayarlar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
          {/* 1. Bekleyen Çağrılar */}
          <div 
            onClick={() => setStatusFilter('pending')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer ${
              statusFilter === 'pending'
                ? 'bg-amber-500 text-white border-amber-600 shadow-warm'
                : 'bg-white border-coffee-200 text-coffee-950 hover:bg-cream-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-90">
              <span>Bekleyen Çağrılar</span>
              <Bell className={`w-4 h-4 ${statusFilter === 'pending' ? 'text-white' : 'text-amber-600'}`} />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif font-black text-3xl">
                {pendingCount}
              </span>
              {pendingCount > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse ${
                  statusFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-900'
                }`}>
                  Müdahale Bekliyor
                </span>
              )}
            </div>
          </div>

          {/* 2. İşlemdekiler (Yolda) */}
          <div 
            onClick={() => setStatusFilter('in_progress')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer ${
              statusFilter === 'in_progress'
                ? 'bg-blue-600 text-white border-blue-700 shadow-warm'
                : 'bg-white border-coffee-200 text-coffee-950 hover:bg-cream-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-90">
              <span>İşlemde / Yolda</span>
              <Clock className={`w-4 h-4 ${statusFilter === 'in_progress' ? 'text-white' : 'text-blue-600'}`} />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif font-black text-3xl">
                {inProgressCount}
              </span>
              <span className="text-[10px] opacity-80 font-medium">Garson masada</span>
            </div>
          </div>

          {/* 3. Tamamlananlar */}
          <div 
            onClick={() => setStatusFilter('completed')}
            className={`p-4 rounded-3xl border transition-all cursor-pointer ${
              statusFilter === 'completed'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-warm'
                : 'bg-white border-coffee-200 text-coffee-950 hover:bg-cream-50'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider opacity-90">
              <span>Tamamlananlar</span>
              <CheckCircle2 className={`w-4 h-4 ${statusFilter === 'completed' ? 'text-white' : 'text-emerald-600'}`} />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="font-serif font-black text-3xl">
                {completedCount}
              </span>
              <span className="text-[10px] opacity-80 font-medium">Sonlanan çağrı</span>
            </div>
          </div>

          {/* 4. Canlı Ses & Yenileme Kontrolü */}
          <div className="p-4 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between text-xs text-coffee-600">
              <span className="font-bold">Bildirim Sesi</span>
              <button
                onClick={toggleSound}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                  soundEnabled
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-600" /> : <VolumeX className="w-3.5 h-3.5 text-gray-500" />}
                <span>{soundEnabled ? 'Açık' : 'Kapalı'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-coffee-100">
              <button
                onClick={() => playCallChime()}
                className="text-[11px] font-semibold text-terracotta-700 hover:text-terracotta-800 flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                <span>Zili Test Et</span>
              </button>

              <button
                onClick={() => loadData()}
                className="p-1.5 rounded-lg text-coffee-600 hover:text-coffee-950 hover:bg-cream-100 transition-colors flex items-center gap-1 text-xs"
                title="Şimdi Yenile"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-[11px] font-semibold">Yenile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtreleme ve Kafe Seçici Barı */}
        <div className="p-4 rounded-3xl bg-white border border-coffee-200 shadow-warm-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Kafe Seçici */}
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-coffee-600 shrink-0" />
            <span className="text-xs font-bold text-coffee-800 shrink-0">İşletme:</span>
            <select
              value={selectedCafe}
              onChange={(e) => handleCafeFilterChange(e.target.value)}
              className="py-1.5 px-3 rounded-xl border border-coffee-200 bg-cream-50 text-xs font-semibold text-coffee-950 focus:outline-none focus:ring-2 focus:ring-terracotta-500/40"
            >
              <option value="all">Tüm Kafeler ({cafes.length})</option>
              {cafes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.waiter_call_enabled === false ? '(Özellik Kapalı)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Tür & Durum Butonları */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Tür Filtresi */}
            <div className="flex items-center bg-cream-100 p-0.5 rounded-xl border border-coffee-200 text-xs font-bold">
              <button
                onClick={() => setTypeFilter('all')}
                className={`py-1 px-2.5 rounded-lg transition-colors ${
                  typeFilter === 'all' ? 'bg-white text-coffee-950 shadow-xs' : 'text-coffee-600 hover:text-coffee-950'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setTypeFilter('waiter')}
                className={`py-1 px-2.5 rounded-lg flex items-center gap-1 transition-colors ${
                  typeFilter === 'waiter' ? 'bg-white text-amber-900 shadow-xs' : 'text-coffee-600 hover:text-coffee-950'
                }`}
              >
                <Bell className="w-3 h-3 text-amber-600" />
                <span>Garson</span>
              </button>
              <button
                onClick={() => setTypeFilter('bill')}
                className={`py-1 px-2.5 rounded-lg flex items-center gap-1 transition-colors ${
                  typeFilter === 'bill' ? 'bg-white text-emerald-900 shadow-xs' : 'text-coffee-600 hover:text-coffee-950'
                }`}
              >
                <Receipt className="w-3 h-3 text-emerald-600" />
                <span>Hesap</span>
              </button>
            </div>

            {/* Durum Tümü Butonu */}
            <button
              onClick={() => setStatusFilter(statusFilter === 'all' ? 'pending' : 'all')}
              className={`py-1.5 px-3 rounded-xl border text-xs font-bold transition-colors ${
                statusFilter === 'all'
                  ? 'bg-coffee-900 text-white border-coffee-900'
                  : 'bg-white text-coffee-700 border-coffee-200 hover:bg-cream-100'
              }`}
            >
              {statusFilter === 'all' ? 'Tüm Durumlar' : 'Geçmişi de Göster'}
            </button>
          </div>
        </div>

        {/* Çağrı Kartları Listesi */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-44 bg-white rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-coffee-200 shadow-warm-sm">
            <div className="w-14 h-14 rounded-2xl bg-cream-100 text-coffee-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-coffee-950">
              Bekleyen Çağrı Yok
            </h3>
            <p className="text-xs text-coffee-600 max-w-sm mx-auto">
              {statusFilter === 'pending'
                ? 'Şu anda masalardan gelen yeni bir garson veya hesap isteği bulunmuyor. Yeni çağrı geldiğinde zil sesiyle uyarılacaksınız.'
                : 'Seçili filtrelere uygun çağrı kaydı bulunamadı.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map((req) => {
              const isWaiter = req.request_type === 'waiter';
              const isPending = req.status === 'pending';
              const isInProgress = req.status === 'in_progress';
              const isCompleted = req.status === 'completed';

              return (
                <div
                  key={req.id}
                  className={`bg-white rounded-3xl p-5 border shadow-warm-sm flex flex-col justify-between gap-4 transition-all ${
                    isPending
                      ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-warm'
                      : isInProgress
                      ? 'border-blue-300 ring-1 ring-blue-300/40'
                      : 'border-coffee-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Üst Satır: Masa Adı & Durum Rozeti */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-black text-lg text-coffee-950">
                            {req.table_label || 'Masa'}
                          </span>
                        </div>
                        <p className="text-[11px] text-coffee-500 font-medium flex items-center gap-1 mt-0.5">
                          <Store className="w-3 h-3 text-coffee-400" />
                          <span>{req.cafe_name || 'Kafe'}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase tracking-wider animate-pulse">
                            Bekliyor
                          </span>
                        )}
                        {isInProgress && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300 text-[10px] font-bold uppercase tracking-wider">
                            Yolda / İlgileniliyor
                          </span>
                        )}
                        {isCompleted && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                            Tamamlandı
                          </span>
                        )}
                        {req.status === 'cancelled' && (
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                            İptal Edildi
                          </span>
                        )}
                      </div>
                    </div>

                    {/* İstek Türü Banner */}
                    <div className={`p-3 rounded-2xl flex items-center gap-3 ${
                      isWaiter ? 'bg-amber-50 text-amber-950 border border-amber-200/60' : 'bg-emerald-50 text-emerald-950 border border-emerald-200/60'
                    }`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isWaiter ? 'bg-amber-200 text-amber-900' : 'bg-emerald-200 text-emerald-900'
                      }`}>
                        {isWaiter ? <Bell className="w-4 h-4" /> : <Receipt className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="block font-black text-xs leading-tight">
                          {isWaiter ? 'Garson Çağrısı' : 'Hesap İsteme'}
                        </span>
                        {req.payment_method && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 mt-0.5">
                            {req.payment_method === 'card' && <CreditCard className="w-3 h-3" />}
                            {req.payment_method === 'cash' && <Banknote className="w-3 h-3" />}
                            {req.payment_method === 'meal_card' && <Ticket className="w-3 h-3" />}
                            <span>
                              {req.payment_method === 'card' && 'Kredi / Banka Kartı (POS)'}
                              {req.payment_method === 'cash' && 'Nakit Ödeme'}
                              {req.payment_method === 'meal_card' && 'Yemek Kartı'}
                              {req.payment_method === 'other' && 'Diğer'}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Müşteri Notu */}
                    {req.note && (
                      <div className="p-3 rounded-2xl bg-cream-50 border border-coffee-200 text-xs text-coffee-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500 block mb-0.5">
                          Müşteri Notu:
                        </span>
                        <p className="font-medium italic text-coffee-900">
                          "{req.note}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-coffee-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(req.created_at)}
                      </span>
                      <span className="font-mono text-[10px]">
                        {new Date(req.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Aksiyon Butonları */}
                  <div className="pt-3 border-t border-coffee-100 flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleStatusChange(req.id, 'in_progress')}
                          className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Yoldayım</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(req.id, 'completed')}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Tamamla</span>
                        </button>
                      </>
                    )}

                    {isInProgress && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'completed')}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Tamamlandı Olarak Kapat</span>
                      </button>
                    )}

                    {(isCompleted || req.status === 'cancelled') && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'pending')}
                        className="py-1.5 px-3 rounded-xl border border-coffee-200 text-coffee-700 hover:bg-cream-100 font-semibold text-xs transition-colors"
                      >
                        Tekrar Aç
                      </button>
                    )}

                    {!isCompleted && req.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusChange(req.id, 'cancelled')}
                        className="py-2 px-2.5 rounded-xl border border-coffee-200 text-coffee-600 hover:text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors"
                        title="İptal Et"
                      >
                        İptal
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
