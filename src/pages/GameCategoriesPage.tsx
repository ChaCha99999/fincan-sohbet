import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Split, 
  Users, 
  HeartHandshake, 
  ArrowLeft, 
  Clock, 
  Play, 
  Sparkles,
  Coffee,
  ChevronRight
} from 'lucide-react';
import { getCategories } from '../lib/api';
import type { Category, GameType } from '../types';
import { useTableSession } from '../hooks/useTableSession';

export const GameCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeTable } = useTableSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((cats) => {
      setCategories(cats);
      setLoading(false);
    });
  }, []);

  const getGameVisual = (slug: GameType) => {
    switch (slug) {
      case 'sohbeti-baslat':
        return {
          icon: <MessageCircle className="w-7 h-7 text-terracotta-600" />,
          bgColor: 'bg-terracotta-50',
          borderColor: 'border-terracotta-200',
          badgeText: '50+ Samimi Soru',
          badgeColor: 'bg-terracotta-100 text-terracotta-800',
          accent: 'from-terracotta-500 to-terracotta-700',
        };
      case 'ikilemde-kal':
        return {
          icon: <Split className="w-7 h-7 text-caramel-600" />,
          bgColor: 'bg-caramel-50',
          borderColor: 'border-caramel-200',
          badgeText: '50+ Çarpıcı İkilem',
          badgeColor: 'bg-caramel-100 text-caramel-800',
          accent: 'from-caramel-500 to-caramel-600',
        };
      case 'kim-daha-muhtemel':
        return {
          icon: <Users className="w-7 h-7 text-coffee-700" />,
          bgColor: 'bg-coffee-50',
          borderColor: 'border-coffee-200',
          badgeText: '50+ Grup Sorusu',
          badgeColor: 'bg-coffee-100 text-coffee-800',
          accent: 'from-coffee-700 to-coffee-900',
        };
      case 'ne-kadar-taniyoruz':
        return {
          icon: <HeartHandshake className="w-7 h-7 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          badgeText: '50+ Tahmin & Puan',
          badgeColor: 'bg-rose-100 text-rose-800',
          accent: 'from-rose-500 to-rose-700',
        };
      default:
        return {
          icon: <Sparkles className="w-7 h-7 text-terracotta-600" />,
          bgColor: 'bg-cream-100',
          borderColor: 'border-coffee-200',
          badgeText: 'Mini Oyun',
          badgeColor: 'bg-cream-200 text-coffee-800',
          accent: 'from-terracotta-500 to-terracotta-700',
        };
    }
  };

  return (
    <main className="min-h-screen bg-cream-50 p-4 sm:p-6 max-w-lg mx-auto flex flex-col justify-between">
      <div className="space-y-5">
        {/* Navigation Bar */}
        <nav aria-label="Gezinme çubuğu" className="flex items-center justify-between pt-2">
          {activeTable ? (
            <Link
              to={`/t/${activeTable.public_token}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-coffee-700 hover:text-coffee-950 transition-colors p-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Masa Ekranına Dön
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-coffee-700 hover:text-coffee-950 transition-colors p-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfa
            </Link>
          )}

          {activeTable && (
            <span className="text-[11px] font-bold text-terracotta-700 bg-white border border-coffee-200 px-3 py-1 rounded-full shadow-warm-sm flex items-center gap-1.5">
              <Coffee className="w-3 h-3 text-terracotta-500" />
              {activeTable.label}
            </span>
          )}
        </nav>

        {/* Header */}
        <header className="space-y-1.5">
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-coffee-950">
            Bir Oyun Seçin
          </h1>
          <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed">
            Telefonu masanın ortasına koyun. Sırayla soruları okuyun ve kahvenin tadını çıkarın.
          </p>
        </header>

        {/* Categories Grid */}
        {loading ? (
          <div className="space-y-3 py-6">
            <div className="h-32 bg-white rounded-3xl animate-pulse" />
            <div className="h-32 bg-white rounded-3xl animate-pulse" />
            <div className="h-32 bg-white rounded-3xl animate-pulse" />
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((cat) => {
              const visual = getGameVisual(cat.slug);
              return (
                <div
                  key={cat.id}
                  className={`p-5 rounded-3xl bg-white border ${visual.borderColor} shadow-warm-sm hover:shadow-warm transition-all duration-200 flex flex-col justify-between gap-4`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className={`w-14 h-14 rounded-2xl ${visual.bgColor} flex items-center justify-center shrink-0`}>
                        {visual.icon}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${visual.badgeColor}`}>
                            {visual.badgeText}
                          </span>
                          <span className="text-[11px] text-coffee-500 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {cat.estimated_time}
                          </span>
                        </div>
                        <h2 className="font-serif font-bold text-lg text-coffee-950 leading-snug">
                          {cat.name}
                        </h2>
                        <p className="text-xs text-coffee-700 mt-1 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/play/${cat.slug}`)}
                    className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${visual.accent} hover:opacity-95 text-white font-bold text-sm shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98`}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    Oyunu Başlat
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <footer className="text-center pt-8 pb-4 space-y-2 border-t border-coffee-200/50 mt-8">
        <p className="text-[11px] text-coffee-500">
          Tüm oyunlar tek bir telefon üzerinden oynanır. Ek bir cihaz veya uygulama gerekmez.
        </p>
      </footer>
    </main>
  );
};
