import React, { useEffect, useState, Suspense, lazy } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Sparkles, Loader2 } from 'lucide-react';
import { getQuestions, logUsageEvent } from '../lib/api';
import type { Question, GameType } from '../types';
import { useTableSession } from '../hooks/useTableSession';
import { useTranslation } from '../lib/i18n';
import { LanguageSwitch } from '../components/LanguageSwitch';

// Ücretsiz Plan Optimizasyonu: Oyunlar yalnızca oynandığında dinamik olarak yüklenir
// Bu sayede QR okutan müşteri gereksiz kod ve soru paketlerini indirmez (Bant genişliği & Kota tasarrufu)
const SohbetiBaslatGame = lazy(() => import('../features/games/SohbetiBaslatGame').then(m => ({ default: m.SohbetiBaslatGame })));
const IkilemdeKalGame = lazy(() => import('../features/games/IkilemdeKalGame').then(m => ({ default: m.IkilemdeKalGame })));
const KimDahaMuhtemelGame = lazy(() => import('../features/games/KimDahaMuhtemelGame').then(m => ({ default: m.KimDahaMuhtemelGame })));
const NeKadarTaniyoruzGame = lazy(() => import('../features/games/NeKadarTaniyoruzGame').then(m => ({ default: m.NeKadarTaniyoruzGame })));
const KafeTriviaGame = lazy(() => import('../features/games/KafeTriviaGame').then(m => ({ default: m.KafeTriviaGame })));
const MasaDuellosuGame = lazy(() => import('../features/games/MasaDuellosuGame').then(m => ({ default: m.MasaDuellosuGame })));
const KafeNabziGame = lazy(() => import('../features/games/KafeNabziGame').then(m => ({ default: m.KafeNabziGame })));
const MasadakiCasusGame = lazy(() => import('../features/games/MasadakiCasusGame').then(m => ({ default: m.MasadakiCasusGame })));
const BesSaniyeGame = lazy(() => import('../features/games/BesSaniyeGame').then(m => ({ default: m.BesSaniyeGame })));
const KlasikTabuGame = lazy(() => import('../features/games/KlasikTabuGame').then(m => ({ default: m.KlasikTabuGame })));
const ParmakRuletiGame = lazy(() => import('../features/games/ParmakRuletiGame').then(m => ({ default: m.ParmakRuletiGame })));

