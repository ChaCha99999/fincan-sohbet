import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Flame, 
  Coffee, 
  Music, 
  CheckCircle2, 
  Send, 
  MessageSquarePlus, 
  Check, 
  Split,
  SmilePlus
} from 'lucide-react';
import type { CafePoll, PollCategory } from '../../types';
import { INITIAL_CAFE_POLLS } from '../../data/cafePollsSeed';
import { useTableSession } from '../../hooks/useTableSession';

interface KafeNabziGameProps {
  onFinishGame: () => void;
}

const STORAGE_KEY = 'fincan_kafe_nabzi_votes';

export const KafeNabziGame: React.FC<KafeNabziGameProps> = ({ onFinishGame }) => {
  const { activeTable } = useTableSession();
  const currentTableLabel = activeTable?.label || 'Masa';

  // Polls list and selected filter
  const [polls, setPolls] = useState<CafePoll[]>([]);
  const [activeCategory, setActiveCategory] = useState<PollCategory | 'all'>('all');

  // Suggestion box
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestionSent, setSuggestionSent] = useState(false);

  // Load polls and saved votes from localStorage
  useEffect(() => {
    let savedVotes: Record<string, string> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) savedVotes = JSON.parse(raw);
    } catch {
      savedVotes = {};
    }

    const initial = INITIAL_CAFE_POLLS.map((p) => {
      const votedOptId = savedVotes[p.id] || null;
      return {
        ...p,
        myVoteOptionId: votedOptId,
      };
    });

    setPolls(initial);
  }, []);

  // Handle vote
  const handleVote = (pollId: string, optionId: string) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;

        // If already voted, ignore
        if (poll.myVoteOptionId) return poll;

        const updatedOptions = poll.options.map((opt) => {
          if (opt.id === optionId) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });

        const newTotal = poll.totalVotes + 1;

        // Save to localStorage
        try {
          const raw = localStorage.getItem(STORAGE_KEY);
          const savedVotes = raw ? JSON.parse(raw) : {};
          savedVotes[pollId] = optionId;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(savedVotes));
        } catch {
          // ignore localStorage error
        }

        return {
          ...poll,
          totalVotes: newTotal,
          myVoteOptionId: optionId,
          options: updatedOptions,
        };
      })
    );
  };

  // Submit suggestion
  const handleSendSuggestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionText.trim()) return;

    setSuggestionSent(true);
    setSuggestionText('');
    setTimeout(() => {
      setSuggestionSent(false);
    }, 4000);
  };

  // Filtered polls
  const filteredPolls = polls.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  // Calculate percentages
  const getOptionPercentage = (optVotes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((optVotes / total) * 100);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-700 via-emerald-800 to-coffee-950 text-white shadow-warm relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-black uppercase tracking-wider backdrop-blur-xs">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Ortak Kafe Nabzı</span>
          </div>
          <h2 className="font-serif font-black text-2xl text-white">
            Günün Kafe Oylamaları
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Kafedeki tüm masaların katıldığı anketler ve ikilemler! {currentTableLabel} olarak oyunuzu kullanın, kafe genelindeki canlı dağılımı görün.
          </p>
        </div>
      </div>

      {/* Kategori Filtre Sekmeleri */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-coffee-200 text-coffee-700 hover:bg-cream-100'
          }`}
        >
          Tüm Anketler ({polls.length})
        </button>

        <button
          onClick={() => setActiveCategory('kahve-muzik')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'kahve-muzik'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-coffee-200 text-coffee-700 hover:bg-cream-100'
          }`}
        >
          <Music className="w-3.5 h-3.5" />
          <span>Müzik & Kahve</span>
        </button>

        <button
          onClick={() => setActiveCategory('gunun-ikilemi')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'gunun-ikilemi'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-coffee-200 text-coffee-700 hover:bg-cream-100'
          }`}
        >
          <Split className="w-3.5 h-3.5" />
          <span>Günün İkilemi</span>
        </button>

        <button
          onClick={() => setActiveCategory('kafe-modu')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeCategory === 'kafe-modu'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-coffee-200 text-coffee-700 hover:bg-cream-100'
          }`}
        >
          <SmilePlus className="w-3.5 h-3.5" />
          <span>Kafe Modu</span>
        </button>
      </div>

      {/* Anketler Listesi */}
      <div className="space-y-4">
        {filteredPolls.map((poll) => {
          const hasVoted = Boolean(poll.myVoteOptionId);
          // Find max voted option
          const maxVotes = Math.max(...poll.options.map((o) => o.votes));

          return (
            <div
              key={poll.id}
              className="p-5 rounded-3xl bg-white border border-coffee-200/80 shadow-warm space-y-4 transition-all"
            >
              {/* Üst Başlık & Rozetler */}
              <div className="flex items-center justify-between gap-2 border-b border-coffee-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    {poll.categoryTitle}
                  </span>
                  {poll.trendingBadge && (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600 fill-amber-500" />
                      {poll.trendingBadge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-bold text-coffee-500">
                  {poll.totalVotes} Masa Oy Kullandı
                </span>
              </div>

              {/* Soru */}
              <div className="space-y-1">
                <h3 className="font-serif font-black text-lg sm:text-xl text-coffee-950 leading-snug">
                  {poll.question}
                </h3>
                {poll.description && (
                  <p className="text-xs text-coffee-600">
                    {poll.description}
                  </p>
                )}
              </div>

              {/* Seçenekler */}
              <div className="space-y-2.5 pt-1">
                {poll.options.map((opt) => {
                  const isMyVote = poll.myVoteOptionId === opt.id;
                  const percent = getOptionPercentage(opt.votes, poll.totalVotes);
                  const isLeading = hasVoted && opt.votes === maxVotes && maxVotes > 0;

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleVote(poll.id, opt.id)}
                      disabled={hasVoted}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${
                        isMyVote
                          ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                          : hasVoted
                          ? 'border-coffee-100 bg-cream-50/40 text-coffee-800'
                          : 'border-coffee-200 bg-white hover:border-emerald-400 hover:bg-cream-50 active:scale-[0.99]'
                      }`}
                    >
                      {/* Oy Verildiyse: Canlı Yüzde İlerleme Çubuğu */}
                      {hasVoted && (
                        <div
                          className={`absolute inset-0 h-full transition-all duration-700 ease-out -z-0 opacity-15 rounded-2xl ${
                            isLeading ? 'bg-emerald-600' : 'bg-coffee-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                            isMyVote
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-coffee-300 bg-white'
                          }`}>
                            {isMyVote ? (
                              <Check className="w-3 h-3 text-white stroke-[3]" />
                            ) : null}
                          </div>
                          <span className={`text-xs sm:text-sm font-semibold leading-snug ${
                            isMyVote ? 'text-emerald-950 font-bold' : 'text-coffee-950'
                          }`}>
                            {opt.text}
                          </span>
                        </div>

                        {/* Yüzde & Lider Rozeti */}
                        {hasVoted ? (
                          <div className="flex items-center gap-2 shrink-0">
                            {isLeading && (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                                Çoğunluk
                              </span>
                            )}
                            <span className="font-mono font-black text-xs sm:text-sm text-coffee-900">
                              %{percent}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-coffee-400 group-hover:text-emerald-700 transition-colors shrink-0">
                            Oyla
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Alt Bilgi */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-coffee-500">
                {hasVoted ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {currentTableLabel} olarak oyunuz kaydedildi
                  </span>
                ) : (
                  <span className="text-coffee-500">
                    Oyunuzu vererek kafedeki çoğunluğu görün
                  </span>
                )}
                <span>Canlı Kafe Nabzı</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Kafe Yönetimine Anket Öner Formu */}
      <div className="p-5 rounded-3xl bg-white border border-coffee-200/80 shadow-warm space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquarePlus className="w-5 h-5 text-emerald-700" />
          <h3 className="font-serif font-bold text-sm text-coffee-950">
            Kafeye Yeni Bir Anket Sorusu Önerin
          </h3>
        </div>
        <p className="text-xs text-coffee-600">
          Masada konuştuğunuz eğlenceli bir ikilemi veya soruyu kafe paneline önerin, sonraki oylamalara eklensin!
        </p>

        {suggestionSent ? (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="flex items-center gap-1.5">
              Harika bir fikir! Sorunuz kafe yönetimine iletildi
              <Coffee className="w-3.5 h-3.5 text-emerald-700 inline shrink-0" />
            </span>
          </div>
        ) : (
          <form onSubmit={handleSendSuggestion} className="flex gap-2">
            <input
              type="text"
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="Örn: Hafta sonu kahvaltısında simit mi kruvasan mı?"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-coffee-200 text-xs text-coffee-950 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <button
              type="submit"
              disabled={!suggestionText.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-warm flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gönder</span>
            </button>
          </form>
        )}
      </div>

      {/* Masaya Dön Butonu */}
      <div className="pt-1">
        <button
          onClick={onFinishGame}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-cream-100 border border-coffee-200 text-coffee-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-warm-sm"
        >
          <Coffee className="w-4 h-4 text-coffee-600" />
          <span>Masa Menüsüne Dön</span>
        </button>
      </div>
    </div>
  );
};
