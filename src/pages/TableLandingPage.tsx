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
  Check
} from 'lucide-react';
import { validateTableToken, logUsageEvent, getCategories } from '../lib/api';
import type { Table, Category, GameType } from '../types';
import { useTableSession } from '../hooks/useTableSession';
import { APP_CONFIG } from '../lib/config';

export const TableLandingPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { setActiveTable } = useTableSession();

  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState<Table | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `${table?.cafe?.name || 'Fincan Sohbet'} - ${table?.label || 'Masa'}`,
        text: 'Masadayız! Gel sen de fincanını al, sohbete ve mini oyunlara katıl:',
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (!token) {
        setErrorMessage('Masa bağlantı kodu eksik.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage(null);

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
        setLoading(false);
        return;
      }

      if (validation.table) {
        setTable(validation.table);
        setActiveTable(validation.table);

        // Masa açılış olayını logla
        logUsageEvent(validation.table.cafe_id, validation.table.id, 'table_open', null);
      }

      setLoading(false);
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
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-16 h-16 rounded-3xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center mx-auto animate-pulse">
            <Coffee className="w-8 h-8" />
          </div>
          <p className="text-coffee-800 font-medium text-sm">
            Masa doğrulanıyor, fincanlar doluyor...
          </p>
        </div>
      </main>
    );
  }

  // Error State (Invalid Token / Inactive Cafe / Inactive Table)
  if (errorMessage || !table) {
    return (
      <main className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-coffee-200 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif font-bold text-2xl text-coffee-950">
              Masa Bağlantısı Geçersiz
            </h1>
            <p className="text-sm text-coffee-700 leading-relaxed">
              {errorMessage || 'Okuttuğunuz QR kod veya NFC etiketi geçerli bir masayla eşleşmedi.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-cream-100 text-xs text-coffee-800 text-left space-y-1.5">
            <p className="font-semibold text-coffee-900">Ne yapabilirsiniz?</p>
            <ul className="list-disc list-inside space-y-1 text-coffee-600">
              <li>Masanızdaki QR kodu tekrar kameranızla tarayın.</li>
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
      {/* Top Header Card */}
      <header className="space-y-4 pt-2">
        {/* Table & Cafe Identity Badge */}
        <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl shadow-warm-sm border border-coffee-200/80">
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
        </div>

        {/* Hero Welcome Message */}
        <div className="text-center pt-3 pb-2 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel-100 text-caramel-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            {APP_CONFIG.brandName}
          </span>
          <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-coffee-950 leading-tight">
            Kahveniz Hazırsa, Sohbet Başlasın!
          </h1>
          <p className="text-xs sm:text-sm text-coffee-700 max-w-xs mx-auto leading-relaxed">
            Uygulama indirmeye veya üye olmaya gerek yok. Bir oyun seçin ve masadaki herkesle eğlenceli vakit geçirin.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => navigate('/play/sohbeti-baslat')}
            className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white font-bold text-base shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <MessageCircle className="w-5 h-5" />
            Sohbeti Başlat
          </button>
          <button
            onClick={() => navigate('/games')}
            className="w-full py-4 px-4 rounded-2xl bg-white hover:bg-cream-100 text-coffee-900 border-2 border-coffee-200 font-bold text-base shadow-warm-sm flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Sparkles className="w-5 h-5 text-caramel-600" />
            Tüm Oyunları Gör
          </button>
        </div>

        {/* Share with table button */}
        <div className="pt-2">
          <button
            onClick={handleShare}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-cream-100 border border-coffee-200/80 text-coffee-800 text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-warm-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-terracotta-600" />}
            <span>{copied ? 'Masa Bağlantısı Kopyalandı!' : 'Masayı Arkadaşlarınla Paylaş'}</span>
          </button>
        </div>
      </header>

      {/* Categories List */}
      <section className="my-6 space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-coffee-600">
            Hızlı Kategori Seçimi
          </h2>
          <span className="text-[11px] text-coffee-500">4 Mini Oyun</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
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
                  <h3 className="font-bold text-sm sm:text-base text-coffee-950 group-hover:text-terracotta-700 transition-colors">
                    {cat.name}
                  </h3>
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
      </section>

      {/* Friendly Bottom Notice */}
      <footer className="text-center pt-2 pb-4 space-y-2 border-t border-coffee-200/50">
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
