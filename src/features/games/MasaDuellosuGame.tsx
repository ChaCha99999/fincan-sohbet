import React, { useState, useEffect, useRef } from 'react';
import { 
  Swords, 
  Shield, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Coffee, 
  ChevronRight, 
  Radio, 
  Crown,
  Shuffle
} from 'lucide-react';
import type { TriviaCategoryInfo, TriviaQuestion, DuelOpponent } from '../../types';
import { TRIVIA_CATEGORIES, TRIVIA_QUESTIONS } from '../../data/triviaQuestions';
import { useTableSession } from '../../hooks/useTableSession';

interface MasaDuellosuGameProps {
  onFinishGame: () => void;
}

type DuelStage = 'lobby' | 'matchmaking' | 'duel-arena' | 'summary';

const DUEL_QUESTIONS_COUNT = 5;
const QUESTION_TIME_LIMIT = 15;

const MOCK_OPPONENTS: DuelOpponent[] = [
  { id: 't-2', tableLabel: 'Masa 2', isOnline: true, avatarColor: 'from-blue-600 to-indigo-700', winCount: 6 },
  { id: 't-5', tableLabel: 'Masa 5', isOnline: true, avatarColor: 'from-emerald-600 to-teal-700', winCount: 9 },
  { id: 't-7', tableLabel: 'Masa 7', isOnline: true, avatarColor: 'from-purple-600 to-pink-700', winCount: 3 },
  { id: 't-9', tableLabel: 'Masa 9', isOnline: true, avatarColor: 'from-amber-600 to-orange-700', winCount: 5 },
];

