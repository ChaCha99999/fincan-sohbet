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
  ChevronRight
} from 'lucide-react';
import { validateTableToken, logUsageEvent, getCategories } from '../lib/api';
import type { Table, Category, GameType } from '../types';
import { useTableSession } from '../hooks/useTableSession';
import { CafeMenuView } from '../components/CafeMenuView';

type ActiveViewMode = 'portal' | 'menu' | 'games';

export const TableLandingPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setActiveTable } = useTableSession();

  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedWifi, setCopiedWifi] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<ActiveViewMode>('portal');

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
          logUsageEvent(validation.table.cafe_id, validation.table.id, 'table_open', null);
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
  }, [token]);

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
        <header className="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-warm-sm border border-coffee-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="font-bold text-coffee-950 text-sm leading-tight">
                {table.cafe?.name || 'Fincan Sohbet'}
              </h2>
              <p className="text-xs font-semibold text-terracotta-700">
                {table.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Masa Aktif</span>
          </div>
        </header>

        {/* Sekmeli Üst Geçiş Menüsü (Masa / Menü / Oyunlar) */}
        <nav className="flex items-center bg-cream-200/80 p-1 rounded-2xl border border-coffee-200">
          <button
            onClick={() => setActiveView('portal')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'portal'
                ? 'bg-white text-coffee-950 shadow-warm-sm'
                : 'text-coffee-700 hover:text-coffee-950'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-caramel-600" />
            <span>Masa</span>
          </button>

          <button
            onClick={() => setActiveView('menu')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'menu'
                ? 'bg-white text-coffee-950 shadow-warm-sm'
                : 'text-coffee-700 hover:text-coffee-950'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Kafe Menüsü</span>
          </button>

          <button
            onClick={() => setActiveView('games')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'games'
                ? 'bg-white text-coffee-950 shadow-warm-sm'
                : 'text-coffee-700 hover:text-coffee-950'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-coffee-800" />
            <span>Sohbet & Oyun</span>
          </button>
        </nav>

        {/* ------------------------------------------------------------- */}
        {/* GÖRÜNÜM 1: PORTAL (İKİYE AYRILAN ANA KARŞILAMA EKRANI)           */}
        {/* ------------------------------------------------------------- */}
        {activeView === 'portal' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Karşılama Başlığı */}
            <div className="text-center pt-2 pb-1 space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel-100 text-caramel-800 text-[11px] font-semibold">
                <Coffee className="w-3.5 h-3.5" />
                Masaya Hoş Geldiniz!
              </span>
              <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-coffee-950 leading-tight">
                Ne Yapmak İstersiniz?
              </h1>
              <p className="text-xs text-coffee-700 max-w-xs mx-auto">
                Siparişinizi vermeden önce menüye göz atabilir veya kahvenizi beklerken sohbete başlayabilirsiniz.
              </p>
            </div>

            {/* İKİ ANA KAHRAMAN KART (Split Cards) */}
            <div className="grid grid-cols-1 gap-3.5 pt-1">
              {/* KART 1: KAFE MENÜSÜNÜ İNCELE */}
              <button
                onClick={() => setActiveView('menu')}
                className="w-full text-left p-5 rounded-3xl bg-gradient-to-br from-white to-cream-100/70 border-2 border-caramel-200 hover:border-caramel-400 shadow-warm hover:shadow-warm-md transition-all group active:scale-[0.99] relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-caramel-100 text-caramel-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-caramel-50 text-caramel-800 border border-caramel-200/80 text-[10px] font-bold uppercase tracking-wider">
                    Sipariş Öncesi
                  </span>
                </div>

                <div className="mt-3.5 space-y-1">
                  <h3 className="font-serif font-extrabold text-lg sm:text-xl text-coffee-950 group-hover:text-caramel-900 transition-colors flex items-center justify-between">
                    <span>Kafe Menüsünü İncele</span>
                    <ChevronRight className="w-5 h-5 text-caramel-600 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-coffee-600 leading-relaxed">
                    Sıcak ve soğuk kahveler, taze fırın tatlıları ve tüm ürünlerin güncel fiyat listesi.
                  </p>
                </div>
              </button>

              {/* KART 2: KONUŞACAK KONU ARIYORUZ (SOHBET VE OYUNLAR) */}
              <button
                onClick={() => setActiveView('games')}
                className="w-full text-left p-5 rounded-3xl bg-gradient-to-br from-terracotta-600 to-terracotta-700 text-white shadow-warm hover:shadow-warm-md transition-all group active:scale-[0.99] relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <MessageCircle className="w-7 h-7" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                    4 Mini Oyun
                  </span>
                </div>

                <div className="mt-3.5 space-y-1 text-white">
                  <h3 className="font-serif font-extrabold text-lg sm:text-xl text-white flex items-center justify-between">
                    <span>Konuşacak Konu Arıyoruz!</span>
                    <ChevronRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
                  </h3>
                  <p className="text-xs text-cream-100 leading-relaxed">
                    Sipariş hazırlanırken veya masada sessizlik olunca: Buz kırıcı sorular, ikilemler ve tahmin oyunları.
                  </p>
                </div>
              </button>
            </div>

            {/* Hızlı Wi-Fi Bilgisi Kartı */}
            {(table.cafe?.wifi_name || table.cafe?.wifi_password) && (
              <div className="p-3.5 rounded-2xl bg-white border border-coffee-200/80 shadow-warm-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-caramel-100 text-caramel-800 flex items-center justify-center shrink-0">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div className="text-left text-xs">
                    <span className="text-coffee-500 font-medium">Masa Wi-Fi:</span>
                    <p className="font-bold text-coffee-900">
                      {table.cafe.wifi_name || 'Kafe Wi-Fi'} 
                      {table.cafe.wifi_password && (
                        <span className="text-coffee-600 font-normal ml-1">
                          (Şifre: <code className="bg-cream-100 px-1 py-0.5 rounded font-mono text-[11px] font-bold text-coffee-800">{table.cafe.wifi_password}</code>)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {table.cafe?.wifi_password && (
                  <button
                    onClick={handleCopyWifi}
                    className="p-2 rounded-lg text-coffee-600 hover:text-coffee-950 hover:bg-cream-100 transition-colors shrink-0"
                    title="Şifreyi Kopyala"
                  >
                    {copiedWifi ? (
                      <Check className="w-4 h-4 text-emerald-600" />
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
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-cream-100 border border-coffee-200/80 text-coffee-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-warm-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-terracotta-600" />}
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
            tableLabel={table.label} 
            onSwitchToGames={() => setActiveView('games')} 
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
              className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white font-bold text-base shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Hemen Sohbeti Başlat</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            {/* Kategoriler Listesi */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-coffee-600">
                  Tüm Oyunlar ({categories.length})
                </h3>
              </div>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/play/${cat.slug}`)}
                  className="w-full text-left p-3.5 sm:p-4 rounded-2xl bg-white border border-coffee-200/80 hover:border-terracotta-400 hover:shadow-warm transition-all group flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-cream-100 group-hover:bg-terracotta-50 flex items-center justify-center shrink-0 transition-colors">
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
                    <span className="text-[11px] text-coffee-500 font-medium flex items-center gap-1 bg-cream-100 px-2 py-0.5 rounded-lg">
                      <Clock className="w-3 h-3" />
                      {cat.estimated_time}
                    </span>
                    <ArrowRight className="w-4 h-4 text-coffee-400 group-hover:text-terracotta-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>

            {/* Menüye Geri Dön Butonu */}
            <div className="pt-2">
              <button
                onClick={() => setActiveView('menu')}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-cream-100 border border-coffee-200 text-coffee-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-warm-sm"
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
    </main>
  );
};
