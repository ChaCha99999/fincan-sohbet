import React, { useState, useEffect } from 'react';
import { 
  Users, 
  EyeOff, 
  UserPlus, 
  Trash2, 
  ChevronRight, 
  RotateCcw, 
  ShieldAlert, 
  Sparkles, 
  Trophy,
  Skull,
  UserCheck,
  Lock,
  Search,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { UNDERCOVER_WORD_PAIRS, type UndercoverWordPair } from '../../data/undercoverWords';

export interface PlayerRole {
  name: string;
  role: 'civilian' | 'undercover' | 'mr_white';
  word: string;
  isAlive: boolean;
}

export const MasadakiCasusGame: React.FC<{ onFinishGame?: () => void }> = ({ onFinishGame }) => {
  const [players, setPlayers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fincan_table_players');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
      }
    } catch {
      // fallback
    }
    return ['Ali', 'Zeynep', 'Mert', 'Deniz'];
  });

  const [newPlayerName, setNewPlayerName] = useState('');
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [includeMrWhite, setIncludeMrWhite] = useState(false);

  // Game Lifecycle: 'setup' -> 'peek' -> 'clues' -> 'vote' -> 'game_over'
  const [phase, setPhase] = useState<'setup' | 'peek' | 'clues' | 'vote' | 'game_over'>('setup');

  const [assignedRoles, setAssignedRoles] = useState<PlayerRole[]>([]);
  const [currentPeekIndex, setCurrentPeekIndex] = useState(0);
  const [isPeeking, setIsPeeking] = useState(false);
  const [hasPeekedCurrent, setHasPeekedCurrent] = useState(false);

  const [currentWordPair, setCurrentWordPair] = useState<UndercoverWordPair | null>(null);
  const [usedPairIds, setUsedPairIds] = useState<Set<string>>(new Set());
  const [winner, setWinner] = useState<'civilians' | 'undercovers' | 'mr_white' | null>(null);
  const [eliminatedAnnouncement, setEliminatedAnnouncement] = useState<PlayerRole | null>(null);
  const [roundNumber, setRoundNumber] = useState(1);

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
    if (players.length <= 3) return;
    const updated = players.filter((p) => p !== name);
    setPlayers(updated);
    try {
      localStorage.setItem('fincan_table_players', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Adjust undercover count if players change
  useEffect(() => {
    if (players.length >= 7 && undercoverCount < 2) {
      setUndercoverCount(2);
    } else if (players.length < 5 && undercoverCount > 1) {
      setUndercoverCount(1);
    }
  }, [players.length, undercoverCount]);

  // Start & Assign Roles
  const handleStartGame = () => {
    if (players.length < 3) return;

    // Pick random unseen word pair
    let availablePairs = UNDERCOVER_WORD_PAIRS.filter((p) => !usedPairIds.has(p.id));
    if (availablePairs.length === 0) {
      availablePairs = UNDERCOVER_WORD_PAIRS;
      setUsedPairIds(new Set());
    }
    const pair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
    setUsedPairIds((prev) => new Set(prev).add(pair.id));
    setCurrentWordPair(pair);

    // Shuffle players
    const shuffledNames = [...players].sort(() => 0.5 - Math.random());

    // Role distribution
    const roles: PlayerRole[] = [];
    const undercoversToAssign = Math.min(undercoverCount, Math.floor(players.length / 2));
    const hasMrWhite = includeMrWhite && players.length >= 4;

    shuffledNames.forEach((name, index) => {
      if (hasMrWhite && index === 0) {
        roles.push({
          name,
          role: 'mr_white',
          word: '??? (KELİMEN YOK)',
          isAlive: true,
        });
      } else if (index < (hasMrWhite ? undercoversToAssign + 1 : undercoversToAssign)) {
        roles.push({
          name,
          role: 'undercover',
          word: pair.undercoverWord,
          isAlive: true,
        });
      } else {
        roles.push({
          name,
          role: 'civilian',
          word: pair.civilianWord,
          isAlive: true,
        });
      }
    });

    // Re-shuffle assigned roles so order of peeking is natural
    const finalOrder = roles.sort(() => 0.5 - Math.random());
    setAssignedRoles(finalOrder);
    setCurrentPeekIndex(0);
    setIsPeeking(false);
    setHasPeekedCurrent(false);
    setEliminatedAnnouncement(null);
    setRoundNumber(1);
    setWinner(null);
    setPhase('peek');
  };

  // Step into Next Peek
  const handleNextPeek = () => {
    if (currentPeekIndex + 1 < assignedRoles.length) {
      setCurrentPeekIndex((prev) => prev + 1);
      setIsPeeking(false);
      setHasPeekedCurrent(false);
    } else {
      // All players peeked, move to clues
      setPhase('clues');
    }
  };

  // Check victory status
  const checkVictory = (currentRoles: PlayerRole[]): boolean => {
    const aliveCivilians = currentRoles.filter((p) => p.isAlive && p.role === 'civilian');
    const aliveUndercovers = currentRoles.filter((p) => p.isAlive && (p.role === 'undercover' || p.role === 'mr_white'));

    if (aliveUndercovers.length === 0) {
      setWinner('civilians');
      setPhase('game_over');
      return true;
    }

    if (aliveUndercovers.length >= aliveCivilians.length) {
      setWinner('undercovers');
      setPhase('game_over');
      return true;
    }

    return false;
  };

  // Handle Elimination
  const handleEliminatePlayer = (playerName: string) => {
    const target = assignedRoles.find((p) => p.name === playerName);
    if (!target) return;

    const updatedRoles = assignedRoles.map((p) => 
      p.name === playerName ? { ...p, isAlive: false } : p
    );
    setAssignedRoles(updatedRoles);
    setEliminatedAnnouncement(target);

    const isGameOver = checkVictory(updatedRoles);
    if (!isGameOver) {
      setRoundNumber((prev) => prev + 1);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* ============================================================== */}
      {/* 1. SETUP PHASE */}
      {/* ============================================================== */}
      {phase === 'setup' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-5">
          <div className="text-center space-y-1.5">
            <div className="w-16 h-16 rounded-2xl bg-coffee-950 text-cream-50 flex items-center justify-center mx-auto shadow-warm">
              <ShieldAlert className="w-8 h-8 text-caramel-400" />
            </div>
            <h2 className="font-serif font-black text-2xl text-coffee-950">
              Masadaki Casus
            </h2>
            <p className="text-xs text-coffee-700 leading-relaxed max-w-xs mx-auto">
              Aramızdan birileri gizli casus! Herkes gizli kelimesini alır, ipuçları verilir ve casus yakalanmaya çalışılır.
            </p>
          </div>

          {/* Player Count & List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-coffee-900">
              <span>Masadaki Oyuncular ({players.length})</span>
              <span className="text-[11px] text-coffee-500 font-normal">Min 3 oyuncu</span>
            </div>

            <form onSubmit={handleAddPlayer} className="flex gap-2">
              <input
                type="text"
                placeholder="Oyuncu adı yazın..."
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
                  {players.length > 3 && (
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

          {/* Game Settings */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-coffee-950 block">Casus Sayısı</span>
                <span className="text-[10px] text-coffee-600">Farklı kelimeyi alan gizli oyuncu</span>
              </div>
              <div className="flex items-center gap-1 bg-white border border-coffee-300 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setUndercoverCount(1)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    undercoverCount === 1 ? 'bg-coffee-950 text-white' : 'text-coffee-700 hover:bg-cream-100'
                  }`}
                >
                  1
                </button>
                <button
                  type="button"
                  onClick={() => setUndercoverCount(2)}
                  disabled={players.length < 5}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    undercoverCount === 2 
                      ? 'bg-coffee-950 text-white' 
                      : players.length < 5 ? 'opacity-30 cursor-not-allowed text-coffee-400' : 'text-coffee-700 hover:bg-cream-100'
                  }`}
                >
                  2
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-coffee-200/60">
              <div>
                <span className="text-xs font-bold text-coffee-950 block">Kör Casus (Mr. White)</span>
                <span className="text-[10px] text-coffee-600">Kelimesi olmayan, blöf yapan süper casus</span>
              </div>
              <button
                type="button"
                onClick={() => setIncludeMrWhite(!includeMrWhite)}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  includeMrWhite ? 'bg-terracotta-600' : 'bg-coffee-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    includeMrWhite ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <button
            onClick={handleStartGame}
            disabled={players.length < 3}
            className="w-full btn-primary !py-4 text-sm font-black flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 fill-cream-50" />
            <span>Rolleri Dağıt & Başla</span>
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
      {/* 2. SECRET PEEK PHASE (Elden Ele Gizli Kelimeye Bakma) */}
      {/* ============================================================== */}
      {phase === 'peek' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-6 text-center">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full border border-terracotta-200 inline-block">
              Sıradaki Oyuncu: {currentPeekIndex + 1} / {assignedRoles.length}
            </span>
            <h2 className="font-serif font-black text-3xl text-coffee-950">
              {assignedRoles[currentPeekIndex]?.name}
            </h2>
            <p className="text-xs text-coffee-600">
              Telefonu sadece sen gör. Parmağını basılı tutarak gizli kelimeni oku!
            </p>
          </div>

          {/* Interactive Hold-to-Reveal Card */}
          <div
            onMouseDown={() => {
              setIsPeeking(true);
              setHasPeekedCurrent(true);
            }}
            onMouseUp={() => setIsPeeking(false)}
            onMouseLeave={() => setIsPeeking(false)}
            onTouchStart={() => {
              setIsPeeking(true);
              setHasPeekedCurrent(true);
            }}
            onTouchEnd={() => setIsPeeking(false)}
            onTouchCancel={() => setIsPeeking(false)}
            style={{
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              touchAction: 'manipulation'
            }}
            className={`w-full min-h-[220px] rounded-3xl border-3 transition-all flex flex-col items-center justify-center p-6 select-none cursor-pointer relative overflow-hidden ${
              isPeeking
                ? assignedRoles[currentPeekIndex]?.role === 'civilian'
                  ? 'bg-emerald-600 text-white border-emerald-900 shadow-warm'
                  : assignedRoles[currentPeekIndex]?.role === 'undercover'
                  ? 'bg-terracotta-600 text-white border-terracotta-900 shadow-warm'
                  : 'bg-coffee-950 text-caramel-300 border-coffee-950 shadow-warm'
                : 'bg-cream-100 text-coffee-800 border-dashed border-coffee-400 hover:bg-cream-200'
            }`}
          >
            {isPeeking ? (
              <div className="space-y-3 animate-fade-in text-center">
                <span className="text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-white/20 inline-flex items-center gap-1.5">
                  {assignedRoles[currentPeekIndex]?.role === 'civilian' && (
                    <><span className="w-2 h-2 rounded-full bg-emerald-300" /> Sen Sivilsin</>
                  )}
                  {assignedRoles[currentPeekIndex]?.role === 'undercover' && (
                    <><span className="w-2 h-2 rounded-full bg-rose-300" /> Sen Casussun</>
                  )}
                  {assignedRoles[currentPeekIndex]?.role === 'mr_white' && (
                    <><span className="w-2 h-2 rounded-full bg-white" /> Sen Kör Casussun</>
                  )}
                </span>
                <div className="font-serif font-black text-3xl tracking-wide">
                  {assignedRoles[currentPeekIndex]?.word}
                </div>
                <p className="text-[11px] text-white/90 max-w-xs mx-auto">
                  {assignedRoles[currentPeekIndex]?.role === 'civilian' && 'Diğer sivillerle aynı kelimeye sahipsin. Casusu bul!'}
                  {assignedRoles[currentPeekIndex]?.role === 'undercover' && 'Kelimen sivillerinkine çok benzer ama farklı! Çaktırma.'}
                  {assignedRoles[currentPeekIndex]?.role === 'mr_white' && 'Kelimen yok! İpuçlarını iyi dinle ve havayı kokla.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white border border-coffee-300 flex items-center justify-center mx-auto text-coffee-700 shadow-warm-sm">
                  <EyeOff className="w-7 h-7" />
                </div>
                <span className="font-bold text-sm text-coffee-900 flex items-center justify-center gap-1.5">
                  <Lock className="w-4 h-4 text-coffee-600" />
                  <span>Kelimene Bakmak İçin Basılı Tut</span>
                </span>
                <span className="text-[11px] text-coffee-500 block">
                  Parmağını çektiğinde ekran anında gizlenir
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleNextPeek}
            disabled={!hasPeekedCurrent}
            className={`w-full py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all ${
              hasPeekedCurrent
                ? 'btn-dark'
                : 'bg-coffee-200 text-coffee-400 cursor-not-allowed'
            }`}
          >
            <span>
              {currentPeekIndex + 1 < assignedRoles.length
                ? 'Sıradaki Oyuncuya Uzat'
                : 'Herkes Baktı, Masaya Geç'}
            </span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. CLUES & DISCUSSION PHASE */}
      {/* ============================================================== */}
      {phase === 'clues' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-6">
          <div className="flex items-center justify-between border-b border-coffee-200 pb-3">
            <div>
              <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                {roundNumber}. Tur
              </span>
              <h2 className="font-serif font-black text-xl text-coffee-950 flex items-center gap-2">
                <Search className="w-5 h-5 text-terracotta-600" />
                İpucu & Dedektiflik Saati
              </h2>
            </div>
            <span className="text-xs font-bold bg-cream-100 text-coffee-800 px-3 py-1 rounded-full border border-coffee-200">
              {assignedRoles.filter((p) => p.isAlive).length} Kişi Hayatta
            </span>
          </div>

          {/* Elimination Announcement if round > 1 */}
          {eliminatedAnnouncement && (
            <div className="p-3.5 rounded-2xl bg-cream-100 border border-coffee-300 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-coffee-300 flex items-center justify-center shrink-0">
                {eliminatedAnnouncement.role === 'civilian' ? (
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Skull className="w-5 h-5 text-terracotta-600" />
                )}
              </div>
              <div className="text-xs">
                <span className="font-black text-coffee-950">{eliminatedAnnouncement.name}</span> elendi! Rolü:{' '}
                <span className="font-bold inline-flex items-center gap-1.5 ml-1">
                  {eliminatedAnnouncement.role === 'civilian' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                      Masum Sivil
                    </>
                  )}
                  {eliminatedAnnouncement.role === 'undercover' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                      Gizli Casus
                    </>
                  )}
                  {eliminatedAnnouncement.role === 'mr_white' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                      Kör Casus
                    </>
                  )}
                </span>
              </div>
            </div>
          )}

          {/* Clue Rules & Talking Order */}
          <div className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-2.5">
            <h3 className="text-xs font-bold text-coffee-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-terracotta-600" />
              Nasıl Oynanır?
            </h3>
            <ul className="text-xs text-coffee-700 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>Masadaki herkes sırayla kelimesi hakkında <strong>tek bir kelime veya kısa ipucu</strong> söyler.</li>
              <li>İpucunu çok bariz verme (casus öğrenir), çok uzak verme (senden şüphelenirler)!</li>
              <li>Herkes konuştuktan sonra masada serbest tartışma başlar.</li>
            </ul>
          </div>

          {/* Living Players List */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-coffee-900 block">Sırayla Konuşacaklar:</span>
            <div className="grid grid-cols-2 gap-2">
              {assignedRoles
                .filter((p) => p.isAlive)
                .map((p, idx) => (
                  <div
                    key={p.name}
                    className="p-3 rounded-xl bg-cream-100 border border-coffee-200 flex items-center gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-coffee-950 text-cream-50 font-black text-[10px] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-xs text-coffee-900 truncate">{p.name}</span>
                  </div>
                ))}
            </div>
          </div>

          <button
            onClick={() => setPhase('vote')}
            className="w-full btn-primary !py-4 text-xs font-black flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>İpuçları Bitti, Oylamaya Geç</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. VOTING & ELIMINATION PHASE */}
      {/* ============================================================== */}
      {phase === 'vote' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto">
              <Skull className="w-6 h-6" />
            </div>
            <h2 className="font-serif font-black text-2xl text-coffee-950">
              Kimi Elemek İstiyorsunuz?
            </h2>
            <p className="text-xs text-coffee-600">
              Masada parmaklar aynı anda kaldırılsın! En çok oyu alan oyuncuyu seçin:
            </p>
          </div>

          <div className="space-y-2 pt-2">
            {assignedRoles
              .filter((p) => p.isAlive)
              .map((p) => (
                <button
                  key={p.name}
                  onClick={() => handleEliminatePlayer(p.name)}
                  className="w-full p-4 rounded-2xl bg-cream-50 hover:bg-rose-50 border-2 border-coffee-200 hover:border-rose-600 text-left flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-coffee-200 group-hover:border-rose-400 flex items-center justify-center font-bold text-coffee-900">
                      {p.name.charAt(0)}
                    </div>
                    <span className="font-bold text-sm text-coffee-950 group-hover:text-rose-900">
                      {p.name}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-coffee-500 group-hover:text-rose-600 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Bu Kişiyi Ele
                  </span>
                </button>
              ))}
          </div>

          <button
            onClick={() => setPhase('clues')}
            className="w-full py-3 text-xs font-bold text-coffee-600 hover:text-coffee-950 text-center"
          >
            ← İpuçlarını Tekrar Hatırla
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. GAME OVER & WINNER REVEAL */}
      {/* ============================================================== */}
      {phase === 'game_over' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-coffee-950 shadow-print space-y-6 text-center">
          <div className="space-y-2">
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center shadow-warm ${
              winner === 'civilians'
                ? 'bg-emerald-600 text-white'
                : 'bg-terracotta-600 text-white'
            }`}>
              <Trophy className="w-8 h-8" />
            </div>

            <h2 className="font-serif font-black text-3xl text-coffee-950">
              {winner === 'civilians' ? 'Siviller Kazandı!' : 'Casuslar Kazandı!'}
            </h2>
            <p className="text-xs text-coffee-700">
              {winner === 'civilians'
                ? 'Mükemmel dedektiflik! Masadaki tüm casuslar başarıyla yakalandı.'
                : 'Casuslar kimliğini mükemmel gizledi ve masayı ele geçirdi!'}
            </p>
          </div>

          {/* Secret Words Summary */}
          {currentWordPair && (
            <div className="p-4 rounded-2xl bg-cream-50 border border-coffee-200 space-y-3 text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-coffee-500 block">
                Günün Gizli Kelimeleri ({currentWordPair.category})
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950">
                  <span className="block text-[10px] text-emerald-700 font-bold">Sivil Kelimesi:</span>
                  <span className="font-black text-sm">{currentWordPair.civilianWord}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-950">
                  <span className="block text-[10px] text-rose-700 font-bold">Casus Kelimesi:</span>
                  <span className="font-black text-sm">{currentWordPair.undercoverWord}</span>
                </div>
              </div>
            </div>
          )}

          {/* Player Roles Summary */}
          <div className="space-y-2 text-left">
            <span className="text-xs font-bold text-coffee-900 block">Kimin Rolü Neydi?</span>
            <div className="space-y-1.5">
              {assignedRoles.map((p) => (
                <div
                  key={p.name}
                  className="p-2.5 rounded-xl bg-cream-100 border border-coffee-200 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-coffee-950">{p.name}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    p.role === 'civilian'
                      ? 'bg-emerald-100 text-emerald-800'
                      : p.role === 'undercover'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-coffee-200 text-coffee-900'
                  }`}>
                    {p.role === 'civilian' && 'Sivil'}
                    {p.role === 'undercover' && 'Casus'}
                    {p.role === 'mr_white' && 'Kör Casus'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
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
