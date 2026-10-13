import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Check, 
  X, 
  FastForward, 
  Play, 
  Timer, 
  ChevronRight,
  Flag,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { CLASSIC_TABOO_CARDS, type ClassicTabooCard } from '../../data/classicTabooWords';

interface KlasikTabuGameProps {
  onFinishGame?: () => void;
}

export const KlasikTabuGame: React.FC<KlasikTabuGameProps> = ({ onFinishGame }) => {
  const [teamAName, setTeamAName] = useState('A Takımı');
  const [teamBName, setTeamBName] = useState('B Takımı');
  const [targetScore, setTargetScore] = useState(15);
  const [turnDuration, setTurnDuration] = useState(60);

  // Phases: 'setup' -> 'round_ready' -> 'in_turn' -> 'round_summary' -> 'game_over'
  const [phase, setPhase] = useState<'setup' | 'round_ready' | 'in_turn' | 'round_summary' | 'game_over'>('setup');

  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A');
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);

  // Turn runtime stats
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [deck, setDeck] = useState<ClassicTabooCard[]>([]);
  const [remainingPasses, setRemainingPasses] = useState(3);
  const [turnTimeLeft, setTurnTimeLeft] = useState(60);
  const [turnStats, setTurnStats] = useState({ correct: 0, taboo: 0, passed: 0 });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Shuffle deck
  const shuffleDeck = () => {
    return [...CLASSIC_TABOO_CARDS].sort(() => 0.5 - Math.random());
  };

  // Start the entire match
  const handleStartGame = () => {
    setTeamAScore(0);
    setTeamBScore(0);
    setCurrentTeam('A');
    setDeck(shuffleDeck());
    setCurrentCardIndex(0);
    setPhase('round_ready');
  };

  // Start turn timer
  const handleStartTurn = () => {
    setRemainingPasses(3);
    setTurnTimeLeft(turnDuration);
    setTurnStats({ correct: 0, taboo: 0, passed: 0 });
    setPhase('in_turn');

    const startTime = Date.now();
    const durationMs = turnDuration * 1000;

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const left = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
      setTurnTimeLeft(left);

      if (left <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        endTurn();
      }
    }, 200);
  };

  // End turn & calculate scores
  const endTurn = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    setPhase((prevPhase) => {
      if (prevPhase === 'in_turn') {
        return 'round_summary';
      }
      return prevPhase;
    });
  };

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Card Controls
  const handleNextCard = () => {
    if (currentCardIndex + 1 < deck.length) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      // reshuffle if deck is exhausted
      setDeck(shuffleDeck());
      setCurrentCardIndex(0);
    }
  };

  const handleCorrect = () => {
    if (currentTeam === 'A') {
      setTeamAScore((prev) => prev + 1);
    } else {
      setTeamBScore((prev) => prev + 1);
    }
    setTurnStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
    handleNextCard();
  };

  const handleTaboo = () => {
    if (currentTeam === 'A') {
      setTeamAScore((prev) => Math.max(0, prev - 1));
    } else {
      setTeamBScore((prev) => Math.max(0, prev - 1));
    }
    setTurnStats((prev) => ({ ...prev, taboo: prev.taboo + 1 }));
    handleNextCard();
  };

  const handlePass = () => {
    if (remainingPasses <= 0) return;
    setRemainingPasses((prev) => prev - 1);
    setTurnStats((prev) => ({ ...prev, passed: prev.passed + 1 }));
    handleNextCard();
  };

  // Advance to next team round or end match
  const handleNextRoundFromSummary = () => {
    // Check if target score is reached
    if (teamAScore >= targetScore || teamBScore >= targetScore) {
      setPhase('game_over');
      return;
    }

    setCurrentTeam((prev) => (prev === 'A' ? 'B' : 'A'));
    setPhase('round_ready');
  };

  const currentCard = deck[currentCardIndex] || CLASSIC_TABOO_CARDS[0];
  const activeTeamName = currentTeam === 'A' ? teamAName : teamBName;
  const winnerName = teamAScore >= targetScore ? teamAName : teamBName;

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* ============================================================== */}
      {/* 1. SETUP PHASE */}
      {/* ============================================================== */}
      {phase === 'setup' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-5">
          <div className="text-center space-y-1.5">
            <div className="w-16 h-16 rounded-2xl bg-rose-600 text-cream-50 flex items-center justify-center mx-auto shadow-warm">
              <Flag className="w-8 h-8 fill-cream-50" />
            </div>
            <h2 className="font-serif font-black text-2xl text-coffee-950">
              Klasik Tabu
            </h2>
            <p className="text-xs text-coffee-700 leading-relaxed max-w-xs mx-auto">
              Yasaklı 5 kelimeyi kullanmadan takımına ana kelimeyi anlat! 100+ zengin kart ve klasik kurallar.
            </p>
          </div>

          {/* Team Name Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-cream-50 border border-coffee-300 space-y-1">
              <span className="text-[10px] font-bold text-coffee-600 uppercase block">1. Takım</span>
              <input
                type="text"
                value={teamAName}
                onChange={(e) => setTeamAName(e.target.value)}
                maxLength={15}
                className="w-full bg-white px-2.5 py-1.5 rounded-xl border border-coffee-200 text-xs font-bold text-coffee-950 focus:outline-none focus:border-terracotta-600"
              />
            </div>
            <div className="p-3.5 rounded-2xl bg-cream-50 border border-coffee-300 space-y-1">
              <span className="text-[10px] font-bold text-coffee-600 uppercase block">2. Takım</span>
              <input
                type="text"
                value={teamBName}
                onChange={(e) => setTeamBName(e.target.value)}
                maxLength={15}
                className="w-full bg-white px-2.5 py-1.5 rounded-xl border border-coffee-200 text-xs font-bold text-coffee-950 focus:outline-none focus:border-terracotta-600"
              />
            </div>
          </div>

          {/* Target Score Selection */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-2">
            <span className="text-xs font-bold text-coffee-950 block">Hedef Kazanma Puanı:</span>
            <div className="grid grid-cols-3 gap-2">
              {[10, 15, 25].map((pts) => (
                <button
                  key={pts}
                  type="button"
                  onClick={() => setTargetScore(pts)}
                  className={`py-2 rounded-xl text-xs font-black transition-all border ${
                    targetScore === pts
                      ? 'bg-coffee-950 text-white border-coffee-950 shadow-warm-sm'
                      : 'bg-white text-coffee-800 border-coffee-300 hover:bg-cream-100'
                  }`}
                >
                  {pts} Puan
                </button>
              ))}
            </div>
          </div>

          {/* Turn Duration Selection */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-2">
            <span className="text-xs font-bold text-coffee-950 block">Tur Başına Süre:</span>
            <div className="grid grid-cols-2 gap-2">
              {[60, 90].map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setTurnDuration(sec)}
                  className={`py-2 rounded-xl text-xs font-black transition-all border ${
                    turnDuration === sec
                      ? 'bg-coffee-950 text-white border-coffee-950 shadow-warm-sm'
                      : 'bg-white text-coffee-800 border-coffee-300 hover:bg-cream-100'
                  }`}
                >
                  {sec} Saniye
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full btn-primary !py-4 text-sm font-black flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-cream-50" />
            <span>Tabu Maçını Başlat</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>

          {onFinishGame && (
            <button
              type="button"
              onClick={onFinishGame}
              className="w-full py-2.5 rounded-xl border border-coffee-200 text-xs font-bold text-coffee-700 hover:text-coffee-950 hover:bg-cream-100 flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Geri Dön (Oyun Seçimi)</span>
            </button>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. ROUND READY PHASE (Takım Değişimi & Hazırlık) */}
      {/* ============================================================== */}
      {phase === 'round_ready' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-6 text-center">
          {/* Live Scoreboard */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-cream-100 border border-coffee-300">
            <div className={`p-3 rounded-xl border text-center transition-all ${
              currentTeam === 'A' ? 'bg-white border-terracotta-500 shadow-warm-sm' : 'border-coffee-200 opacity-70'
            }`}>
              <span className="text-[10px] font-bold text-coffee-600 uppercase block">{teamAName}</span>
              <span className="font-serif font-black text-2xl text-terracotta-700">{teamAScore}</span>
            </div>
            <div className={`p-3 rounded-xl border text-center transition-all ${
              currentTeam === 'B' ? 'bg-white border-terracotta-500 shadow-warm-sm' : 'border-coffee-200 opacity-70'
            }`}>
              <span className="text-[10px] font-bold text-coffee-600 uppercase block">{teamBName}</span>
              <span className="font-serif font-black text-2xl text-terracotta-700">{teamBScore}</span>
            </div>
          </div>

          <div className="space-y-2 py-4">
            <span className="text-xs font-bold text-terracotta-600 uppercase tracking-widest block">
              Sıradaki Anlatıcı Takım
            </span>
            <h2 className="font-serif font-black text-3xl text-coffee-950">
              {activeTeamName}
            </h2>
            <p className="text-xs text-coffee-600 max-w-xs mx-auto">
              Telefonu takımının anlatıcısı eline alsın. Karşı takımdan biri yasaklı kelimeleri denetlemek için ekrana baksın!
            </p>
          </div>

          <button
            onClick={handleStartTurn}
            className="w-full btn-primary !py-4 text-sm font-black flex items-center justify-center gap-2"
          >
            <Timer className="w-5 h-5" />
            <span>Turu Başlat ({turnDuration} Saniye)</span>
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. IN TURN (Oyun Sırasında Tabu Kartı & Kontroller) */}
      {/* ============================================================== */}
      {phase === 'in_turn' && (
        <div className="space-y-3">
          {/* Header Status Bar */}
          <div className="p-3.5 rounded-2xl bg-coffee-950 text-white flex items-center justify-between border-2 border-coffee-950 shadow-warm-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-xs">{activeTeamName} Anlatıyor</span>
            </div>

            {/* Turn Timer */}
            <div className="flex items-center gap-1.5 font-mono font-black text-lg text-caramel-300">
              <Timer className="w-4 h-4 text-caramel-400" />
              <span>{turnTimeLeft}s</span>
            </div>

            <span className="text-[11px] font-bold text-cream-300">
              Pas: {remainingPasses}
            </span>
          </div>

          {/* Main Taboo Card */}
          <div className="p-4 sm:p-6 rounded-3xl sm:rounded-4xl bg-white border-3 border-coffee-950 shadow-print text-center space-y-3 sm:space-y-4 relative overflow-hidden">
            {currentCard.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500 bg-cream-100 px-3 py-0.5 rounded-full border border-coffee-200 inline-block">
                {currentCard.category}
              </span>
            )}

            {/* TARGET WORD */}
            <div className="py-1 sm:py-2">
              <span className="text-[10px] uppercase font-bold text-terracotta-600 tracking-widest block mb-1">
                Anlatılacak Kelime:
              </span>
              <h1 className="font-serif font-black text-2xl sm:text-4xl text-coffee-950 tracking-wide">
                {currentCard.word}
              </h1>
            </div>

            {/* TABOO FORBIDDEN WORDS */}
            <div className="p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-rose-50 border-2 border-rose-200 space-y-1.5 sm:space-y-2.5">
              <span className="text-[10px] font-black uppercase text-rose-700 tracking-widest flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Yasaklı Kelimeler
              </span>
              <div className="space-y-1 sm:space-y-1.5">
                {currentCard.tabooWords.map((taboo) => (
                  <div
                    key={taboo}
                    className="py-1 sm:py-1.5 px-3 rounded-xl bg-white border border-rose-300 text-xs font-bold text-rose-950 shadow-warm-sm"
                  >
                    {taboo}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 pt-1">
            <button
              onClick={handleTaboo}
              className="py-3 sm:py-4 px-2 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-warm transition-transform"
            >
              <X className="w-5 sm:w-6 h-5 sm:h-6" />
              <span>Tabu! (-1)</span>
            </button>

            <button
              onClick={handlePass}
              disabled={remainingPasses <= 0}
              className={`py-3 sm:py-4 px-2 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1 border transition-all ${
                remainingPasses > 0
                  ? 'bg-cream-200 hover:bg-cream-300 text-coffee-800 border-coffee-300 active:scale-95'
                  : 'bg-coffee-100 text-coffee-400 border-coffee-200 cursor-not-allowed'
              }`}
            >
              <FastForward className="w-5 sm:w-6 h-5 sm:h-6" />
              <span>Pas ({remainingPasses})</span>
            </button>

            <button
              onClick={handleCorrect}
              className="py-3 sm:py-4 px-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs flex flex-col items-center justify-center gap-1 shadow-warm transition-transform"
            >
              <Check className="w-5 sm:w-6 h-5 sm:h-6" />
              <span>Doğru! (+1)</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. ROUND SUMMARY PHASE */}
      {/* ============================================================== */}
      {phase === 'round_summary' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-terracotta-600 uppercase tracking-wider block">
              Süre Bitti
            </span>
            <h2 className="font-serif font-black text-2xl text-coffee-950">
              {activeTeamName} Tur Özeti
            </h2>
          </div>

          {/* Turn Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Doğru</span>
              <span className="font-serif font-black text-xl text-emerald-950">+{turnStats.correct}</span>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Tabu</span>
              <span className="font-serif font-black text-xl text-rose-950">-{turnStats.taboo}</span>
            </div>
            <div className="p-3 rounded-2xl bg-cream-100 border border-coffee-200 text-center">
              <span className="text-[10px] font-bold text-coffee-600 uppercase block">Pas</span>
              <span className="font-serif font-black text-xl text-coffee-950">{turnStats.passed}</span>
            </div>
          </div>

          {/* Total Scores */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-2">
            <span className="text-xs font-bold text-coffee-900 block">Genel Skor Tablosu (Hedef: {targetScore})</span>
            <div className="flex items-center justify-around font-serif font-black text-lg">
              <div className="text-coffee-950">
                <span className="block text-xs font-normal text-coffee-600">{teamAName}</span>
                <span>{teamAScore} Puan</span>
              </div>
              <span className="text-coffee-300">vs</span>
              <div className="text-coffee-950">
                <span className="block text-xs font-normal text-coffee-600">{teamBName}</span>
                <span>{teamBScore} Puan</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleNextRoundFromSummary}
            className="w-full btn-primary !py-4 text-xs font-black flex items-center justify-center gap-2"
          >
            <span>
              {teamAScore >= targetScore || teamBScore >= targetScore
                ? 'Şampiyonu Gör'
                : 'Sıradaki Takıma Geç'}
            </span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. GAME OVER & CHAMPION CELEBRATION */}
      {/* ============================================================== */}
      {phase === 'game_over' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-6 text-center">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-warm">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-black text-3xl text-coffee-950">
              Şampiyon: {winnerName}!
            </h2>
            <p className="text-xs text-coffee-700">
              Harika takım oyunu ve kelime ustalığıyla {targetScore} puan barajını ilk aşan taraf oldu!
            </p>
          </div>

          {/* Final Score Board */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 flex items-center justify-around font-serif font-black text-xl">
            <div>
              <span className="block text-xs font-normal text-coffee-600">{teamAName}</span>
              <span className={teamAScore >= targetScore ? 'text-amber-600' : 'text-coffee-900'}>
                {teamAScore} Puan
              </span>
            </div>
            <span className="text-coffee-300">-</span>
            <div>
              <span className="block text-xs font-normal text-coffee-600">{teamBName}</span>
              <span className={teamBScore >= targetScore ? 'text-amber-600' : 'text-coffee-900'}>
                {teamBScore} Puan
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={handleStartGame}
                className="flex-1 btn-primary !py-3.5 text-xs font-black flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Rövanş Maçı</span>
              </button>
              <button
                onClick={() => setPhase('setup')}
                className="px-4 py-3.5 rounded-2xl bg-cream-200 hover:bg-cream-300 text-coffee-900 font-bold text-xs"
              >
                Ayarlar
              </button>
            </div>
            {onFinishGame && (
              <button
                onClick={onFinishGame}
                className="w-full py-2.5 text-[11px] font-bold text-coffee-600 hover:text-coffee-950 text-center"
              >
                Oyunu Tamamla & Masaya Dön
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
