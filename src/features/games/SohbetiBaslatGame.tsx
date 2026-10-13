import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  RefreshCw, 
  Tag, 
  HelpCircle, 
  X, 
  CheckCircle,
  Coffee,
  Shuffle
} from 'lucide-react';
import type { Question } from '../../types';

interface SohbetiBaslatGameProps {
  questions: Question[];
  onFinishGame: () => void;
}

export const SohbetiBaslatGame: React.FC<SohbetiBaslatGameProps> = ({
  questions,
  onFinishGame,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('Tümü');
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return questions.length > 0 ? Math.floor(Math.random() * questions.length) : 0;
  });
  const [showRules, setShowRules] = useState<boolean>(false);
  const [cardFlipAnim, setCardFlipAnim] = useState<boolean>(false);

  // Extract unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    questions.forEach(q => q.tags?.forEach(t => set.add(t)));
    return ['Tümü', ...Array.from(set).slice(0, 6)];
  }, [questions]);

  // Filtered list
  const filteredQuestions = useMemo(() => {
    if (selectedTag === 'Tümü') return questions;
    return questions.filter(q => q.tags?.includes(selectedTag));
  }, [questions, selectedTag]);

  // Current question
  const currentQuestion = filteredQuestions[currentIndex] || questions[0];

  const handleNextQuestion = () => {
    setCardFlipAnim(true);
    setTimeout(() => {
      // Mark seen
      if (currentQuestion) {
        const nextSeen = new Set(seenIds);
        nextSeen.add(currentQuestion.id);

        // Find next unseen question
        const unseenIndexes = filteredQuestions
          .map((q, idx) => ({ q, idx }))
          .filter(item => !nextSeen.has(item.q.id));

        if (unseenIndexes.length > 0) {
          const randomChoice = unseenIndexes[Math.floor(Math.random() * unseenIndexes.length)];
          setCurrentIndex(randomChoice.idx);
          setSeenIds(nextSeen);
        } else {
          // If all seen, reset seen set and pick random
          setSeenIds(new Set([currentQuestion.id]));
          setCurrentIndex(Math.floor(Math.random() * filteredQuestions.length));
        }
      }
      setCardFlipAnim(false);
    }, 200);
  };

  const difficultyLabel = (diff?: string) => {
    switch (diff) {
      case 'deep':
        return { text: 'Derin Düşünce', color: 'bg-indigo-100 text-indigo-800' };
      case 'medium':
        return { text: 'Düşündürücü', color: 'bg-amber-100 text-amber-800' };
      default:
        return { text: 'Buz Kırıcı', color: 'bg-emerald-100 text-emerald-800' };
    }
  };

  const diffBadge = difficultyLabel(currentQuestion?.difficulty);

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Category Tag Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Tag className="w-3.5 h-3.5 text-coffee-500 shrink-0 ml-1" />
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setSelectedTag(tag);
              const subset = tag === 'Tümü' ? questions : questions.filter(q => q.tags?.includes(tag));
              setCurrentIndex(subset.length > 0 ? Math.floor(Math.random() * subset.length) : 0);
            }}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedTag === tag
                ? 'bg-terracotta-600 text-white shadow-warm-sm'
                : 'bg-white text-coffee-700 hover:bg-cream-100 border border-coffee-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Main Question Card */}
      <div 
        className={`relative min-h-[250px] sm:min-h-[300px] bg-white rounded-3xl p-5 sm:p-7 shadow-warm border-2 border-coffee-200/80 flex flex-col justify-between transition-all duration-300 ${
          cardFlipAnim ? 'opacity-40 scale-98 translate-y-1' : 'opacity-100 scale-100'
        }`}
      >
        {/* Top Card Info */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${diffBadge.color}`}>
              {diffBadge.text}
            </span>
            {currentQuestion?.tags?.[0] && (
              <span className="text-[11px] font-medium text-coffee-600 bg-cream-100 px-2 py-0.5 rounded-md">
                #{currentQuestion.tags[0]}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleNextQuestion}
              className="text-coffee-500 hover:text-coffee-950 p-1.5 rounded-xl hover:bg-cream-100 transition-colors flex items-center gap-1 text-[11px] font-bold"
              title="Rastgele Soru Karıştır"
            >
              <Shuffle className="w-3.5 h-3.5 text-terracotta-600" />
              <span className="hidden sm:inline">Karıştır</span>
            </button>
            <button
              onClick={() => setShowRules(true)}
              className="text-coffee-400 hover:text-coffee-700 p-1 rounded-lg transition-colors"
              title="Nasıl Oynanır?"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="my-auto py-6 text-center space-y-4">
          <p className="font-serif font-bold text-xl sm:text-2xl text-coffee-950 leading-relaxed max-w-md mx-auto">
            "{currentQuestion?.question_text}"
          </p>
          <div className="w-8 h-1 bg-terracotta-500/40 rounded-full mx-auto" />
        </div>

        {/* Bottom Card Footer */}
        <div className="flex items-center justify-between text-xs text-coffee-500 pt-2 border-t border-coffee-100">
          <span className="flex items-center gap-1 text-[11px]">
            <Coffee className="w-3.5 h-3.5 text-terracotta-500" />
            Sırayla herkes cevaplasın
          </span>
          <span className="text-[11px] font-medium">
            Görülen: {seenIds.size + 1} / {filteredQuestions.length}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handleNextQuestion}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-terracotta-600 to-terracotta-700 hover:from-terracotta-700 hover:to-terracotta-800 text-white font-bold text-base shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <RefreshCw className="w-5 h-5" />
          Yeni Soru Getir
        </button>

        <button
          onClick={onFinishGame}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-coffee-600 hover:text-coffee-900 hover:bg-white/60 transition-colors"
        >
          Bu Oyunu Bitir ve Menüye Dön
        </button>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-coffee-950/50 backdrop-blur-sm">
          <div className="max-w-sm w-full bg-white rounded-3xl p-6 shadow-warm-lg border border-coffee-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-lg text-coffee-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-terracotta-500" />
                Nasıl Oynanır?
              </h4>
              <button
                onClick={() => setShowRules(false)}
                className="text-coffee-400 hover:text-coffee-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ul className="text-xs text-coffee-700 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Ekrana gelen soruyu masadaki biri yüksek sesle okur.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Masadaki herkes sırayla samimi cevabını veya anısını paylaşır.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Cevaplamak istemeyen "Pas" diyebilir. Sohbet bitince "Yeni Soru"ya basın.</span>
              </li>
            </ul>
            <button
              onClick={() => setShowRules(false)}
              className="w-full py-2.5 rounded-xl bg-coffee-900 text-white font-semibold text-xs"
            >
              Anladım, Devam Et
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
