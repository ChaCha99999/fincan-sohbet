import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Coffee, 
  MessageCircle, 
  Split, 
  Users, 
  HeartHandshake, 
  Sparkles, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Share2, 
  Check,
  BookOpen,
  Wifi,
  Copy,
  ChevronRight,
  Trophy,
  Swords,
  BarChart3,
  Bell,
  Receipt
} from 'lucide-react';
import { 
  validateTableToken, 
  logUsageEvent, 
  getCategories,
  getActiveTableServiceRequest,
  cancelServiceRequest
} from '../lib/api';
import type { Table, Category, GameType, ServiceRequest, ServiceRequestType } from '../types';
import { useTableSession } from '../hooks/useTableSession';
import { CafeMenuView } from '../components/CafeMenuView';
import { useTranslation } from '../lib/i18n';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { ServiceCallModal } from '../components/ServiceCallModal';

type ActiveViewMode = 'portal' | 'menu' | 'games';

export const TableLandingPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setActiveTable } = useTableSession();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedWifi, setCopiedWifi] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveViewMode>('portal');

  // Garson & Hesap Çağrısı State'leri
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callModalMode, setCallModalMode] = useState<ServiceRequestType>('waiter');
  const [activeCall, setActiveCall] = useState<ServiceRequest | null>(null);
  const [callFeedback, setCallFeedback] = useState<string | null>(null);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${table?.cafe?.name || 'Fincan Sohbet'} - ${table?.label || 'Masa'}`,
        text: 'Masadayız! Gel sen de menüyü incele, sohbete ve mini oyunlara katıl:',
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyWifi = () => {
    if (table?.cafe?.wifi_password) {
      navigator.clipboard.writeText(table.cafe.wifi_password);
      setCopiedWifi(true);
      setTimeout(() => setCopiedWifi(false), 2000);
    }
  };

  const handleOpenCallModal = (mode: ServiceRequestType) => {
    setCallModalMode(mode);
    setCallModalOpen(true);
  };

  const handleCallSuccess = (req: ServiceRequest) => {
    setActiveCall(req);
    const msg = req.request_type === 'waiter' 
      ? 'Garson çağrınız personele iletildi.' 
      : 'Hesap isteğiniz kasaya ve servis personeline iletildi.';
    setCallFeedback(msg);
    setTimeout(() => setCallFeedback(null), 5000);
  };

  const handleCancelCall = async () => {
    if (activeCall && token) {
      try {
        await cancelServiceRequest(token, activeCall.id);
        setActiveCall(null);
        setCallFeedback('Çağrınız iptal edildi.');
        setTimeout(() => setCallFeedback(null), 3000);
      } catch (e) {
        console.error('Cancel call error:', e);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!token) {
        if (isMounted) {
          setErrorMessage('Masa bağlantı kodu eksik.');
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setErrorMessage(null);

      try {
        const [validation, cats] = await Promise.all([
          validateTableToken(token),
          getCategories(),
        ]);

        if (!isMounted) return;

        setCategories(cats);

        if (!validation.isValid) {
          setErrorMessage(validation.errorMessage || 'Bu masa şu anda kullanılamıyor.');
          setTable(validation.table || null);
          setActiveTable(null);
        } else if (validation.table) {
          setTable(validation.table);
          setActiveTable(validation.table);

          // Masa açılış olayını logla
          logUsageEvent(token, 'table_open', null);

          // Masaya ait aktif garson veya hesap çağrısı var mı kontrol et
          if (validation.table.cafe?.waiter_call_enabled !== false) {
            getActiveTableServiceRequest(token).then((existingReq) => {
              if (existingReq && isMounted) {
                setActiveCall(existingReq);
              }
            });
          }
        }
      } catch (err: any) {
        console.error('Table init error:', err);
        if (isMounted) {
          setErrorMessage('Masa bilgileri yüklenirken bir sorun oluştu.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [token, setActiveTable]);

  // Loading State
  if (loading) {
    return (
      <main className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-coffee-800">
          <RefreshCw className="w-8 h-8 animate-spin text-terracotta-600" />
          <p className="font-serif font-bold text-lg text-coffee-950">Masa Hazırlanıyor...</p>
          <span className="text-xs text-coffee-600">Menü ve sohbet soruları yükleniyor</span>
        </div>
      </main>
    );
  }

  // Error State
  if (errorMessage || !table) {
    return (
      <main className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-coffee-200 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif font-black text-2xl text-coffee-950">
              Masa Doğrulanamadı
            </h1>
            <p className="text-xs sm:text-sm text-coffee-700">
              {errorMessage || 'Bu masa geçerli veya aktif değil.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-100 text-xs text-coffee-800 text-left space-y-1.5">
            <p className="font-semibold text-coffee-900">Ne yapabilirsiniz?</p>
            <ul className="list-disc list-inside space-y-1 text-coffee-600">
              <li>Masanızdaki QR kodu veya NFC etiketini tekrar tarayın.</li>
              <li>İşletme personeline masanın aktif olup olmadığını sorabilirsiniz.</li>
            </ul>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-3 px-4 rounded-xl border border-coffee-200 text-coffee-800 text-sm font-semibold hover:bg-cream-100 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tekrar Dene
            </button>
            <Link
              to="/"
              className="flex-1 py-3 px-4 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-sm font-semibold transition-colors flex items-center justify-center"
            >
              Ana Sayfa
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const getCategoryIcon = (slug: GameType) => {
    switch (slug) {
      case 'sohbeti-baslat':
        return <MessageCircle className="w-5 h-5 text-terracotta-600" />;
      case 'ikilemde-kal':
        return <Split className="w-5 h-5 text-caramel-600" />;
      case 'kim-daha-muhtemel':
        return <Users className="w-5 h-5 text-coffee-700" />;
      case 'ne-kadar-taniyoruz':
        return <HeartHandshake className="w-5 h-5 text-rose-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-terracotta-600" />;
    }
  };

  return (
    <main className="min-h-screen bg-cream-50 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto">
      <div className="space-y-4">
        {/* Üst Kafe ve Masa Bilgi Kartı */}
        <header className="flex items-center justify-between p-4 bg-cream-100 rounded-3xl shadow-print-sm border-2 border-coffee-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-terracotta-600 text-cream-50 flex items-center justify-center shrink-0 border-2 border-coffee-950 shadow-xs">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="font-serif font-bold text-coffee-950 text-base leading-tight">
                {table.cafe?.name || 'Fincan Sohbet'}
              </h2>
              <p className="text-xs font-bold text-terracotta-700 uppercase tracking-wide">
                {table.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-pistachio-100 text-pistachio-900 text-[11px] font-bold border border-pistachio-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.tableActive}</span>
            </div>
          </div>
        </header>

        {/* Sekmeli Üst Geçiş Menüsü (Masa / Menü / Oyunlar) */}
        <nav className="flex items-center bg-cream-200/90 p-1 rounded-2xl border-2 border-coffee-950/20">
          <button
            onClick={() => setActiveView('portal')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'portal'
                ? 'bg-cream-50 text-coffee-950 border border-coffee-950/20 shadow-sm'
                : 'text-coffee-700 hover:text-coffee-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-caramel-600" />
            <span>{t.tabPortal}</span>
          </button>

          <button
            onClick={() => setActiveView('menu')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'menu'
                ? 'bg-cream-50 text-coffee-950 border border-coffee-950/20 shadow-sm'
                : 'text-coffee-700 hover:text-coffee-950'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-terracotta-600" />
            <span>{t.tabMenu}</span>
          </button>

          <button
            onClick={() => setActiveView('games')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'games'
                ? 'bg-cream-50 text-coffee-950 border border-coffee-950/20 shadow-sm'
                : 'text-coffee-700 hover:text-coffee-950'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-coffee-800" />
            <span>{t.tabGames}</span>
          </button>
        </nav>

        {/* MASA SERVİS ÇAĞRILARI (Garson Çağır & Hesap İste) — İşletme Açtıysa Görünür */}
        {table.cafe?.waiter_call_enabled !== false && (
          <section className="space-y-2">
            {callFeedback && (
              <div className="p-3.5 rounded-2xl bg-pistachio-100 border-2 border-coffee-950 text-xs font-bold text-coffee-950 flex items-center justify-between gap-2 shadow-print-sm">
                <span>{callFeedback}</span>
              </div>
            )}

            {activeCall ? (
              <div className="p-4 rounded-3xl bg-caramel-100 border-2 border-coffee-950 shadow-print-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-caramel-400 text-coffee-950 border-2 border-coffee-950 flex items-center justify-center shrink-0 shadow-xs animate-pulse">
                    {activeCall.request_type === 'waiter' ? <Bell className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-coffee-950">
                        {activeCall.request_type === 'waiter' ? t.waiterCalled || 'Garson Çağrıldı' : t.billRequested || 'Hesap İstendi'}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border border-coffee-950 ${
                        activeCall.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-caramel-300 text-coffee-950'
                      }`}>
                        {activeCall.status === 'in_progress' ? 'Garson Yolda' : 'Beklemede'}
                      </span>
                    </div>
                    <p className="text-[11px] text-coffee-700 mt-0.5">
                      {activeCall.note ? `Not: ${activeCall.note}` : (activeCall.request_type === 'waiter' ? t.waiterOnTheWay : t.billOnTheWay)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCancelCall}
                  className="px-3 py-1.5 rounded-xl border-2 border-coffee-950 bg-cream-50 hover:bg-cream-200 text-[11px] font-bold text-coffee-950 transition-colors shrink-0 shadow-xs"
                >
                  {t.cancelCall}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleOpenCallModal('waiter')}
                  className="py-3 px-3.5 rounded-2xl bg-pistachio-600 hover:bg-pistachio-700 text-cream-50 border-2 border-coffee-950 shadow-print-sm flex items-center justify-center gap-2 font-bold text-xs transition-transform active:translate-y-0.5"
                >
                  <Bell className="w-4 h-4" />
                  <span>{t.callWaiter}</span>
                </button>

                <button
                  onClick={() => handleOpenCallModal('bill')}
                  className="py-3 px-3.5 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-cream-50 border-2 border-coffee-950 shadow-print-sm flex items-center justify-center gap-2 font-bold text-xs transition-transform active:translate-y-0.5"
                >
                  <Receipt className="w-4 h-4" />
                  <span>{t.requestBill}</span>
                </button>
              </div>
            )}
          </section>
        )}

        {/* ------------------------------------------------------------- */}
        {/* GÖRÜNÜM 1: PORTAL (İKİYE AYRILAN ANA KARŞILAMA EKRANI)           */}
        {/* ------------------------------------------------------------- */}
        {activeView === 'portal' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Karşılama Başlığı */}
            <div className="text-center pt-2 pb-1 space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel-100 text-caramel-800 text-[11px] font-semibold">
                <Coffee className="w-3.5 h-3.5" />
                {t.welcomeTable}
              </span>
              <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-coffee-950 leading-tight">
                {t.whatToDo}
              </h1>
              <p className="text-xs text-coffee-700 max-w-xs mx-auto">
                {t.whatToDoDesc}
              </p>
            </div>

            {/* İKİ ANA KAHRAMAN KART (Split Cards) */}
            <div className="grid grid-cols-1 gap-3.5 pt-1">
              {/* KART 1: KAFE MENÜSÜNÜ İNCELE */}
              <button
                onClick={() => setActiveView('menu')}
                className="w-full text-left p-5 rounded-3xl bg-cream-100 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all group active:translate-y-0.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-caramel-300 text-coffee-950 border-2 border-coffee-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cream-50 text-coffee-950 border border-coffee-950 text-[10px] font-bold uppercase tracking-wider">
                    {t.orderBeforeBadge}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1">
                  <h3 className="font-serif font-extrabold text-lg sm:text-xl text-coffee-950 group-hover:text-terracotta-700 transition-colors flex items-center justify-between">
                    <span>{t.exploreMenuTitle}</span>
                    <ChevronRight className="w-5 h-5 text-coffee-950 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-coffee-700 leading-relaxed">
                    {t.exploreMenuDesc}
                  </p>
                </div>
              </button>

              {/* KART 2: KONUŞACAK KONU ARIYORUZ (SOHBET VE OYUNLAR) */}
              <button
                onClick={() => setActiveView('games')}
                className="w-full text-left p-5 rounded-3xl bg-terracotta-600 text-cream-50 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all group active:translate-y-0.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cream-50 text-terracotta-600 border-2 border-coffee-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cream-50 text-terracotta-700 border border-coffee-950 text-[10px] font-bold uppercase tracking-wider">
                    {t.fourGamesBadge}
                  </span>
                </div>

                <div className="mt-3.5 space-y-1 text-cream-50">
                  <h3 className="font-serif font-extrabold text-lg sm:text-xl text-cream-50 flex items-center justify-between">
                    <span>{t.findTopicTitle}</span>
                    <ChevronRight className="w-5 h-5 text-cream-50 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-cream-100 leading-relaxed">
                    {t.findTopicDesc}
                  </p>
                </div>
              </button>

              {/* KART 3: MASALAR ARASI KAFE TRIVIA (PUB QUIZ) */}
              <button
                onClick={() => navigate('/play/kafe-trivia')}
                className="w-full text-left p-5 rounded-3xl bg-caramel-400 text-coffee-950 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all group active:translate-y-0.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cream-50 text-coffee-950 border-2 border-coffee-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Trophy className="w-6 h-6 text-caramel-700" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cream-50 text-coffee-950 border border-coffee-950 text-[10px] font-black uppercase tracking-wider">
                    Masalar Arası
                  </span>
                </div>

                <div className="mt-3.5 space-y-1 text-coffee-950">
                  <h3 className="font-serif font-extrabold text-lg sm:text-xl text-coffee-950 flex items-center justify-between">
                    <span>Kafe Trivia & Bilgi Yarışması</span>
                    <ChevronRight className="w-5 h-5 text-coffee-950 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-coffee-800 leading-relaxed">
                    10 kategori (Futbol, Sinema, Müzik, Genel Kültür...) arasından seçin, diğer masalarla canlı yarışın!
                  </p>
                </div>
              </button>

              {/* KART 4: MASALAR ARASI HIZLI DÜELLO (1V1) */}
              <button
                onClick={() => navigate('/play/masa-duellosu')}
                className="w-full text-left p-5 rounded-3xl bg-coffee-900 text-cream-50 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all group active:translate-y-0.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-terracotta-600 text-cream-50 border-2 border-coffee-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Swords className="w-6 h-6 text-cream-50" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-terracotta-600 text-cream-50 border border-coffee-950 text-[10px] font-black uppercase tracking-wider">
                    1'e 1 Düello
                  </span>
                </div>

                <div className="mt-3.5 space-y-1 text-cream-50">
                  <h3 className="font-serif font-extrabold text-lg sm:text-xl text-cream-50 flex items-center justify-between">
                    <span>Masalar Arası Düello</span>
                    <ChevronRight className="w-5 h-5 text-cream-50 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-cream-200 leading-relaxed">
                    Kafedeki bir masaya meydan okuyun, 5 hızlı soruda kozlarınızı paylaşın!
                  </p>
                </div>
              </button>

              {/* KART 5: ORTAK KAFE NABZI (CANLI OYLAMALAR) */}
              <button
                onClick={() => navigate('/play/kafe-nabzi')}
                className="w-full text-left p-5 rounded-3xl bg-pistachio-600 text-cream-50 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all group active:translate-y-0.5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cream-50 text-pistachio-700 border-2 border-coffee-950 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cream-50 text-pistachio-800 border border-coffee-950 text-[10px] font-black uppercase tracking-wider">
                    Canlı Oylama
                  </span>
                </div>

                <div className="mt-3.5 space-y-1 text-cream-50">
                  <h3 className="font-serif font-extrabold text-lg sm:text-xl text-cream-50 flex items-center justify-between">
                    <span>Ortak Kafe Nabzı & Anketler</span>
                    <ChevronRight className="w-5 h-5 text-cream-50 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-cream-100 leading-relaxed">
                    Müzik tercihi, menemen ikilemi ve kafe modunu oylayın, canlı sonuçları görün!
                  </p>
                </div>
              </button>
            </div>

            {/* Hızlı Wi-Fi Bilgisi Kartı */}
            {(table.cafe?.wifi_name || table.cafe?.wifi_password) && (
              <div className="p-4 rounded-3xl bg-cream-100 border-2 border-coffee-950 shadow-print-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cream-50 border-2 border-coffee-950 text-coffee-950 flex items-center justify-center shrink-0">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="text-coffee-600 font-bold uppercase tracking-wider text-[10px]">Masa Wi-Fi:</span>
                    <p className="font-bold text-coffee-950">
                      {table.cafe.wifi_name || 'Kafe Wi-Fi'} 
                      {table.cafe.wifi_password && (
                        <span className="text-coffee-700 font-normal ml-1">
                          (Şifre: <code className="bg-cream-200 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold text-coffee-950 border border-coffee-950/20">{table.cafe.wifi_password}</code>)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {table.cafe?.wifi_password && (
                  <button
                    onClick={handleCopyWifi}
                    className="p-2.5 rounded-xl border border-coffee-950/20 text-coffee-800 hover:text-coffee-950 hover:bg-cream-200 transition-colors shrink-0"
                    title="Şifreyi Kopyala"
                  >
                    {copiedWifi ? (
                      <Check className="w-4 h-4 text-pistachio-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Masayı Arkadaşlarla Paylaş Butonu */}
            <div>
              <button
                onClick={handleShare}
                className="w-full btn-secondary !py-3 !text-xs text-center justify-center"
              >
                {copied ? <Check className="w-4 h-4 text-pistachio-600" /> : <Share2 className="w-4 h-4 text-terracotta-600" />}
                <span>{copied ? 'Masa Bağlantısı Kopyalandı!' : 'Masayı Arkadaşlarınla Paylaş'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* GÖRÜNÜM 2: KAFE MENÜSÜ                                         */}
        {/* ------------------------------------------------------------- */}
        {activeView === 'menu' && (
          <CafeMenuView 
            cafe={table.cafe} 
            tableToken={table.public_token}
            tableLabel={table.label} 
            onSwitchToGames={() => setActiveView('games')} 
            onSwitchToPortal={() => setActiveView('portal')}
          />
        )}

        {/* ------------------------------------------------------------- */}
        {/* GÖRÜNÜM 3: SOHBET & OYUNLAR LİSTESİ                            */}
        {/* ------------------------------------------------------------- */}
        {activeView === 'games' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center pt-2 pb-1 space-y-1">
              <h2 className="font-serif font-extrabold text-2xl text-coffee-950">
                Kahve Yanı Sohbet Oyunları
              </h2>
              <p className="text-xs text-coffee-700">
                Tek telefondan tüm masayla oynayın. İndirme veya hesap açma gerektirmez!
              </p>
            </div>

            {/* Hızlı Başlat Butonu */}
            <button
              onClick={() => navigate('/play/sohbeti-baslat')}
              className="w-full btn-primary !py-4 !text-base flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Hemen Sohbeti Başlat</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Masalar Arası Kafe Trivia Butonu */}
            <button
              onClick={() => navigate('/play/kafe-trivia')}
              className="w-full py-3.5 px-5 rounded-3xl bg-caramel-400 hover:bg-caramel-500 text-coffee-950 border-2 border-coffee-950 shadow-print-sm flex items-center justify-between gap-2 transition-transform active:translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cream-50 border-2 border-coffee-950 flex items-center justify-center text-coffee-950 shrink-0">
                  <Trophy className="w-5 h-5 text-caramel-700" />
                </div>
                <span className="text-left leading-tight">
                  <span className="block font-black text-sm">Masalar Arası Kafe Trivia</span>
                  <span className="block text-[11px] text-coffee-800 font-medium">10 tematik kategori ile canlı yarışın</span>
                </span>
              </div>
              <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
            </button>

            {/* Masalar Arası Hızlı Düello Butonu */}
            <button
              onClick={() => navigate('/play/masa-duellosu')}
              className="w-full py-3.5 px-5 rounded-3xl bg-coffee-900 hover:bg-coffee-950 text-cream-50 border-2 border-coffee-950 shadow-print-sm flex items-center justify-between gap-2 transition-transform active:translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-terracotta-600 border-2 border-coffee-950 flex items-center justify-center text-cream-50 shrink-0">
                  <Swords className="w-5 h-5" />
                </div>
                <span className="text-left leading-tight">
                  <span className="block font-black text-sm">Masalar Arası Hızlı Düello</span>
                  <span className="block text-[11px] text-cream-200 font-normal">Başka bir masaya meydan okuyun (1v1)</span>
                </span>
              </div>
              <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
            </button>

            {/* Ortak Kafe Nabzı Butonu */}
            <button
              onClick={() => navigate('/play/kafe-nabzi')}
              className="w-full py-3.5 px-5 rounded-3xl bg-pistachio-600 hover:bg-pistachio-700 text-cream-50 border-2 border-coffee-950 shadow-print-sm flex items-center justify-between gap-2 transition-transform active:translate-y-0.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cream-50 border-2 border-coffee-950 flex items-center justify-center text-pistachio-800 shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-left leading-tight">
                  <span className="block font-black text-sm">Ortak Kafe Nabzı & Anketler</span>
                  <span className="block text-[11px] text-cream-100 font-normal">Günün canlı oylamalarına katılın</span>
                </span>
              </div>
              <ArrowRight className="w-4 h-4 ml-1 shrink-0" />
            </button>

            {/* Kategoriler Listesi */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between px-1">
                <h3 className="eyebrow text-coffee-600">
                  Tüm Oyunlar ({categories.length})
                </h3>
              </div>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/play/${cat.slug}`)}
                  className="w-full text-left p-4 rounded-3xl bg-cream-100 border-2 border-coffee-950/20 hover:border-coffee-950 hover:shadow-print-sm transition-all group flex items-center justify-between gap-3 active:translate-y-0.5"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-cream-50 border border-coffee-950/20 group-hover:border-coffee-950 flex items-center justify-center shrink-0 transition-colors">
                      {getCategoryIcon(cat.slug)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-coffee-950 group-hover:text-terracotta-700 transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-coffee-600 line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-coffee-600 font-semibold flex items-center gap-1 bg-cream-200/80 px-2 py-0.5 rounded-lg border border-coffee-950/10">
                      <Clock className="w-3 h-3" />
                      {cat.estimated_time}
                    </span>
                    <ArrowRight className="w-4 h-4 text-coffee-400 group-hover:text-terracotta-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            {/* Masa Karşılama Ekranına Dön / Menüye Geç Butonları */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setActiveView('portal')}
                className="flex-1 py-3 px-3 rounded-2xl bg-cream-100 hover:bg-cream-200 border-2 border-coffee-950/20 text-coffee-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-caramel-600" />
                <span>Masa Karşılama Ekranına Dön</span>
              </button>
              <button
                onClick={() => setActiveView('menu')}
                className="flex-1 py-3 px-3 rounded-2xl bg-cream-100 hover:bg-cream-200 border-2 border-coffee-950/20 text-coffee-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4 text-caramel-700" />
                <span>Kafe Menüsüne Göz At</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Alt Bilgilendirme */}
      <footer className="text-center pt-6 pb-4 space-y-2 border-t border-coffee-200/50 mt-6">
        <p className="text-[11px] text-coffee-500">
          Bu masa oturumu şifresiz ve tamamen anonimdir. Oyun durumu yalnızca bu telefonda tutulur.
        </p>
        <div className="flex items-center justify-center gap-3 text-xs text-coffee-600">
          <Link to="/privacy" className="hover:underline">Gizlilik</Link>
          <span>•</span>
          <Link to="/" className="hover:underline">Fincan Sohbet Nedir?</Link>
        </div>
      </footer>

      {/* Garson & Hesap Çağrı Modalı */}
      {table && (
        <ServiceCallModal
          isOpen={callModalOpen}
          mode={callModalMode}
          tableToken={table.public_token}
          tableLabel={table.label}
          onClose={() => setCallModalOpen(false)}
          onSuccess={handleCallSuccess}
        />
      )}
    </main>
  );
};