export const MasaDuellosuGame: React.FC<MasaDuellosuGameProps> = ({ onFinishGame }) => {
  const { activeTable } = useTableSession();
  const currentTableLabel = activeTable?.label || 'Masa';

  // Game state
  const [stage, setStage] = useState<DuelStage>('lobby');
  const [selectedOpponent, setSelectedOpponent] = useState<DuelOpponent>(MOCK_OPPONENTS[1]);
  const [selectedCategory, setSelectedCategory] = useState<TriviaCategoryInfo | null>(null);

  // Matchmaking
  const [matchmakingCountdown, setMatchmakingCountdown] = useState(3);

  // Duel arena state
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [myCorrect, setMyCorrect] = useState(0);
  const [opponentCorrect, setOpponentCorrect] = useState(0);

  // Question round state
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [myEarnedPoints, setMyEarnedPoints] = useState(0);
  const [opponentAnswered, setOpponentAnswered] = useState(false);
  const [opponentIsCorrect, setOpponentIsCorrect] = useState(false);
  const [opponentEarnedPoints, setOpponentEarnedPoints] = useState(0);

  // Timers
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opponentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Start matchmaking
  const handleStartMatchmaking = (opponent: DuelOpponent, cat: TriviaCategoryInfo | null) => {
    setSelectedOpponent(opponent);
    setSelectedCategory(cat);
    setMatchmakingCountdown(3);
    setStage('matchmaking');
  };

  // Matchmaking effect (3, 2, 1 -> Start duel)
  useEffect(() => {
    if (stage !== 'matchmaking') return;

    if (matchmakingCountdown > 1) {
      const timer = setTimeout(() => {
        setMatchmakingCountdown((prev) => prev - 1);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // Prepare questions
        let pool = TRIVIA_QUESTIONS;
        if (selectedCategory) {
          pool = TRIVIA_QUESTIONS.filter((q) => q.categoryId === selectedCategory.id);
        }
        const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, DUEL_QUESTIONS_COUNT);
        setQuestions(shuffled);
        setCurrentQIndex(0);
        setMyScore(0);
        setOpponentScore(0);
        setMyCorrect(0);
        setOpponentCorrect(0);
        setStage('duel-arena');
        resetQuestionState();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [stage, matchmakingCountdown, selectedCategory]);

  const resetQuestionState = () => {
    setTimeLeft(QUESTION_TIME_LIMIT);
    setSelectedOption(null);
    setIsAnswered(false);
    setMyEarnedPoints(0);
    setOpponentAnswered(false);
    setOpponentIsCorrect(false);
    setOpponentEarnedPoints(0);
  };

  // Simulate opponent behavior for the active question
  useEffect(() => {
    if (stage !== 'duel-arena' || isAnswered) return;

    // Opponent will answer at a random time between 2.5 and 9 seconds
    const opponentAnswerDelay = Math.floor(Math.random() * 6000) + 2500;
    // 75% probability of opponent being correct
    const willOpponentBeCorrect = Math.random() < 0.75;

    opponentTimerRef.current = setTimeout(() => {
      setOpponentAnswered(true);
      setOpponentIsCorrect(willOpponentBeCorrect);
      if (willOpponentBeCorrect) {
        const bonus = Math.floor(Math.random() * 35) + 15;
        const pts = 100 + bonus;
        setOpponentEarnedPoints(pts);
        setOpponentScore((prev) => prev + pts);
        setOpponentCorrect((prev) => prev + 1);
      }
    }, opponentAnswerDelay);

    return () => {
      if (opponentTimerRef.current) clearTimeout(opponentTimerRef.current);
    };
  }, [stage, currentQIndex]);

  // Main countdown for current question
  useEffect(() => {
    if (stage !== 'duel-arena' || isAnswered) return;

    if (timeLeft <= 0) {
      handleAnswer(-1, true);
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stage, timeLeft, isAnswered]);

  // User submits answer
  const handleAnswer = (optionIdx: number, isTimeout = false) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(optionIdx);

    const currentQ = questions[currentQIndex];
    const isCorrect = !isTimeout && optionIdx === currentQ.correctIndex;

    if (isCorrect) {
      const speedBonus = Math.round((timeLeft / QUESTION_TIME_LIMIT) * 50);
      const points = 100 + speedBonus;
      setMyEarnedPoints(points);
      setMyScore((prev) => prev + points);
      setMyCorrect((prev) => prev + 1);
    } else {
      setMyEarnedPoints(0);
    }

    // If opponent hasn't answered yet, force resolve opponent soon
    if (!opponentAnswered) {
      setTimeout(() => {
        setOpponentAnswered(true);
        const willBeCorrect = Math.random() < 0.7;
        setOpponentIsCorrect(willBeCorrect);
        if (willBeCorrect) {
          const pts = 100 + Math.floor(Math.random() * 20);
          setOpponentEarnedPoints(pts);
          setOpponentScore((prev) => prev + pts);
          setOpponentCorrect((prev) => prev + 1);
        }
      }, 600);
    }
  };

  // Next question or end
  const handleNextQuestion = () => {
    if (currentQIndex + 1 < questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      resetQuestionState();
    } else {
      setStage('summary');
    }
  };

  // Calculate winner
  const getWinner = (): 'me' | 'opponent' | 'draw' => {
    if (myScore > opponentScore) return 'me';
    if (opponentScore > myScore) return 'opponent';
    return 'draw';
  };

  // =========================================================================
  // RENDER 1: DÜELLO LOBİSİ & RAKİP MASA SEÇİMİ
  // =========================================================================
  if (stage === 'lobby') {
    return (
      <div className="space-y-5 animate-in fade-in duration-300">
        {/* Banner */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-red-600 via-rose-700 to-coffee-950 text-white shadow-warm relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-rose-100 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
              <Swords className="w-3.5 h-3.5 text-rose-300" />
              <span>1'e 1 Masa Kapışması</span>
            </div>
            <h2 className="font-serif font-black text-2xl text-white">
              Masalar Arası Düello
            </h2>
            <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
              Masanızla kafedeki diğer masalardan birine meydan okuyun! 5 soruluk hızlı bilgi yarışmasında en çok puanı toplayan masa kazanır.
            </p>
          </div>
        </div>

        {/* Kategori Seçici */}
        <div className="space-y-2 bg-white rounded-2xl p-4 border border-coffee-200/80 shadow-warm-sm">
          <label className="block text-xs font-bold text-coffee-800 uppercase tracking-wider">
            Düello Alanı (Kategori)
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === null
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-cream-100 text-coffee-700 hover:bg-cream-200'
              }`}
            >
              🎲 Karışık (Tüm Konular)
            </button>
            {TRIVIA_CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory?.id === cat.id
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-cream-100 text-coffee-700 hover:bg-cream-200'
                }`}
              >
                {cat.name.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Rastgele Meydan Oku Hızlı Buton */}
        <button
          onClick={() => {
            const randomOpp = MOCK_OPPONENTS[Math.floor(Math.random() * MOCK_OPPONENTS.length)];
            handleStartMatchmaking(randomOpp, selectedCategory);
          }}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-black text-sm sm:text-base shadow-warm flex items-center justify-between gap-3 transition-transform active:scale-98 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span>Rastgele Masaya Meydan Oku!</span>
              <p className="text-xs text-rose-100 font-normal">Kafedeki uygun ilk masayla eşleşin</p>
            </div>
          </div>
          <Swords className="w-5 h-5 group-hover:rotate-45 transition-transform" />
        </button>

        {/* Kafedeki Aktif Masalar Listesi */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-coffee-600 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              Kafedeki Aktif Masalar ({MOCK_OPPONENTS.length})
            </h3>
            <span className="text-[11px] text-coffee-400 font-medium">Canlı Masalar</span>
          </div>

          <div className="space-y-2">
            {MOCK_OPPONENTS.map((opp) => (
              <div
                key={opp.id}
                className="p-3.5 rounded-2xl bg-white border border-coffee-200/80 hover:border-red-400 hover:shadow-warm transition-all flex items-center justify-between gap-3 shadow-warm-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${opp.avatarColor} text-white flex items-center justify-center font-black text-sm shadow-xs`}>
                    {opp.tableLabel.replace('Masa ', 'M')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-coffee-950">
                        {opp.tableLabel}
                      </h4>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        Masada
                      </span>
                    </div>
                    <span className="text-[11px] text-coffee-500">
                      🏆 {opp.winCount} Düello Galibiyeti
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartMatchmaking(opp, selectedCategory)}
                  className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-600 text-red-700 hover:text-white font-bold text-xs border border-red-200 transition-colors flex items-center gap-1.5"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>Meydan Oku</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 2: EŞLEŞME & GERİ SAYIM (VS EKRANI)
  // =========================================================================
  if (stage === 'matchmaking') {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center text-center p-6 space-y-6 animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-xs">
          {/* Siz */}
          <div className="flex-1 p-4 rounded-3xl bg-white border border-coffee-200 shadow-warm text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-terracotta-600 text-white flex items-center justify-center font-black text-lg shadow-warm">
              {currentTableLabel.replace('Masa ', 'M')}
            </div>
            <div className="font-bold text-xs text-coffee-900">{currentTableLabel}</div>
            <span className="text-[10px] text-terracotta-600 font-extrabold uppercase">Siz</span>
          </div>

          <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-warm shrink-0 animate-pulse">
            VS
          </div>

          {/* Rakip */}
          <div className="flex-1 p-4 rounded-3xl bg-white border border-coffee-200 shadow-warm text-center space-y-2">
            <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${selectedOpponent.avatarColor} text-white flex items-center justify-center font-black text-lg shadow-warm`}>
              {selectedOpponent.tableLabel.replace('Masa ', 'M')}
            </div>
            <div className="font-bold text-xs text-coffee-900">{selectedOpponent.tableLabel}</div>
            <span className="text-[10px] text-coffee-500 font-extrabold uppercase">Rakip</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-red-600 text-white mx-auto flex items-center justify-center text-3xl font-black shadow-warm animate-bounce">
            {matchmakingCountdown}
          </div>
          <h3 className="font-serif font-black text-xl text-coffee-950">
            Meydan Okuma Kabul Edildi!
          </h3>
          <p className="text-xs text-coffee-600">
            {selectedCategory ? `${selectedCategory.name} alanında yarışacaksınız.` : 'Karışık kategoride düello başlıyor!'}
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 3: CANLI DÜELLO SAHASI (VS ARENA)
  // =========================================================================
  if (stage === 'duel-arena') {
    const currentQuestion = questions[currentQIndex];
    const totalScore = myScore + opponentScore || 1;
    const myScorePercent = Math.max(15, Math.min(85, (myScore / totalScore) * 100));

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* VS Karşılaşma Skor Tablosu */}
        <div className="bg-white rounded-3xl p-4 border border-coffee-200/80 shadow-warm space-y-3">
          <div className="flex items-center justify-between">
            {/* Benim Masam */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-terracotta-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentTableLabel.replace('Masa ', 'M')}
              </div>
              <div className="text-left">
                <span className="block font-bold text-xs text-coffee-950">{currentTableLabel} (Siz)</span>
                <span className="font-mono font-black text-lg text-terracotta-700">{myScore} P</span>
              </div>
            </div>

            <div className="text-center px-2">
              <span className="text-[10px] font-extrabold text-coffee-400 uppercase tracking-widest block">
                Soru {currentQIndex + 1}/{questions.length}
              </span>
              <div className="flex items-center gap-1 text-xs font-mono font-bold text-red-600">
                <Clock className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            {/* Rakip Masa */}
            <div className="flex items-center gap-2.5 text-right">
              <div>
                <span className="block font-bold text-xs text-coffee-950">{selectedOpponent.tableLabel}</span>
                <span className="font-mono font-black text-lg text-blue-700">{opponentScore} P</span>
              </div>
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${selectedOpponent.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                {selectedOpponent.tableLabel.replace('Masa ', 'M')}
              </div>
            </div>
          </div>

          {/* Canlı Skor Dengesi Çubuğu (Tug of War) */}
          <div className="space-y-1">
            <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden flex">
              <div 
                className="bg-terracotta-600 h-full transition-all duration-500 rounded-l-full"
                style={{ width: `${myScore === 0 && opponentScore === 0 ? 50 : myScorePercent}%` }}
              />
              <div 
                className="bg-blue-600 h-full transition-all duration-500 flex-1 rounded-r-full"
              />
            </div>
          </div>

          {/* Rakibin Yanıt Durumu Bildirimi */}
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-coffee-100">
            <span className="text-coffee-600 font-medium">
              {isAnswered ? '✅ Siz yanıtladınız' : '⏳ Sıra sizde'}
            </span>
            <span className="font-medium">
              {opponentAnswered ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {selectedOpponent.tableLabel} yanıtladı!
                </span>
              ) : (
                <span className="text-coffee-400 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-coffee-400 animate-pulse" />
                  {selectedOpponent.tableLabel} düşünüyor...
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Soru Kartı */}
        <div className="p-5 rounded-3xl bg-white border border-coffee-200/80 shadow-warm text-left space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500 bg-cream-100 px-2.5 py-0.5 rounded-md">
            {currentQuestion.categoryName}
          </span>
          <h2 className="font-serif font-black text-lg sm:text-xl text-coffee-950 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 4 Şık */}
        <div className="grid grid-cols-1 gap-2.5">
          {currentQuestion.options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isCorrect = idx === currentQuestion.correctIndex;
            const isSelected = selectedOption === idx;

            let btnStyle = 'bg-white border-coffee-200 text-coffee-900 hover:border-red-300';
            let badgeStyle = 'bg-cream-100 text-coffee-800';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/30';
                badgeStyle = 'bg-emerald-500 text-white';
              } else if (isSelected) {
                btnStyle = 'bg-red-50 border-red-500 text-red-950 ring-2 ring-red-500/30';
                badgeStyle = 'bg-red-500 text-white';
              } else {
                btnStyle = 'bg-cream-50/50 border-coffee-100 text-coffee-400 opacity-60';
                badgeStyle = 'bg-cream-200 text-coffee-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-warm-sm active:scale-[0.99] ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 ${badgeStyle}`}>
                    {letter}
                  </span>
                  <span className="font-semibold text-sm sm:text-base leading-snug">
                    {opt}
                  </span>
                </div>

                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Cevap Sonrası Düello Durum Paneli */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-cream-100 border border-coffee-200 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className={selectedOption === currentQuestion.correctIndex ? 'text-emerald-700' : 'text-red-700'}>
                {selectedOption === currentQuestion.correctIndex ? `Siz: Doğru (+${myEarnedPoints}P)` : 'Siz: Yanlış (0P)'}
              </span>
              <span className={opponentIsCorrect ? 'text-blue-700' : 'text-coffee-600'}>
                {opponentIsCorrect ? `${selectedOpponent.tableLabel}: Doğru (+${opponentEarnedPoints}P)` : `${selectedOpponent.tableLabel}: Yanlış (0P)`}
              </span>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-warm flex items-center justify-center gap-2 transition-colors"
            >
              <span>{currentQIndex + 1 < questions.length ? 'Sonraki Düello Sorusu' : 'Düello Sonucunu Gör'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER 4: DÜELLO ZAFER / MAĞLUBİYET EKRANI
  // =========================================================================
  const winner = getWinner();
  const isMeWinner = winner === 'me';
  const isDraw = winner === 'draw';

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className={`p-6 rounded-3xl text-center space-y-3 shadow-warm border ${
        isMeWinner 
          ? 'bg-gradient-to-br from-amber-500 via-red-600 to-rose-700 text-white border-amber-300' 
          : isDraw
          ? 'bg-gradient-to-br from-coffee-700 to-coffee-900 text-white border-coffee-500'
          : 'bg-white border-coffee-200/80 text-coffee-950'
      }`}>
        <div className={`w-18 h-18 rounded-3xl mx-auto flex items-center justify-center shadow-warm ${
          isMeWinner ? 'bg-white/20 text-white' : isDraw ? 'bg-white/20 text-white' : 'bg-red-100 text-red-600'
        }`}>
          {isMeWinner ? (
            <Crown className="w-10 h-10 text-amber-200 animate-bounce" />
          ) : isDraw ? (
            <Shield className="w-10 h-10 text-cream-200" />
          ) : (
            <Swords className="w-10 h-10" />
          )}
        </div>

        <div className="space-y-1">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
            isMeWinner ? 'bg-white/25 text-white' : 'bg-cream-100 text-coffee-700'
          }`}>
            Düello Bitti
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl">
            {isMeWinner ? '⚔️ DÜELLO ZAFERİ!' : isDraw ? '🤝 BERABERLİK!' : 'DOSTANE MÜCADELE!'}
          </h2>
          <p className={`text-xs ${isMeWinner || isDraw ? 'text-cream-100' : 'text-coffee-600'}`}>
            {isMeWinner 
              ? `${selectedOpponent.tableLabel} karşısında galip geldiniz!` 
              : isDraw 
              ? 'İki masa da harika yarıştı, yenişemediniz.'
              : `${selectedOpponent.tableLabel} bu turda daha hızlıydı.`}
          </p>
        </div>

        {/* Skor Karşılaştırma Kutusu */}
        <div className={`p-4 rounded-2xl flex items-center justify-around ${
          isMeWinner || isDraw ? 'bg-black/15 text-white' : 'bg-cream-100 text-coffee-900'
        }`}>
          <div className="text-center">
            <div className="text-[11px] opacity-75 font-medium">{currentTableLabel} (Siz)</div>
            <div className="font-serif font-black text-3xl">{myScore}</div>
            <span className="text-[10px] opacity-75">{myCorrect}/{questions.length} Doğru</span>
          </div>
          <div className="text-xl font-black opacity-30">VS</div>
          <div className="text-center">
            <div className="text-[11px] opacity-75 font-medium">{selectedOpponent.tableLabel}</div>
            <div className="font-serif font-black text-3xl">{opponentScore}</div>
            <span className="text-[10px] opacity-75">{opponentCorrect}/{questions.length} Doğru</span>
          </div>
        </div>

        {isMeWinner && (
          <div className="p-3 rounded-xl bg-white/20 text-white text-xs font-semibold backdrop-blur-xs flex items-center justify-center gap-2">
            <Coffee className="w-4 h-4 text-amber-200 shrink-0" />
            <span>Masanız düelloyu kazandı! Karşı masaya dostça bir fincan kahve jesti yapabilirsiniz!</span>
          </div>
        )}
      </div>

      {/* Aksiyon Butonları */}
      <div className="pt-1 space-y-2">
        <button
          onClick={() => handleStartMatchmaking(selectedOpponent, selectedCategory)}
          className="w-full py-3.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Aynı Masaya Rövanş Teklif Et</span>
        </button>

        <button
          onClick={() => setStage('lobby')}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-cream-100 border border-coffee-200 text-coffee-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-warm-sm"
        >
          <Swords className="w-4 h-4 text-red-600" />
          <span>Farklı Bir Masaya Meydan Oku</span>
        </button>

        <button
          onClick={onFinishGame}
          className="w-full py-2.5 text-center text-xs font-semibold text-coffee-500 hover:text-coffee-800 transition-colors"
        >
          Masa Menüsüne Dön
        </button>
      </div>
    </div>
  );
};
