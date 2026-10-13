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
  ChevronRight,
  Trophy,
  Swords,
  BarChart3,
  ShieldAlert,
  Zap,
  Flag,
  CreditCard
} from 'lucide-react';
import { getCategories } from '../lib/api';
import type { Category, GameType } from '../types';
import { useTableSession } from '../hooks/useTableSession';
import { useTranslation } from '../lib/i18n';
import { LanguageSwitch } from '../components/LanguageSwitch';

export const GameCategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeTable } = useTableSession();
  const { t, lang } = useTranslation();
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
          badgeText: lang === 'en' ? '50+ Warm Questions' : '50+ Samimi Soru',
          badgeColor: 'bg-terracotta-100 text-terracotta-800',
          accent: 'from-terracotta-500 to-terracotta-700',
        };
      case 'ikilemde-kal':
        return {
          icon: <Split className="w-7 h-7 text-caramel-600" />,
          bgColor: 'bg-caramel-50',
          borderColor: 'border-caramel-200',
          badgeText: lang === 'en' ? '50+ Dilemmas' : '50+ Çarpıcı İkilem',
          badgeColor: 'bg-caramel-100 text-caramel-800',
          accent: 'from-caramel-500 to-caramel-600',
        };
      case 'kim-daha-muhtemel':
        return {
          icon: <Users className="w-7 h-7 text-coffee-700" />,
          bgColor: 'bg-coffee-50',
          borderColor: 'border-coffee-200',
          badgeText: lang === 'en' ? '50+ Group Questions' : '50+ Grup Sorusu',
          badgeColor: 'bg-coffee-100 text-coffee-800',
          accent: 'from-coffee-700 to-coffee-900',
        };
      case 'ne-kadar-taniyoruz':
        return {
          icon: <HeartHandshake className="w-7 h-7 text-rose-600" />,
          bgColor: 'bg-rose-50',
          borderColor: 'border-rose-200',
          badgeText: lang === 'en' ? '50+ Guess & Score' : '50+ Tahmin & Puan',
          badgeColor: 'bg-rose-100 text-rose-800',
          accent: 'from-rose-500 to-rose-700',
        };
      default:
        return {
          icon: <Sparkles className="w-7 h-7 text-terracotta-600" />,
          bgColor: 'bg-cream-100',
          borderColor: 'border-coffee-200',
          badgeText: lang === 'en' ? 'Mini Game' : 'Mini Oyun',
          badgeColor: 'bg-cream-200 text-coffee-800',
          accent: 'from-terracotta-500 to-terracotta-700',
        };
    }
  };

  const getCategoryName = (cat: Category) => {
    if (lang !== 'en') return cat.name;
    switch (cat.slug) {
      case 'sohbeti-baslat': return 'Start the Conversation';
      case 'ikilemde-kal': return 'Stay in Dilemma';
      case 'kim-daha-muhtemel': return "Who's More Likely?";
      case 'ne-kadar-taniyoruz': return 'How Well Do We Know Each Other?';
      default: return cat.name;
    }
  };

  const getCategoryDesc = (cat: Category) => {
    if (lang !== 'en') return cat.description;
    switch (cat.slug) {
      case 'sohbeti-baslat': return 'Icebreaker and intimate questions to warm up the table and break the silence.';
      case 'ikilemde-kal': return 'Intriguing, funny would-you-rather questions that spark friendly debate.';
      case 'kim-daha-muhtemel': return 'Vote on who is most likely to do what in your friend circle!';
      case 'ne-kadar-taniyoruz': return 'Guess each other’s tastes and secrets to collect friendship points!';
      default: return cat.description;
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
              {t.backToTable}
            </Link>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-coffee-700 hover:text-coffee-950 transition-colors p-1"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.backToHome}
            </Link>
          )}

          <div className="flex items-center gap-2">
            <LanguageSwitch />
            {activeTable && (
              <span className="text-[11px] font-bold text-terracotta-700 bg-white border border-coffee-200 px-3 py-1 rounded-full shadow-warm-sm flex items-center gap-1.5">
                <Coffee className="w-3 h-3 text-terracotta-500" />
                {activeTable.label}
              </span>
            )}
          </div>
        </nav>

        {/* Header */}
        <header className="space-y-1.5">
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-coffee-950">
            {t.chooseGameTitle}
          </h1>
          <p className="text-xs sm:text-sm text-coffee-700 leading-relaxed">
            {t.chooseGameDesc}
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
          <div className="space-y-5">
            {/* ÖNE ÇIKAN: MASALAR ARASI KAFE TRIVIA */}
            <div className="p-6 rounded-4xl bg-caramel-400 text-coffee-950 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all flex flex-col justify-between gap-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cream-50 border-2 border-coffee-950 flex items-center justify-center shrink-0">
                    <Trophy className="w-7 h-7 text-caramel-700" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cream-50 text-coffee-950 border border-coffee-950 uppercase tracking-wider">
                        Yeni • Çok Oyunculu
                      </span>
                      <span className="text-[11px] text-coffee-800 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~3-5 dk
                      </span>
                    </div>
                    <h2 className="font-serif font-black text-xl text-coffee-950 leading-snug">
                      Kafe Trivia (Masalar Arası Yarışma)
                    </h2>
                    <p className="text-xs text-coffee-800 leading-relaxed">
                      10 farklı tematik kategori! Masanızla yarışın, en hızlı doğru cevapları vererek kafe lider tablosunda şampiyon olun.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/play/kafe-trivia')}
                className="w-full btn-dark !py-3.5 !text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-cream-50" />
                <span>Trivia'ya Katıl (Kategori Seç)</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            {/* ÖNE ÇIKAN 2: MASALAR ARASI DÜELLO */}
            <div className="p-6 rounded-4xl bg-coffee-900 text-cream-50 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all flex flex-col justify-between gap-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-terracotta-600 border-2 border-coffee-950 flex items-center justify-center shrink-0 text-cream-50">
                    <Swords className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-terracotta-600 text-cream-50 border border-coffee-950 uppercase tracking-wider">
                        1'e 1 Kapışma
                      </span>
                      <span className="text-[11px] text-cream-200 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~2 dk
                      </span>
                    </div>
                    <h2 className="font-serif font-black text-xl text-cream-50 leading-snug">
                      Masalar Arası Hızlı Düello
                    </h2>
                    <p className="text-xs text-cream-200 leading-relaxed">
                      Kafedeki başka bir masaya anında meydan okuyun! 5 soruluk nefes kesen canlı düelloda masanızı temsil edin.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/play/masa-duellosu')}
                className="w-full btn-primary !py-3.5 !text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-cream-50" />
                <span>Düello Başlat (Rakip Seç)</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            {/* ÖNE ÇIKAN 3: ORTAK KAFE NABZI */}
            <div className="p-6 rounded-4xl bg-pistachio-600 text-cream-50 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all flex flex-col justify-between gap-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cream-50 border-2 border-coffee-950 flex items-center justify-center shrink-0 text-pistachio-800">
                    <BarChart3 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cream-50 text-pistachio-900 border border-coffee-950 uppercase tracking-wider">
                        Canlı Oylama
                      </span>
                      <span className="text-[11px] text-cream-100 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Sürekli Açık
                      </span>
                    </div>
                    <h2 className="font-serif font-black text-xl text-cream-50 leading-snug">
                      Ortak Kafe Nabzı & Anketler
                    </h2>
                    <p className="text-xs text-cream-100 leading-relaxed">
                      Kafede bugün ne çalmalı? Menemen soğanlı mı olur? Masanızla oyunuzu verin, kafe genelindeki canlı çoğunluğu görün.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/play/kafe-nabzi')}
                className="w-full btn-secondary !bg-cream-50 !py-3.5 !text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-coffee-950 text-coffee-950" />
                <span>Anketlere Katıl (Oyla)</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            {/* YENİ PARTİ OYUNU: MASADAKİ CASUS (UNDERCOVER) */}
            <div className="p-6 rounded-4xl bg-coffee-950 text-cream-50 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all flex flex-col justify-between gap-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-terracotta-600 border-2 border-coffee-950 flex items-center justify-center shrink-0 text-cream-50">
                    <ShieldAlert className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-caramel-400 text-coffee-950 border border-coffee-950 uppercase tracking-wider">
                        Yeni • Blöf & Rol Oyunu
                      </span>
                      <span className="text-[11px] text-cream-200 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        3-10 Kişi • ~10 dk
                      </span>
                    </div>
                    <h2 className="font-serif font-black text-xl text-cream-50 leading-snug">
                      Masadaki Casus (Undercover)
                    </h2>
                    <p className="text-xs text-cream-200 leading-relaxed">
                      Herkes tek tek gizli kelimesini alır! Masada tek kelimelik ipuçları verilir, blöfler yapılır ve gizli casus yakalanmaya çalışılır.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/play/masadaki-casus')}
                className="w-full btn-primary !py-3.5 !text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-cream-50" />
                <span>Oyunu Başlat (Köstebek Avı)</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            {/* YENİ OYUN 2: 5 SANİYE KURALI */}
            <div className="p-6 rounded-4xl bg-terracotta-600 text-cream-50 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all flex flex-col justify-between gap-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cream-50 border-2 border-coffee-950 flex items-center justify-center shrink-0 text-terracotta-700">
                    <Zap className="w-7 h-7 fill-terracotta-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cream-50 text-terracotta-800 border border-coffee-950 uppercase tracking-wider">
                        Yeni • Hızlı Refleks
                      </span>
                      <span className="text-[11px] text-cream-100 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        2-10 Kişi • ~5 dk
                      </span>
                    </div>
                    <h2 className="font-serif font-black text-xl text-cream-50 leading-snug">
                      5 Saniye Kuralı (Hızlı Beyin Yakan)
                    </h2>
                    <p className="text-xs text-cream-100 leading-relaxed">
                      5 saniyede 3 şey sayabilir misin? Süre hızla akarken beynin donacak, masada en absürt cevaplar havada uçuşacak!
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/play/bes-saniye')}
                className="w-full btn-dark !py-3.5 !text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-cream-50" />
                <span>5 Saniye Başlat</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            {/* YENİ OYUN 3: KLASİK TABU */}
            <div className="p-6 rounded-4xl bg-rose-700 text-cream-50 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all flex flex-col justify-between gap-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cream-50 border-2 border-coffee-950 flex items-center justify-center shrink-0 text-rose-700">
                    <Flag className="w-7 h-7 fill-rose-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cream-50 text-rose-800 border border-coffee-950 uppercase tracking-wider">
                        Yeni • Takım Oyunu
                      </span>
                      <span className="text-[11px] text-cream-100 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        4-12 Kişi • 2 Takım
                      </span>
                    </div>
                    <h2 className="font-serif font-black text-xl text-cream-50 leading-snug">
                      Klasik Tabu (Yasak Kelimeler)
                    </h2>
                    <p className="text-xs text-cream-100 leading-relaxed">
                      5 yasaklı kelimeyi kullanmadan takımına anlat! 100+ zengin klasik Tabu kartı, süre sayacı ve kıyasıya takım rekabeti.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/play/klasik-tabu')}
                className="w-full btn-dark !py-3.5 !text-sm flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-cream-50" />
                <span>Tabu Oyna</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            {/* YENİ OYUN 4: PARMAK RULETİ (HESAP KURBANI) */}
            <div className="p-6 rounded-4xl bg-emerald-950 text-cream-50 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all flex flex-col justify-between gap-4 relative overflow-hidden">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-cream-50 border-2 border-coffee-950 flex items-center justify-center shrink-0 text-emerald-900">
                    <CreditCard className="w-7 h-7 text-emerald-800" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-400 text-coffee-950 border border-coffee-950 uppercase tracking-wider">
                        Yeni • Hesap & Karar
                      </span>
                      <span className="text-[11px] text-cream-200 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        2-10 Kişi • 3 Saniye
                      </span>
                    </div>
                    <h2 className="font-serif font-black text-xl text-cream-50 leading-snug">
                      Parmak Ruleti (Hesap Kurbanı)
                    </h2>
                    <p className="text-xs text-cream-200 leading-relaxed">
                      Herkes parmağını ekrana koysun! 3 saniye sonra şimşek çakar ve hesabı kimin ödeyeceğini ya da kahve turunu kimin ısmarlayacağını kader belirler.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/play/parmak-ruleti')}
                className="w-full btn-primary !bg-emerald-500 hover:!bg-emerald-400 !text-coffee-950 !py-3.5 !text-sm font-black flex items-center justify-center gap-2 border-2 border-coffee-950"
              >
                <Play className="w-4 h-4 fill-coffee-950" />
                <span>Ruleti Başlat</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </button>
            </div>

            {categories.map((cat) => {
              const visual = getGameVisual(cat.slug);
              return (
                <div
                  key={cat.id}
                  className="p-6 rounded-4xl bg-cream-100 border-2 border-coffee-950 shadow-print-sm hover:shadow-print transition-all flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-cream-50 border-2 border-coffee-950 flex items-center justify-center shrink-0">
                        {visual.icon}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-cream-200 text-coffee-950 border border-coffee-950/20">
                            {visual.badgeText}
                          </span>
                          <span className="text-[11px] text-coffee-600 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {cat.estimated_time}
                          </span>
                        </div>
                        <h2 className="font-serif font-bold text-lg text-coffee-950 leading-snug">
                          {getCategoryName(cat)}
                        </h2>
                        <p className="text-xs text-coffee-700 mt-1 leading-relaxed">
                          {getCategoryDesc(cat)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/play/${cat.slug}`)}
                    className="w-full btn-primary !py-3.5 !text-xs flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-cream-50" />
                    {t.startGame}
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
          {t.singlePhoneNotice}
        </p>
      </footer>
    </main>
  );
};
