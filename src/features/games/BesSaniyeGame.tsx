import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  RotateCcw, 
  Check, 
  X, 
  Users, 
  Trophy, 
  Play, 
  ChevronRight,
  UserPlus,
  Trash2,
  Zap
} from 'lucide-react';
import { FIVE_SECONDS_PROMPTS, type FiveSecondsPrompt } from '../../data/fiveSecondsPrompts';

interface BesSaniyeGameProps {
  onFinishGame?: () => void;
}

export const BesSaniyeGame: React.FC<BesSaniyeGameProps> = ({ onFinishGame }) => {
  const [players, setPlayers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fincan_table_players');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      }
    } catch {
      // fallback
    }
    return ['Ali', 'Zeynep', 'Mert'];
  });

  const [newPlayerName, setNewPlayerName] = useState('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [targetScore, setTargetScore] = useState(5);

  // Phases: 'setup' -> 'playing' -> 'game_over'
  const [phase, setPhase] = useState<'setup' | 'playing' | 'game_over'>('setup');

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentPrompt, setCurrentPrompt] = useState<FiveSecondsPrompt | null>(null);
  const [usedPromptIds, setUsedPromptIds] = useState<Set<string>>(new Set());

  // Timer states
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Player Management
  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPlayerName.trim();
    if (clean && !players.includes(clean)) {
      const updated = [...players, clean];
      setPlayers(updated);
      try {
        localStorage.setItem('fincan_table_players', JSON.stringify(updated));
      } catch {
        // ignore
      }
      setNewPlayerName('');
    }
  };

  const handleRemovePlayer = (name: string) => {
    if (players.length <= 2) return;
    const updated = players.filter((p) => p !== name);
    setPlayers(updated);
    try {
      localStorage.setItem('fincan_table_players', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Pick a fresh prompt
  const pickNewPrompt = (usedSet: Set<string>): FiveSecondsPrompt => {
    let available = FIVE_SECONDS_PROMPTS.filter((p) => !usedSet.has(p.id));
    if (available.length === 0) {
      available = FIVE_SECONDS_PROMPTS;
      usedSet.clear();
    }
    const random = available[Math.floor(Math.random() * available.length)];
    usedSet.add(random.id);
    return random;
  };

  // Start the Game
  const handleStartGame = () => {
    if (players.length < 2) return;

    const initialScores: Record<string, number> = {};
    players.forEach((p) => (initialScores[p] = 0));
    setScores(initialScores);

    const freshUsed = new Set<string>();
    const prompt = pickNewPrompt(freshUsed);
    setUsedPromptIds(freshUsed);
    setCurrentPrompt(prompt);

    setCurrentPlayerIndex(0);
    setTimeLeft(5.0);
    setIsTimerRunning(false);
    setTimerFinished(false);
    setPhase('playing');
  };

  // Start the 5-second countdown
  const handleStartTimer = () => {
    if (isTimerRunning || timerFinished) return;

    setTimeLeft(5.0);
    setIsTimerRunning(true);
    setTimerFinished(false);

    const startTime = Date.now();
    const duration = 5000;

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, (duration - elapsed) / 1000);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        setIsTimerRunning(false);
        setTimerFinished(true);
      }
    }, 50);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  // Submit Turn Result
  const handleRoundResult = (success: boolean) => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);

    const currentPlayer = players[currentPlayerIndex];
    const newScore = (scores[currentPlayer] || 0) + (success ? 1 : 0);
    const updatedScores = { ...scores, [currentPlayer]: newScore };
    setScores(updatedScores);

    // Check game over
    if (newScore >= targetScore) {
      setPhase('game_over');
      return;
    }

    // Advance to next player
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    setCurrentPlayerIndex(nextPlayerIndex);

    const prompt = pickNewPrompt(usedPromptIds);
    setCurrentPrompt(prompt);

    setTimeLeft(5.0);
    setIsTimerRunning(false);
    setTimerFinished(false);
  };

  const currentPlayer = players[currentPlayerIndex];
  const winner = Object.entries(scores).find(([, score]) => score >= targetScore)?.[0];

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* ============================================================== */}
      {/* 1. SETUP PHASE */}
      {/* ============================================================== */}
      {phase === 'setup' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-5">
          <div className="text-center space-y-1.5">
            <div className="w-16 h-16 rounded-2xl bg-terracotta-600 text-cream-50 flex items-center justify-center mx-auto shadow-warm">
              <Zap className="w-8 h-8 fill-cream-50" />
            </div>
            <h2 className="font-serif font-black text-2xl text-coffee-950">
              5 Saniye Kuralı
            </h2>
            <p className="text-xs text-coffee-700 leading-relaxed max-w-xs mx-auto">
              5 saniye içinde 3 şey sayabilir misin? Süre akarken beynin donacak, ağzından en komik cevaplar dökülecek!
            </p>
          </div>

          {/* Players Management */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-coffee-900">
              <span>Masadaki Yarışmacılar ({players.length})</span>
              <span className="text-[11px] text-coffee-500 font-normal">Min 2 oyuncu</span>
            </div>

            <form onSubmit={handleAddPlayer} className="flex gap-2">
              <input
                type="text"
                placeholder="Yarışmacı adı..."
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                maxLength={15}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-coffee-300 text-xs text-coffee-950 focus:outline-none focus:border-terracotta-600 bg-cream-50/50"
              />
              <button
                type="submit"
                disabled={!newPlayerName.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1 shrink-0"
              >
                <UserPlus className="w-4 h-4" />
                <span>Ekle</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
              {players.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 border border-coffee-200 text-xs font-bold text-coffee-900"
                >
                  <Users className="w-3.5 h-3.5 text-coffee-600" />
                  {name}
                  {players.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePlayer(name)}
                      className="text-coffee-400 hover:text-rose-600 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Target Score Setting */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-2">
            <span className="text-xs font-bold text-coffee-950 block">Hedef Kazanma Puanı:</span>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 7].map((pts) => (
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

          <button
            onClick={handleStartGame}
            disabled={players.length < 2}
            className="w-full btn-primary !py-4 text-sm font-black flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-cream-50" />
            <span>Oyunu Başlat ⏱️</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PLAYING PHASE */}
      {/* ============================================================== */}
      {phase === 'playing' && currentPrompt && (
        <div className="space-y-4">
          {/* Active Turn & Score Header */}
          <div className="p-4 rounded-3xl bg-white border-2 border-coffee-950 shadow-print-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center font-black text-sm border border-terracotta-200">
                {currentPlayer.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-coffee-500 font-bold block">
                  Sıradaki Yarışmacı
                </span>
                <span className="font-serif font-black text-lg text-coffee-950">
                  {currentPlayer}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-coffee-500 block font-bold">Puanı</span>
              <span className="font-black text-lg text-terracotta-600">
                {scores[currentPlayer] || 0} / {targetScore}
              </span>
            </div>
          </div>

          {/* Main Question & Timer Card */}
          <div className="p-6 rounded-4xl bg-white border-3 border-coffee-950 shadow-print text-center space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cream-100 text-coffee-700 border border-coffee-200 inline-block">
              {currentPrompt.category}
            </span>

            <div className="space-y-2">
              <span className="text-xs font-black text-terracotta-600 uppercase tracking-widest block">
                5 Saniyede 3 Tane Say:
              </span>
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-coffee-950 leading-tight">
                {currentPrompt.prompt}
              </h2>
            </div>

            {/* Circular / Big Timer Display */}
            <div className="flex flex-col items-center justify-center py-2">
              <div
                className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center transition-all ${
                  isTimerRunning
                    ? timeLeft <= 2.0
                      ? 'border-rose-600 bg-rose-50 text-rose-600 scale-105 animate-pulse'
                      : 'border-amber-500 bg-amber-50 text-amber-700'
                    : timerFinished
                    ? 'border-rose-600 bg-rose-100 text-rose-700'
                    : 'border-coffee-300 bg-cream-50 text-coffee-900'
                }`}
              >
                <span className="font-mono font-black text-4xl">
                  {timeLeft.toFixed(1)}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Saniye
                </span>
              </div>
            </div>

            {/* Controls */}
            {!isTimerRunning && !timerFinished && (
              <button
                onClick={handleStartTimer}
                className="w-full btn-primary !py-4 text-sm font-black flex items-center justify-center gap-2"
              >
                <Timer className="w-5 h-5" />
                <span>Süreyi Başlat (5 Saniye) 🚀</span>
              </button>
            )}

            {(isTimerRunning || timerFinished) && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-coffee-600 block">
                  3 tane sayabildi mi? Masadakiler onaylasın:
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleRoundResult(true)}
                    className="p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-warm"
                  >
                    <Check className="w-5 h-5" />
                    <span>Başardı (+1 Puan)</span>
                  </button>
                  <button
                    onClick={() => handleRoundResult(false)}
                    className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-warm"
                  >
                    <X className="w-5 h-5" />
                    <span>Yandı / Olmadı ❌</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Scoreboard at Bottom */}
          <div className="p-4 rounded-3xl bg-cream-100 border border-coffee-200">
            <span className="text-[11px] font-bold text-coffee-600 uppercase tracking-wider block mb-2">
              Masa Puan Durumu (Hedef: {targetScore})
            </span>
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <div
                  key={p}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${
                    p === currentPlayer
                      ? 'bg-white border-terracotta-400 text-terracotta-900 shadow-warm-sm'
                      : 'bg-cream-50 border-coffee-200 text-coffee-800'
                  }`}
                >
                  <span>{p}:</span>
                  <span className="font-black text-terracotta-600">{scores[p] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. GAME OVER & WINNER CELEBRATION */}
      {/* ============================================================== */}
      {phase === 'game_over' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-6 text-center">
          <div className="space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-terracotta-600 text-white flex items-center justify-center mx-auto shadow-warm">
              <Trophy className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-black text-3xl text-coffee-950">
              Şampiyon: {winner}! 🏆
            </h2>
            <p className="text-xs text-coffee-700">
              {winner} nefes kesen refleksleriyle {targetScore} puana ilk ulaşan isim oldu!
            </p>
          </div>

          {/* Score Ranking Table */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-2 text-left">
            <span className="text-xs font-bold text-coffee-900 block">Nihai Sıralama:</span>
            <div className="space-y-1.5">
              {Object.entries(scores)
                .sort(([, a], [, b]) => b - a)
                .map(([name, score], rank) => (
                  <div
                    key={name}
                    className="p-3 rounded-xl bg-white border border-coffee-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full font-black text-[10px] flex items-center justify-center ${
                        rank === 0 ? 'bg-amber-400 text-coffee-950' : 'bg-coffee-200 text-coffee-800'
                      }`}>
                        {rank + 1}
                      </span>
                      <span className="font-bold text-coffee-950">{name}</span>
                    </div>
                    <span className="font-black text-terracotta-600">{score} Puan</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button
                onClick={handleStartGame}
                className="flex-1 btn-primary !py-3.5 text-xs font-black flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tekrar Oyna</span>
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
