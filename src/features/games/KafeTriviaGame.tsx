import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Brain, 
  Car, 
  Film, 
  Music, 
  Utensils, 
  Globe2, 
  Cpu, 
  Gamepad2, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  ArrowRight, 
  RotateCcw, 
  Shuffle, 
  Coffee, 
  Award,
  ChevronRight,
  Zap,
  Medal,
  Lightbulb
} from 'lucide-react';
import type { TriviaCategoryInfo, TriviaQuestion, TriviaLeaderboardEntry } from '../../types';
import { TRIVIA_CATEGORIES, TRIVIA_QUESTIONS } from '../../data/triviaQuestions';
import { useTableSession } from '../../hooks/useTableSession';

interface KafeTriviaGameProps {
  onFinishGame: () => void;
}

type GameStage = 'category-select' | 'countdown' | 'question' | 'round-summary';

const QUESTION_TIME_LIMIT = 15; // 15 seconds per question
const QUESTIONS_PER_ROUND = 5;

export const KafeTriviaGame: React.FC<KafeTriviaGameProps> = ({ onFinishGame }) => {
  const { activeTable } = useTableSession();
  const currentTableLabel = activeTable?.label || 'Masa';

  // Game flow states
  const [stage, setStage] = useState<GameStage>('category-select');
  const [selectedCategory, setSelectedCategory] = useState<TriviaCategoryInfo | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME_LIMIT);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [earnedPointsThisQuestion, setEarnedPointsThisQuestion] = useState(0);
  const [countdownNum, setCountdownNum] = useState(3);
  const [streak, setStreak] = useState(0);

  // Auto transition timer ref
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Helper to render Category Icon
  const renderCategoryIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'Brain': return <Brain className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Car': return <Car className={className} />;
      case 'Film': return <Film className={className} />;
      case 'Music': return <Music className={className} />;
      case 'Utensils': return <Utensils className={className} />;
      case 'Globe2': return <Globe2 className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Gamepad2': return <Gamepad2 className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      default: return <Brain className={className} />;
    }
  };

  // Start selected category
  const startTrivia = (cat: TriviaCategoryInfo | null) => {
    setSelectedCategory(cat);
    
    // Select questions
    let pool = TRIVIA_QUESTIONS;
    if (cat) {
      pool = TRIVIA_QUESTIONS.filter((q) => q.categoryId === cat.id);
    }

    // Shuffle and pick 5
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_ROUND);
    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setCountdownNum(3);
    setStage('countdown');
  };

  // Countdown timer effect
  useEffect(() => {
    if (stage !== 'countdown') return;

    if (countdownNum > 1) {
      const timer = setTimeout(() => {
        setCountdownNum((prev) => prev - 1);
      }, 700);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setStage('question');
        setTimeLeft(QUESTION_TIME_LIMIT);
        setIsAnswered(false);
        setSelectedOption(null);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [stage, countdownNum]);

  // Question countdown timer
  useEffect(() => {
    if (stage !== 'question' || isAnswered) return;

    if (timeLeft <= 0) {
      // Time is up! Treat as incorrect
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

  // Handle player answer
  const handleAnswer = (optionIndex: number, isTimeout = false) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(optionIndex);

    const currentQ = activeQuestions[currentIndex];
    const isCorrect = !isTimeout && optionIndex === currentQ.correctIndex;

    if (isCorrect) {
      // 100 base points + up to 50 speed bonus based on timeLeft
      const speedBonus = Math.round((timeLeft / QUESTION_TIME_LIMIT) * 50);
      const points = 100 + speedBonus;
      setEarnedPointsThisQuestion(points);
      setScore((prev) => prev + points);
      setCorrectCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setEarnedPointsThisQuestion(0);
      setStreak(0);
    }
  };

  // Next question or finish
  const handleNextQuestion = () => {
    if (currentIndex + 1 < activeQuestions.length) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(QUESTION_TIME_LIMIT);
      setIsAnswered(false);
      setSelectedOption(null);
      setEarnedPointsThisQuestion(0);
    } else {
      setStage('round-summary');
    }
  };

  // Build Cafe Leaderboard simulation
  const getLeaderboard = (): TriviaLeaderboardEntry[] => {
    const defaultTables: TriviaLeaderboardEntry[] = [
      { tableLabel: 'Masa 4', score: 680, correctCount: 5, totalQuestions: 5 },
      { tableLabel: 'Masa 2', score: 540, correctCount: 4, totalQuestions: 5 },
      { tableLabel: 'Masa 8', score: 410, correctCount: 3, totalQuestions: 5 },
      { tableLabel: 'Masa 6', score: 290, correctCount: 2, totalQuestions: 5 },
    ];

    // Insert current table
    const currentEntry: TriviaLeaderboardEntry = {
      tableLabel: currentTableLabel,
      score,
      correctCount,
      totalQuestions: activeQuestions.length,
      isCurrentTable: true,
    };

    const combined = [...defaultTables.filter((t) => t.tableLabel !== currentTableLabel), currentEntry];
    combined.sort((a, b) => b.score - a.score);

    return combined.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  };

  // =========================================================================
  // RENDER 1: KATEGORİ SEÇİM EKRANI
  // =========================================================================
  if (stage === 'category-select') {
    return (
      <div className="space-y-5 animate-in fade-in duration-300">
        {/* Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-terracotta-700 via-coffee-800 to-coffee-950 text-white shadow-warm relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-cream-100 text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Masalar Arası Kafe Trivia</span>
            </div>
            <h2 className="font-serif font-black text-xl sm:text-2xl text-white">
              Hangi Alanda İddialısınız?
            </h2>
            <p className="text-xs sm:text-sm text-cream-200 leading-relaxed">
              Kategorinizi seçin, 5 soruyu en hızlı şekilde cevaplayıp kafe liderlik tablosunda masanızı zirveye taşıyın!
            </p>
          </div>
        </div>

        {/* Rastgele Karışık Hızlı Oyna Butonu */}
        <button
          onClick={() => startTrivia(null)}
          className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-terracotta-600 hover:from-amber-600 hover:to-terracotta-700 text-white font-bold text-sm sm:text-base shadow-warm flex items-center justify-between gap-3 transition-transform active:scale-98 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span>Karışık Kategori (Tüm Konular)</span>
                <span className="px-2 py-0.5 rounded-full bg-white/25 text-[10px] font-bold">Popüler</span>
              </div>
              <p className="text-xs text-amber-100 font-normal">Tüm kategorilerden rastgele 5 soru</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* 10 Kategori Kartları */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-coffee-600">
              10 Tematik Kategori
            </h3>
            <span className="text-[11px] text-coffee-400 font-medium">50+ Canlı Soru</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TRIVIA_CATEGORIES.map((cat) => {
              const questionCount = TRIVIA_QUESTIONS.filter((q) => q.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => startTrivia(cat)}
                  className="w-full text-left p-3.5 rounded-2xl bg-white border border-coffee-200/80 hover:border-terracotta-400 hover:shadow-warm transition-all group flex items-center justify-between gap-3 active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${cat.bgGradient} text-white shadow-xs group-hover:scale-105 transition-transform`}>
                      {renderCategoryIcon(cat.iconName, 'w-5 h-5')}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-coffee-950 group-hover:text-terracotta-700 transition-colors">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] text-coffee-600 line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold text-coffee-500 bg-cream-100 px-2 py-0.5 rounded-lg border border-coffee-200/50">
                      {questionCount} Soru
                    </span>
                    <ChevronRight className="w-4 h-4 text-coffee-400 group-hover:text-terracotta-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 2: GERİ SAYIM ANİMASYONU (3... 2... 1... BAŞLA)
  // =========================================================================
  if (stage === 'countdown') {
    return (
      <div className="min-h-[55vh] flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 text-white flex items-center justify-center font-black text-4xl shadow-warm animate-bounce">
          {countdownNum}
        </div>
        <div className="space-y-1">
          <h3 className="font-serif font-black text-2xl text-coffee-950">
            {selectedCategory ? selectedCategory.name : 'Karışık Kategori'}
          </h3>
          <p className="text-xs text-coffee-600">
            {currentTableLabel} hazır olsun, yarışma başlıyor!
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER 3: AKTİF SORU EKRANI
  // =========================================================================
  if (stage === 'question') {
    const currentQuestion = activeQuestions[currentIndex];
    const progressPercent = ((currentIndex + 1) / activeQuestions.length) * 100;
    const timeProgressPercent = (timeLeft / QUESTION_TIME_LIMIT) * 100;
    const isUrgent = timeLeft <= 4;

    return (
      <div className="space-y-4 animate-in fade-in duration-200">
        {/* Üst Bar: İlerleme & Skor & Sayaç */}
        <div className="bg-white rounded-2xl p-3.5 border border-coffee-200/80 shadow-warm-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-1.5 text-coffee-600">
              <span className="bg-cream-100 text-coffee-800 px-2 py-0.5 rounded-md font-mono">
                {currentIndex + 1} / {activeQuestions.length}
              </span>
              <span className="text-coffee-500 font-medium">Soru</span>
            </div>

            {/* Streak / Seri Rozeti */}
            {streak > 1 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>{streak} Seri!</span>
              </div>
            )}

            {/* Toplam Skor */}
            <div className="flex items-center gap-1 text-terracotta-700 font-extrabold bg-terracotta-50 px-2.5 py-1 rounded-lg border border-terracotta-200">
              <Zap className="w-3.5 h-3.5 fill-terracotta-600" />
              <span>{score} Puan</span>
            </div>
          </div>

          {/* Soru İlerleme Çubuğu */}
          <div className="w-full bg-cream-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-terracotta-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Geri Sayım Sayacı */}
          <div className="flex items-center gap-2 pt-1">
            <Clock className={`w-4 h-4 shrink-0 ${isUrgent ? 'text-red-600 animate-spin' : 'text-coffee-500'}`} />
            <div className="flex-1 bg-cream-200 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  isUrgent ? 'bg-red-600' : 'bg-emerald-500'
                }`}
                style={{ width: `${timeProgressPercent}%` }}
              />
            </div>
            <span className={`text-xs font-mono font-bold shrink-0 ${
              isUrgent ? 'text-red-600 font-black scale-110' : 'text-coffee-700'
            }`}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Kategori Rozeti */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-coffee-600 bg-white border border-coffee-200/80 px-2.5 py-1 rounded-full shadow-2xs">
            {currentQuestion.categoryName}
          </span>
          <span className="text-[11px] font-medium text-coffee-500">
            Hızlı cevap = Ekstra puan!
          </span>
        </div>

        {/* Soru Metni Kartı */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-coffee-200/80 shadow-warm text-left space-y-3">
          <h2 className="font-serif font-black text-lg sm:text-xl text-coffee-950 leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {/* 4 Şık (Seçenekler) */}
        <div className="grid grid-cols-1 gap-2.5">
          {currentQuestion.options.map((opt, idx) => {
            const letter = ['A', 'B', 'C', 'D'][idx];
            const isCorrectOption = idx === currentQuestion.correctIndex;
            const isThisSelected = selectedOption === idx;

            let buttonClass = 'bg-white border-coffee-200/80 text-coffee-900 hover:border-terracotta-300 hover:bg-cream-50';
            let badgeClass = 'bg-cream-100 text-coffee-700';

            if (isAnswered) {
              if (isCorrectOption) {
                buttonClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/30';
                badgeClass = 'bg-emerald-500 text-white';
              } else if (isThisSelected) {
                buttonClass = 'bg-red-50 border-red-500 text-red-950 ring-2 ring-red-500/30';
                badgeClass = 'bg-red-500 text-white';
              } else {
                buttonClass = 'bg-cream-50/50 border-coffee-100 text-coffee-400 opacity-60';
                badgeClass = 'bg-cream-200 text-coffee-400';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-warm-sm active:scale-[0.99] ${buttonClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 transition-colors ${badgeClass}`}>
                    {letter}
                  </span>
                  <span className="font-semibold text-sm sm:text-base leading-snug">
                    {opt}
                  </span>
                </div>

                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                )}
                {isAnswered && isThisSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Cevap Sonrası Bilgi & Sonraki Butonu */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-cream-100 border border-coffee-200 space-y-3 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {selectedOption === currentQuestion.correctIndex ? (
                  <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Harika! Doğru Cevap
                  </span>
                ) : (
                  <span className="text-xs font-black text-red-700 flex items-center gap-1">
                    <XCircle className="w-4 h-4" />
                    {selectedOption === -1 ? 'Süre Doldu!' : 'Yanlış Cevap'}
                  </span>
                )}
              </div>

              {earnedPointsThisQuestion > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold border border-emerald-300">
                  +{earnedPointsThisQuestion} Puan
                </span>
              )}
            </div>

            {currentQuestion.explanation && (
              <p className="text-xs text-coffee-700 leading-relaxed border-t border-coffee-200/50 pt-2 flex items-start gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold">Biliyor muydunuz?</span> {currentQuestion.explanation}
                </span>
              </p>
            )}

            <button
              onClick={handleNextQuestion}
              className="w-full py-3 px-4 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-warm flex items-center justify-center gap-2 transition-colors"
            >
              <span>{currentIndex + 1 < activeQuestions.length ? 'Sonraki Soru' : 'Yarışma Sonucunu Gör'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RENDER 4: TUR SONUCU & CANLI KAFE LİDERLİK TABLOSU
  // =========================================================================
  const leaderboard = getLeaderboard();
  const currentRank = leaderboard.find((e) => e.isCurrentTable)?.rank || 1;
  const isChampion = currentRank === 1;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Tebrik Kartı */}
      <div className={`p-6 rounded-3xl text-center space-y-3 shadow-warm border ${
        isChampion 
          ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-terracotta-600 text-white border-amber-300' 
          : 'bg-white border-coffee-200/80 text-coffee-950'
      }`}>
        <div className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center shadow-warm ${
          isChampion ? 'bg-white/20 text-white' : 'bg-terracotta-100 text-terracotta-700'
        }`}>
          {isChampion ? <Trophy className="w-9 h-9 text-amber-200" /> : <Award className="w-9 h-9" />}
        </div>

        <div className="space-y-1">
          <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
            isChampion ? 'bg-white/25 text-white' : 'bg-cream-100 text-coffee-700'
          }`}>
            Tur Tamamlandı
          </span>
          <h2 className="font-serif font-black text-2xl sm:text-3xl">
            {isChampion ? 'Kafe Şampiyonu!' : 'Harika Mücadele!'}
          </h2>
          <p className={`text-xs ${isChampion ? 'text-amber-100' : 'text-coffee-600'}`}>
            {currentTableLabel} yarışmayı {correctCount}/{activeQuestions.length} doğruyla bitirdi.
          </p>
        </div>

        {/* Skor Özeti Kutusu */}
        <div className={`p-4 rounded-2xl flex items-center justify-around ${
          isChampion ? 'bg-black/15 text-white' : 'bg-cream-100 text-coffee-900'
        }`}>
          <div>
            <div className="text-[11px] opacity-75 font-medium">Toplam Puan</div>
            <div className="font-serif font-black text-2xl">{score}</div>
          </div>
          <div className="w-px h-8 bg-current opacity-20" />
          <div>
            <div className="text-[11px] opacity-75 font-medium">Kafe Sırası</div>
            <div className="font-serif font-black text-2xl">#{currentRank}</div>
          </div>
          <div className="w-px h-8 bg-current opacity-20" />
          <div>
            <div className="text-[11px] opacity-75 font-medium">Doğruluk</div>
            <div className="font-serif font-black text-2xl">%{Math.round((correctCount / activeQuestions.length) * 100)}</div>
          </div>
        </div>

        {isChampion && (
          <div className="p-3 rounded-xl bg-white/20 text-white text-xs font-semibold backdrop-blur-xs flex items-center justify-center gap-2">
            <Coffee className="w-4 h-4 text-amber-200 shrink-0" />
            <span>Masanız kafede 1. sırada! Garsona gösterip tebrik kahvesi isteyebilirsiniz!</span>
          </div>
        )}
      </div>

      {/* Canlı Kafe Liderlik Tablosu (Leaderboard) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-coffee-200/80 shadow-warm space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-coffee-100">
          <div className="flex items-center gap-2">
            <Medal className="w-5 h-5 text-terracotta-600" />
            <h3 className="font-serif font-bold text-base text-coffee-950">
              Kafe Canlı Lider Tablosu
            </h3>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            Canlı Sıralama
          </span>
        </div>

        <div className="space-y-2">
          {leaderboard.map((item) => (
            <div
              key={item.tableLabel}
              className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                item.isCurrentTable
                  ? 'bg-terracotta-50 border-2 border-terracotta-500 shadow-xs'
                  : 'bg-cream-50/70 border border-coffee-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center ${
                  item.rank === 1 
                    ? 'bg-amber-400 text-white shadow-xs' 
                    : item.rank === 2 
                    ? 'bg-slate-300 text-slate-800' 
                    : item.rank === 3 
                    ? 'bg-amber-700 text-white' 
                    : 'bg-coffee-200 text-coffee-800'
                }`}>
                  #{item.rank}
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-coffee-950">
                      {item.tableLabel}
                    </span>
                    {item.isCurrentTable && (
                      <span className="text-[10px] font-bold text-terracotta-700 bg-terracotta-100 px-1.5 py-0.5 rounded-md">
                        Siz
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-coffee-500">
                    {item.correctCount} / {item.totalQuestions} doğru
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-extrabold text-sm sm:text-base text-coffee-950">
                  {item.score}
                </span>
                <span className="text-[11px] text-coffee-500 block">Puan</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aksiyon Butonları */}
      <div className="pt-1 space-y-2">
        <button
          onClick={() => {
            if (selectedCategory) {
              startTrivia(selectedCategory);
            } else {
              startTrivia(null);
            }
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold text-sm shadow-warm flex items-center justify-center gap-2 transition-transform active:scale-98"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Bu Kategoride Tekrar Yarış</span>
        </button>

        <button
          onClick={() => setStage('category-select')}
          className="w-full py-3 px-4 rounded-xl bg-white hover:bg-cream-100 border border-coffee-200 text-coffee-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-warm-sm"
        >
          <Brain className="w-4 h-4 text-coffee-600" />
          <span>Farklı Kategori Seç</span>
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
