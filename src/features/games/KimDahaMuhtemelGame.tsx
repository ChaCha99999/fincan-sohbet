import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  Trash2,
  Check
} from 'lucide-react';
import type { Question } from '../../types';

interface KimDahaMuhtemelGameProps {
  questions: Question[];
  onFinishGame: () => void;
}

export const KimDahaMuhtemelGame: React.FC<KimDahaMuhtemelGameProps> = ({
  questions,
  onFinishGame,
}) => {
  const [players, setPlayers] = useState<string[]>(['Ahmet', 'Zeynep', 'Can']);
  const [newPlayerInput, setNewPlayerInput] = useState<string>('');
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedPlayerForRound, setSelectedPlayerForRound] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex] || questions[0];

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPlayerInput.trim();
    if (clean && !players.includes(clean)) {
      setPlayers([...players, clean]);
      setNewPlayerInput('');
    }
  };

  const handleRemovePlayer = (name: string) => {
    if (players.length <= 2) return;
    setPlayers(players.filter(p => p !== name));
    const nextScores = { ...scores };
    delete nextScores[name];
    setScores(nextScores);
  };

  const handleStartGame = () => {
    if (players.length < 2) return;
    const initialScores: Record<string, number> = {};
    players.forEach(p => initialScores[p] = 0);
    setScores(initialScores);
    setGameStarted(true);
  };

  const handleVotePlayer = (player: string) => {
    setSelectedPlayerForRound(player);
    setScores(prev => ({
      ...prev,
      [player]: (prev[player] || 0) + 1,
    }));
  };

  const handleNextRound = () => {
    setSelectedPlayerForRound(null);
    setCurrentIndex(prev => (prev + 1) % questions.length);
  };

  const handleResetGame = () => {
    const initialScores: Record<string, number> = {};
    players.forEach(p => initialScores[p] = 0);
    setScores(initialScores);
    setSelectedPlayerForRound(null);
    setCurrentIndex(0);
  };

  // STEP 1: PLAYER SETUP SCREEN
  if (!gameStarted) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border border-coffee-200 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-coffee-100 text-coffee-800 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-coffee-950">
            Masadaki Oyuncular
          </h2>
          <p className="text-xs text-coffee-600 max-w-xs mx-auto">
            Aynı telefon üzerinden oynayacaksınız. Masada oturan arkadaşlarınızın isimlerini ekleyin (en az 2 kişi).
          </p>
        </div>

        {/* Player List */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-coffee-600">
            Oyuncu Listesi ({players.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {players.map((player) => (
              <span
                key={player}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cream-100 text-coffee-900 text-xs font-bold border border-coffee-200"
              >
                {player}
                {players.length > 2 && (
                  <button
                    onClick={() => handleRemovePlayer(player)}
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
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-coffee-200 bg-cream-50 text-xs focus:outline-none focus:ring-2 focus:ring-terracotta-500/40"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-coffee-800 hover:bg-coffee-900 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Ekle
          </button>
        </form>

        <button
          onClick={handleStartGame}
          disabled={players.length < 2}
          className="w-full py-3.5 rounded-2xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-warm transition-transform active:scale-98 disabled:opacity-50"
        >
          Oyuna Başla ({players.length} Oyuncu)
        </button>
      </div>
    );
  }

  // STEP 2: ACTIVE GAME PLAY
  return (
    <div className="space-y-6">
      {/* Current Question Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-warm border-2 border-coffee-200 text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coffee-100 text-coffee-800 text-xs font-bold">
          <Users className="w-3.5 h-3.5" />
          Tur #{currentIndex + 1}
        </div>

        <p className="font-serif font-black text-xl sm:text-2xl text-coffee-950 leading-snug">
          "{currentQuestion?.question_text}"
        </p>

        <p className="text-xs text-coffee-600">
          Masadakiler aynı anda parmaklarıyla birini göstersin veya en çok oyu alan kişinin adına dokunun!
        </p>
      </div>

      {/* Player Vote Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-coffee-600 px-1">
          Kimi Seçiyorsunuz?
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          {players.map((player) => {
            const isSelected = selectedPlayerForRound === player;
            return (
              <button
                key={player}
                onClick={() => handleVotePlayer(player)}
                className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'bg-terracotta-50 border-terracotta-600 text-terracotta-900 shadow-warm scale-[1.02]'
                    : 'bg-white hover:bg-cream-100 border-coffee-200 text-coffee-900 shadow-warm-sm'
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm sm:text-base leading-tight">
                    {player}
                  </h4>
                  <span className="text-[11px] text-coffee-500 font-medium">
                    {scores[player] || 0} Oy Aldı
                  </span>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-terracotta-600 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Feedback */}
      {selectedPlayerForRound && (
        <div className="p-3.5 rounded-2xl bg-cream-100 border border-coffee-200 text-center text-xs text-coffee-800 animate-fadeIn">
          Bu turda <strong>{selectedPlayerForRound}</strong> seçildi ve +1 oy kazandı! 🎉
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleNextRound}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-coffee-800 to-coffee-950 hover:from-coffee-900 hover:to-black text-white font-bold text-base shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          Sonraki Tur Sorusu
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>

        <div className="flex items-center justify-between pt-1 text-xs">
          <button
            onClick={handleResetGame}
            className="flex items-center gap-1 text-coffee-600 hover:text-coffee-950 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Puanları Sıfırla
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

      {/* Mini Leaderboard Preview */}
      <div className="p-4 rounded-2xl bg-white border border-coffee-200 shadow-warm-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-coffee-800">
          <Trophy className="w-4 h-4 text-caramel-500" />
          <span>Masa Oy Tablosu</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([name, score], idx) => (
              <span
                key={name}
                className="px-2.5 py-1 rounded-lg bg-cream-100 text-coffee-800 border border-coffee-200/60 font-semibold"
              >
                #{idx + 1} {name}: {score}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};
