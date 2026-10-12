import React, { useState } from 'react';
import { 
  Split, 
  ArrowRight, 
  MessageSquare, 
  Check, 
  Shuffle
} from 'lucide-react';
import type { Question } from '../../types';

interface IkilemdeKalGameProps {
  questions: Question[];
  onFinishGame: () => void;
}

export const IkilemdeKalGame: React.FC<IkilemdeKalGameProps> = ({
  questions,
  onFinishGame,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    return questions.length > 0 ? Math.floor(Math.random() * questions.length) : 0;
  });
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [dilemmasCompleted, setDilemmasCompleted] = useState<number>(0);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  const current = questions[currentIndex] || questions[0];

  const handleNextDilemma = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedOption(null);
      setDilemmasCompleted(prev => prev + 1);

      if (current) {
        const nextSeen = new Set(seenIds);
        nextSeen.add(current.id);

        const unseenIndices = questions
          .map((q, idx) => ({ q, idx }))
          .filter(item => !nextSeen.has(item.q.id));

        if (unseenIndices.length > 0) {
          const picked = unseenIndices[Math.floor(Math.random() * unseenIndices.length)];
          setCurrentIndex(picked.idx);
          setSeenIds(nextSeen);
        } else {
          setSeenIds(new Set([current.id]));
          setCurrentIndex(Math.floor(Math.random() * questions.length));
        }
      }
      setIsTransitioning(false);
    }, 150);
  };

  return (
    <div className={`space-y-6 transition-all duration-200 ${isTransitioning ? 'opacity-30 scale-[0.99]' : 'opacity-100 scale-100'}`}>
      {/* Question Header Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-warm border border-caramel-200 text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel-100 text-caramel-800 text-xs font-bold">
          <Split className="w-3.5 h-3.5" />
          İkilem #{currentIndex + 1}
        </div>
        <h2 className="font-serif font-bold text-lg sm:text-xl text-coffee-950 leading-snug">
          {current?.question_text}
        </h2>
        <p className="text-xs text-coffee-600">
          Herkes tarafını seçsin. Masada oy çoğunluğu hangi seçenekte?
        </p>
      </div>

      {/* Two Big Choice Buttons */}
      <div className="grid grid-cols-1 gap-3.5">
        {/* Option A */}
        <button
          onClick={() => setSelectedOption('A')}
          className={`w-full text-left p-5 sm:p-6 rounded-3xl border-2 transition-all duration-200 relative ${
            selectedOption === 'A'
              ? 'bg-gradient-to-br from-terracotta-50 to-orange-50 border-terracotta-600 shadow-warm scale-[1.01]'
              : 'bg-white hover:bg-cream-50 border-coffee-200 shadow-warm-sm'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
              selectedOption === 'A' ? 'bg-terracotta-600 text-white' : 'bg-coffee-100 text-coffee-800'
            }`}>
              {selectedOption === 'A' ? <Check className="w-4 h-4" /> : 'A'}
            </span>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-500">
                1. Seçenek
              </span>
              <p className="font-bold text-base sm:text-lg text-coffee-950 leading-snug">
                {current?.option_a || 'Seçenek A'}
              </p>
            </div>
          </div>
        </button>

        {/* VS Divider */}
        <div className="flex items-center justify-center -my-2 relative z-10">
          <span className="bg-coffee-900 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md uppercase tracking-widest">
            V E Y A
          </span>
        </div>

        {/* Option B */}
        <button
          onClick={() => setSelectedOption('B')}
          className={`w-full text-left p-5 sm:p-6 rounded-3xl border-2 transition-all duration-200 relative ${
            selectedOption === 'B'
              ? 'bg-gradient-to-br from-caramel-50 to-amber-50 border-caramel-600 shadow-warm scale-[1.01]'
              : 'bg-white hover:bg-cream-50 border-coffee-200 shadow-warm-sm'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 ${
              selectedOption === 'B' ? 'bg-caramel-600 text-white' : 'bg-coffee-100 text-coffee-800'
            }`}>
              {selectedOption === 'B' ? <Check className="w-4 h-4" /> : 'B'}
            </span>
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-500">
                2. Seçenek
              </span>
              <p className="font-bold text-base sm:text-lg text-coffee-950 leading-snug">
                {current?.option_b || 'Seçenek B'}
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Discussion Follow-up Prompt */}
      {selectedOption && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-coffee-900 to-coffee-800 text-white shadow-warm animate-fadeIn space-y-2">
          <div className="flex items-center gap-2 text-caramel-300 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            Şimdi Tartışma Zamanı!
          </div>
          <p className="text-xs sm:text-sm text-coffee-100 leading-relaxed">
            Seçimini yaptın! Şimdi masadaki diğer kişilere <strong>neden Seçenek {selectedOption}'yi tercih ettiğini</strong> açıkla. Masada karşı tarafı ikna edebilecek misin?
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={handleNextDilemma}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-caramel-500 to-caramel-600 hover:from-caramel-600 hover:to-caramel-700 text-white font-bold text-base shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <Shuffle className="w-5 h-5" />
          Yeni İkilem Getir
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>

        <div className="flex items-center justify-between text-xs text-coffee-600 px-2">
          <span>Tartışılan İkilemler: {dilemmasCompleted + 1}</span>
          <button
            onClick={onFinishGame}
            className="font-semibold text-coffee-800 hover:underline"
          >
            Oyunu Bitir
          </button>
        </div>
      </div>
    </div>
  );
};