export const GamePlayPage: React.FC = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();
  const { activeTable } = useTableSession();
  const { t, lang } = useTranslation();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  const isValidGame = [
    'sohbeti-baslat',
    'ikilemde-kal',
    'kim-daha-muhtemel',
    'ne-kadar-taniyoruz',
    'kafe-trivia',
    'masa-duellosu',
    'kafe-nabzi',
    'masadaki-casus',
    'bes-saniye',
    'klasik-tabu',
    'parmak-ruleti',
  ].includes(gameSlug || '');

  useEffect(() => {
    if (!isValidGame || !gameSlug) {
      navigate('/games', { replace: true });
      return;
    }

    if (
      gameSlug === 'kafe-trivia' || 
      gameSlug === 'masa-duellosu' || 
      gameSlug === 'kafe-nabzi' ||
      gameSlug === 'masadaki-casus' ||
      gameSlug === 'bes-saniye' ||
      gameSlug === 'klasik-tabu' ||
      gameSlug === 'parmak-ruleti'
    ) {
      setLoading(false);
      if (activeTable) {
        logUsageEvent(activeTable.cafe_id, activeTable.id, 'game_start', gameSlug as GameType);
      }
      return;
    }

    setLoading(true);
    getQuestions({ gameType: gameSlug as GameType, onlyActive: true }).then((data) => {
      // Masada her oyunda soruların tamamen rastgele/karışık sırada gelmesi için Fisher-Yates shuffle
      const shuffled = [...data];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setQuestions(shuffled);
      setLoading(false);

      // Log game start event if active table is present
      if (activeTable) {
        logUsageEvent(activeTable.cafe_id, activeTable.id, 'game_start', gameSlug as GameType);
      }
    });
  }, [gameSlug, isValidGame, navigate, activeTable]);

  const handleFinishGame = () => {
    if (activeTable && gameSlug) {
      logUsageEvent(activeTable.cafe_id, activeTable.id, 'game_complete', gameSlug as GameType);
    }
    if (activeTable) {
      navigate(`/t/${activeTable.public_token}`);
    } else {
      navigate('/games');
    }
  };

  const getGameTitle = () => {
    if (lang === 'en') {
      switch (gameSlug) {
        case 'sohbeti-baslat': return 'Start the Conversation';
        case 'ikilemde-kal': return 'Stay in Dilemma';
        case 'kim-daha-muhtemel': return "Who's More Likely?";
        case 'ne-kadar-taniyoruz': return 'How Well Do We Know Each Other?';
        case 'kafe-trivia': return 'Cafe Trivia & Pub Quiz';
        case 'masa-duellosu': return 'Table Duel (1v1)';
        case 'kafe-nabzi': return 'Cafe Pulse & Live Polls';
        case 'masadaki-casus': return 'Undercover (Spy at the Table)';
        case 'bes-saniye': return '5 Seconds Rule (Fast Banter)';
        case 'klasik-tabu': return 'Classic Taboo (Word Guessing)';
        case 'parmak-ruleti': return 'Finger Roulette (Who Pays the Bill)';
        default: return 'Mini Game';
      }
    }
    switch (gameSlug) {
      case 'sohbeti-baslat':
        return 'Sohbeti Başlat';
      case 'ikilemde-kal':
        return 'İkilemde Kal';
      case 'kim-daha-muhtemel':
        return 'Kim Daha Muhtemel?';
      case 'ne-kadar-taniyoruz':
        return 'Birbirimizi Ne Kadar Tanıyoruz?';
      case 'kafe-trivia':
        return 'Kafe Trivia (Masalar Arası)';
      case 'masa-duellosu':
        return 'Masalar Arası Düello (1v1)';
      case 'kafe-nabzi':
        return 'Ortak Kafe Nabzı (Canlı Oylamalar)';
      case 'masadaki-casus':
        return 'Masadaki Casus (Undercover)';
      case 'bes-saniye':
        return '5 Saniye Kuralı (Hızlı Refleks)';
      case 'klasik-tabu':
        return 'Klasik Tabu (Yasak Kelimeler)';
      case 'parmak-ruleti':
        return 'Parmak Ruleti (Hesap Kurbanı)';
      default:
        return 'Mini Oyun';
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-600 flex items-center justify-center mx-auto animate-spin">
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-coffee-800">
            {lang === 'en' ? 'Preparing questions...' : 'Sorular hazırlanıyor...'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream-50 p-4 sm:p-6 max-w-lg mx-auto flex flex-col justify-between">
      <div>
        {/* Navigation & Table Context */}
        <nav aria-label="Oyun gezinmesi" className="flex items-center justify-between pb-4 pt-1 border-b border-coffee-200/50 mb-5">
          <Link
            to="/games"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-coffee-700 hover:text-coffee-950 transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToGames}
          </Link>

          <div className="flex items-center gap-2">
            <LanguageSwitch />
            {activeTable && (
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-coffee-700 bg-white border border-coffee-200 px-2.5 py-1 rounded-full shadow-warm-sm">
                <Coffee className="w-3 h-3 text-terracotta-500" />
                <span>{activeTable.label}</span>
              </div>
            )}
          </div>
        </nav>

        {/* Game Title Header */}
        <header className="mb-5 flex flex-wrap items-baseline justify-between gap-1.5">
          <h1 className="font-serif font-black text-lg sm:text-2xl text-coffee-950">
            {getGameTitle()}
          </h1>
          <span className="text-[11px] sm:text-xs text-coffee-500 font-medium shrink-0">
            {gameSlug === 'kafe-trivia' 
              ? (lang === 'en' ? '50+ Questions • 10 Categories' : '50+ Soru • 10 Kategori')
              : gameSlug === 'masa-duellosu'
              ? (lang === 'en' ? '5 Quick Questions • 1v1 Arena' : '5 Hızlı Soru • 1v1 Arena')
              : gameSlug === 'kafe-nabzi'
              ? (lang === 'en' ? 'Live Polls • All Tables' : 'Canlı Oylamalar • Tüm Masalar')
              : gameSlug === 'masadaki-casus'
              ? (lang === 'en' ? 'Bluff & Roleplay • 3-10 Players' : 'Blöf & Rol • 3-10 Kişi')
              : gameSlug === 'bes-saniye'
              ? (lang === 'en' ? '5 Seconds • Quick Reflex' : '5 Saniye • Hızlı Refleks')
              : gameSlug === 'klasik-tabu'
              ? (lang === 'en' ? '100+ Cards • Team Battle' : '100+ Kart • Takım Savaşı')
              : gameSlug === 'parmak-ruleti'
              ? (lang === 'en' ? 'Touch & Decide • Who Pays?' : 'Dokun & Seç • Kim Öder?')
              : `${questions.length} ${lang === 'en' ? 'Questions' : 'Soru'}`}
          </span>
        </header>

        {/* Dynamic Game Component (Lazy Loaded Chunk) */}
        <Suspense fallback={
          <div className="py-16 flex flex-col items-center justify-center gap-2.5 text-coffee-700">
            <Loader2 className="w-7 h-7 animate-spin text-terracotta-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-coffee-500">Oyun Hazırlanıyor...</span>
          </div>
        }>
          {gameSlug === 'sohbeti-baslat' && (
            <SohbetiBaslatGame questions={questions} onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'ikilemde-kal' && (
            <IkilemdeKalGame questions={questions} onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'kim-daha-muhtemel' && (
            <KimDahaMuhtemelGame questions={questions} onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'ne-kadar-taniyoruz' && (
            <NeKadarTaniyoruzGame questions={questions} onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'kafe-trivia' && (
            <KafeTriviaGame onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'masa-duellosu' && (
            <MasaDuellosuGame onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'kafe-nabzi' && (
            <KafeNabziGame onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'masadaki-casus' && (
            <MasadakiCasusGame onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'bes-saniye' && (
            <BesSaniyeGame onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'klasik-tabu' && (
            <KlasikTabuGame onFinishGame={handleFinishGame} />
          )}
          {gameSlug === 'parmak-ruleti' && (
            <ParmakRuletiGame onFinishGame={handleFinishGame} />
          )}
        </Suspense>
      </div>

      <footer className="text-center pt-8 pb-3 text-[11px] text-coffee-400">
        {lang === 'en' ? 'Fincan Sohbet • Friendship Experience at Your Table' : 'Fincan Sohbet • Masadaki Arkadaşlık Deneyimi'}
      </footer>
    </main>
  );
};
