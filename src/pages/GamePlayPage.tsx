import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Sparkles } from 'lucide-react';
import { getQuestions, logUsageEvent } from '../lib/api';
import type { Question, GameType } from '../types';
import { useTableSession } from '../hooks/useTableSession';
import { useTranslation } from '../lib/i18n';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { SohbetiBaslatGame } from '../features/games/SohbetiBaslatGame';
import { IkilemdeKalGame } from '../features/games/IkilemdeKalGame';
import { KimDahaMuhtemelGame } from '../features/games/KimDahaMuhtemelGame';
import { NeKadarTaniyoruzGame } from '../features/games/NeKadarTaniyoruzGame';

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
  ].includes(gameSlug || '');

  useEffect(() => {
    if (!isValidGame || !gameSlug) {
      navigate('/games', { replace: true });
      return;
    }

    setLoading(true);
    getQuestions({ gameType: gameSlug as GameType, onlyActive: true }).then((data) => {
      setQuestions(data);
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
        <header className="mb-5 flex items-center justify-between">
          <h1 className="font-serif font-black text-xl sm:text-2xl text-coffee-950">
            {getGameTitle()}
          </h1>
          <span className="text-xs text-coffee-500 font-medium">
            {questions.length} {lang === 'en' ? 'Questions' : 'Soru'}
          </span>
        </header>

        {/* Dynamic Game Component */}
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
      </div>

      <footer className="text-center pt-8 pb-3 text-[11px] text-coffee-400">
        {lang === 'en' ? 'Fincan Sohbet • Friendship Experience at Your Table' : 'Fincan Sohbet • Masadaki Arkadaşlık Deneyimi'}
      </footer>
    </main>
  );
};
