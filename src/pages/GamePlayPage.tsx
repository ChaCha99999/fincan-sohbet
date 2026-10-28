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
        logUsageEvent(activeTable.public_token, 'game_start', gameSlug as GameType);
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
        logUsageEvent(activeTable.public_token, 'game_start', gameSlug as GameType);
      }
    });
  }, [gameSlug, isValidGame, navigate, activeTable]);

  const handleFinishGame = () => {
    if (activeTable && gameSlug) {
      logUsageEvent(activeTable.public_token, 'game_complete', gameSlug as GameType);
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

  const getHeaderSubtitle = () => {
    if (lang === 'en') {
      switch (gameSlug) {
        case 'sohbeti-baslat': return `${questions.length} Questions • Intimate & Fun`;
        case 'ikilemde-kal': return `${questions.length} Dilemmas • Would You Rather`;
        case 'kim-daha-muhtemel': return `${questions.length} Questions • Voting`;
        case 'ne-kadar-taniyoruz': return 'Guess & Friendship Points';
        case 'kafe-trivia': return '50+ Questions • 10 Categories';
        case 'masa-duellosu': return '5 Questions • 1v1 Arena';
        case 'kafe-nabzi': return 'Live Polls • All Tables';
        case 'masadaki-casus': return 'Bluff & Roleplay • 3-10 Players';
        case 'bes-saniye': return '5 Seconds • Quick Reflex';
        case 'klasik-tabu': return '100+ Cards • Team Battle';
        case 'parmak-ruleti': return 'Touch & Decide • Who Pays?';
        default: return 'Mini Game';
      }
    }
    switch (gameSlug) {
      case 'sohbeti-baslat':
        return `${questions.length} Soru • Samimi Sohbet`;
      case 'ikilemde-kal':
        return `${questions.length} İkilem • Masada Tartışma`;
      case 'kim-daha-muhtemel':
        return `${questions.length} Soru • Masada Oylama`;
      case 'ne-kadar-taniyoruz':
        return 'Tahmin Et & Puan Topla';
      case 'kafe-trivia':
        return '50+ Soru • 10 Kategori';
      case 'masa-duellosu':
        return '5 Soru • 1v1 Arena';
      case 'kafe-nabzi':
        return 'Canlı Oylamalar • Tüm Masalar';
      case 'masadaki-casus':
        return 'Blöf & Rol • 3-10 Kişi';
      case 'bes-saniye':
        return '5 Saniye • Hızlı Refleks';
      case 'klasik-tabu':
        return '100+ Kart • Takım Savaşı';
      case 'parmak-ruleti':
        return 'Dokun & Seç • Kim Öder?';
      default:
        return `${questions.length} Soru`;
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
    <main className="min-h-[100dvh] bg-cream-50 p-3 sm:p-5 max-w-lg mx-auto flex flex-col justify-between">
      {/* 1. Compact Navigation Bar */}
      <nav aria-label="Oyun gezinmesi" className="flex items-center justify-between pb-2.5 pt-0.5 border-b border-coffee-200/60 shrink-0">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/games');
            }
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-coffee-700 hover:text-coffee-950 transition-colors py-1 px-1.5 -ml-1 rounded-lg hover:bg-cream-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden xs:inline">{t.backToGames}</span>
          <span className="xs:hidden">Geri</span>
        </button>

        {/* Center Title & Counter Pill */}
        <div className="text-center px-1">
          <h1 className="font-serif font-black text-sm sm:text-base text-coffee-950 leading-tight">
            {getGameTitle()}
          </h1>
          <span className="text-[10px] text-coffee-500 font-medium block leading-tight">
            {getHeaderSubtitle()}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <LanguageSwitch />
          {activeTable && (
            <Link
              to={`/t/${activeTable.public_token}`}
              title="Masa Ana Ekranına Dön"
              className="flex items-center gap-1 text-[11px] font-bold text-coffee-700 hover:text-terracotta-700 bg-white hover:bg-cream-100 border border-coffee-200 px-2 py-0.5 rounded-full shadow-warm-sm transition-colors"
            >
              <Coffee className="w-3 h-3 text-terracotta-500" />
              <span>{activeTable.label}</span>
            </Link>
          )}
        </div>
      </nav>

      {/* 2. Vertically & Horizontally Centered Game Screen */}
      <div className="flex-1 flex flex-col justify-center my-auto py-2.5 w-full">
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

      {/* 3. Minimal Footer */}
      <footer className="text-center pt-1.5 pb-1 text-[10px] text-coffee-400 shrink-0">
        {lang === 'en' ? 'Fincan Sohbet • Friendship Experience at Your Table' : 'Fincan Sohbet • Masadaki Arkadaşlık Deneyimi'}
      </footer>
    </main>
  );
};
