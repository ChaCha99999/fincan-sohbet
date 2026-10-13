import React, { useState } from 'react';
import { 
  HeartHandshake, 
  UserPlus, 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  Check, 
  Trash2,
  Sparkles,
  Shuffle,
  Target,
  CheckCircle2
} from 'lucide-react';
import type { Question } from '../../types';

interface NeKadarTaniyoruzGameProps {
  questions: Question[];
  onFinishGame: () => void;
}

export const NeKadarTaniyoruzGame: React.FC<NeKadarTaniyoruzGameProps> = ({
  questions,
  onFinishGame,
}) => {
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
    return ['Elif', 'Burak'];
  });
  const [newPlayerInput, setNewPlayerInput] = useState<string>('');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    return questions.length > 0 ? Math.floor(Math.random() * questions.length) : 0;
  });
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [targetPlayerIndex, setTargetPlayerIndex] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [awardedPlayersThisRound, setAwardedPlayersThisRound] = useState<Set<string>>(new Set());
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);

  const currentQuestion = questions[currentQuestionIndex] || questions[0];
  const targetPlayer = players[targetPlayerIndex] || players[0];

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPlayerInput.trim();
    if (clean && !players.includes(clean)) {
      const updated = [...players, clean];
      setPlayers(updated);
      try {
        localStorage.setItem('fincan_table_players', JSON.stringify(updated));
      } catch {
        // ignore
      }
      setNewPlayerInput('');
    }
  };

  const handleRemovePlayer = (name: string) => {
    if (players.length <= 2) return;
    const updated = players.filter(p => p !== name);
    setPlayers(updated);
    try {
      localStorage.setItem('fincan_table_players', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleStartGame = () => {
    if (players.length < 2) return;
    const initialScores: Record<string, number> = {};
    players.forEach(p => initialScores[p] = 0);
    setScores(initialScores);
    setGameStarted(true);
  };

  const toggleAwardPoint = (player: string) => {
    const nextSet = new Set(awardedPlayersThisRound);
    if (nextSet.has(player)) {
      nextSet.delete(player);
      setScores(prev => ({
        ...prev,
        [player]: Math.max(0, (prev[player] || 0) - 1),
      }));
    } else {
      nextSet.add(player);
      setScores(prev => ({
        ...prev,
        [player]: (prev[player] || 0) + 1,
      }));
    }
    setAwardedPlayersThisRound(nextSet);
  };

  const pickRandomNextQuestion = (currentQId?: string) => {
    const nextSeen = new Set(seenIds);
    if (currentQId) nextSeen.add(currentQId);

    const unseenIndices = questions
      .map((q, idx) => ({ q, idx }))
      .filter(item => !nextSeen.has(item.q.id));

    if (unseenIndices.length > 0) {
      const picked = unseenIndices[Math.floor(Math.random() * unseenIndices.length)];
      setCurrentQuestionIndex(picked.idx);
      setSeenIds(nextSeen);
    } else {
      setSeenIds(currentQId ? new Set([currentQId]) : new Set());
      setCurrentQuestionIndex(Math.floor(Math.random() * questions.length));
    }
  };

  const handleNextTurn = () => {
    setIsAnswerRevealed(false);
    setAwardedPlayersThisRound(new Set());
    setTargetPlayerIndex((targetPlayerIndex + 1) % players.length);
    pickRandomNextQuestion(currentQuestion?.id);
  };

  const handleResetGame = () => {
    const initialScores: Record<string, number> = {};
    players.forEach(p => initialScores[p] = 0);
    setScores(initialScores);
    setAwardedPlayersThisRound(new Set());
    setIsAnswerRevealed(false);
    setTargetPlayerIndex(0);
    setSeenIds(new Set());
    setCurrentQuestionIndex(Math.floor(Math.random() * questions.length));
  };

  // STEP 1: PLAYER SETUP
  if (!gameStarted) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-rose-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-coffee-950">
            Birbirimizi Ne Kadar Tanıyoruz?
          </h2>
          <p className="text-xs text-coffee-600 max-w-xs mx-auto">
            Masadaki arkadaşlarınızı ekleyin. Sırayla biri hakkında soru gelecek, diğerleri onun cevabını tahmin edecek!
          </p>
        </div>

        {/* Players List */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-coffee-600">
            Oyuncular ({players.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {players.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 text-coffee-900 text-xs font-bold border border-coffee-200"
              >
                {p}
                {players.length > 2 && (
                  <button
                    onClick={() => handleRemovePlayer(p)}
                    className="text-coffee-400 hover:text-red-600 p-0.5"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Add Player Input */}
        <form onSubmit={handleAddPlayer} className="flex gap-2">
          <input
            type="text"
            value={newPlayerInput}
            onChange={e => setNewPlayerInput(e.target.value)}
            placeholder="Oyuncu adı yazın..."
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-cream-50 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/40"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Ekle
          </button>
        </form>

        <button
          onClick={handleStartGame}
          disabled={players.length < 2}
          className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-warm transition-transform active:scale-98 disabled:opacity-50"
        >
          Oyuna Başla ({players.length} Oyuncu)
        </button>
      </div>
    );
  }

  // Question customized with target player's name
  const formattedQuestion = currentQuestion?.question_text
    ? currentQuestion.question_text.replace(/Sırası gelen kişinin/gi, `${targetPlayer}'in`)
    : `${targetPlayer} hakkında bir soru`;

  const guesserPlayers = players.filter(p => p !== targetPlayer);

  return (
    <div className="space-y-3.5 sm:space-y-5">
      {/* Target Player Badge */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between shadow-warm-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
              Sıradaki Kişi
            </span>
            <h3 className="font-bold text-sm text-coffee-950">
              {targetPlayer}
            </h3>
          </div>
        </div>
        <span className="text-xs text-coffee-500">
          Masadaki diğerleri tahmin etsin!
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-warm border-2 border-coffee-200 text-center space-y-3">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-100 text-coffee-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            Soru #{seenIds.size + 1}
          </div>
          <button
            onClick={() => pickRandomNextQuestion(currentQuestion?.id)}
            className="text-coffee-600 hover:text-coffee-950 p-1.5 rounded-xl hover:bg-cream-100 transition-colors flex items-center gap-1 text-xs font-bold"
            title="Farklı Soru Getir (Karıştır)"
          >
            <Shuffle className="w-3.5 h-3.5 text-rose-600" />
            <span>Karıştır</span>
          </button>
        </div>

        <p className="font-serif font-bold text-xl sm:text-2xl text-coffee-950 leading-relaxed">
          "{formattedQuestion}"
        </p>

        {!isAnswerRevealed ? (
          <button
            onClick={() => setIsAnswerRevealed(true)}
            className="px-4 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-coffee-800 font-bold text-xs transition-colors"
          >
            {targetPlayer} cevabını açıkladı mı? (Puanlamaya Geç)
          </button>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{targetPlayer} cevabını verdi! Doğru tahmin edenlere aşağıdan +1 puan verin:</span>
          </div>
        )}
      </div>

      {/* Point Assignment (Guessers) */}
      {isAnswerRevealed && (
        <div className="space-y-2 animate-fadeIn">
          <span className="text-xs font-bold uppercase tracking-wider text-coffee-600 px-1">
            Kimin Tahmini Doğruydu? (+1 Puan Ver)
          </span>
          <div className="grid grid-cols-2 gap-2">
            {guesserPlayers.map((player) => {
              const hasPoint = awardedPlayersThisRound.has(player);
              return (
                <button
                  key={player}
                  onClick={() => toggleAwardPoint(player)}
                  className={`p-3.5 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between ${
                    hasPoint
                      ? 'bg-rose-50 border-rose-600 text-rose-950 shadow-warm'
                      : 'bg-white hover:bg-cream-50 border-coffee-200 text-coffee-900 shadow-warm-sm'
                  }`}
                >
                  <span className="font-bold text-sm">{player}</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    hasPoint ? 'bg-rose-600 text-white' : 'bg-coffee-100 text-coffee-400'
                  }`}>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleNextTurn}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-base shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          Sonraki Oyuncuya Geç
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>

        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            onClick={handleResetGame}
            className="flex items-center gap-1 text-coffee-600 hover:text-coffee-950 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sıfırla
          </button>
          <button
            onClick={() => setGameStarted(false)}
            className="text-coffee-600 hover:text-coffee-950 font-medium"
          >
            Oyuncuları Düzenle
          </button>
          <button
            onClick={onFinishGame}
            className="font-bold text-terracotta-700 hover:underline"
          >
            Oyunu Bitir
          </button>
        </div>
      </div>

      {/* Mini Leaderboard */}
      <div className="p-4 rounded-2xl bg-white border border-coffee-200 shadow-warm-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-coffee-800">
          <Trophy className="w-4 h-4 text-caramel-500" />
          <span>Skor Tablosu (Doğru Tahminler)</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([name, score], idx) => (
              <span
                key={name}
                className="px-2.5 py-1 rounded-lg bg-cream-100 text-coffee-800 border border-coffee-200/60 font-semibold"
              >
                #{idx + 1} {name}: {score} Puan
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};
