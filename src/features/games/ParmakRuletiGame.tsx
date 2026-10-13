import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  RotateCcw, 
  CreditCard, 
  Coffee, 
  Sparkles,
  Flame
} from 'lucide-react';

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  color: string;
}

const NEON_COLORS = [
  '#f43f5e', // rose-500
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#3b82f6', // blue-500
  '#14b8a6', // teal-500
];

interface ParmakRuletiGameProps {
  onFinishGame?: () => void;
}

export const ParmakRuletiGame: React.FC<ParmakRuletiGameProps> = ({ onFinishGame }) => {
  const [mode, setMode] = useState<'hesap' | 'kahve' | 'oyun_basi'>('hesap');
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedTouch, setSelectedTouch] = useState<TouchPoint | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Available modes
  const modeLabels = {
    hesap: {
      title: 'Masa Hesabı',
      badge: 'Hesap Kurbanı',
      desc: 'Hesabı ödeyecek kişi seçiliyor!',
      result: 'Kredi kartını hazırla, hesap sende!',
      icon: <CreditCard className="w-5 h-5 text-terracotta-400" />
    },
    kahve: {
      title: 'Kahve Turu',
      badge: 'Kahve Ismarlama',
      desc: 'Sıradaki kahveleri kim ısmarlayacak?',
      result: 'Bu turun kahveleri senden!',
      icon: <Coffee className="w-5 h-5 text-amber-400" />
    },
    oyun_basi: {
      title: 'İlk Başlayan',
      badge: 'Oyun Sırası',
      desc: 'Sıradaki oyuna ilk kim başlayacak?',
      result: 'İlk soru sana geliyor, başla!',
      icon: <Sparkles className="w-5 h-5 text-emerald-400" />
    }
  };

  // Convert touches to internal state
  const updateTouches = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isFinished) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const newPoints: TouchPoint[] = [];

    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      const color = NEON_COLORS[i % NEON_COLORS.length];

      newPoints.push({
        id: touch.identifier,
        x,
        y,
        color
      });
    }

    setTouchPoints(newPoints);
  };

  // Multi-Touch Handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    updateTouches(e);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    updateTouches(e);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isFinished) return;
    updateTouches(e);
  };

  // Countdown & Selection Logic
  useEffect(() => {
    if (isFinished) return;

    // Need at least 2 fingers to start roulette
    if (touchPoints.length >= 2) {
      if (countdown === null) {
        setCountdown(3);
      }
    } else {
      // Not enough fingers
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      setCountdown(null);
    }
  }, [touchPoints.length, isFinished, countdown]);

  useEffect(() => {
    if (countdown !== null && countdown > 0 && !countdownTimerRef.current) {
      countdownTimerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
            // TRIGGER SELECTION
            triggerSelection();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
    };
  }, [countdown]);

  const triggerSelection = () => {
    if (touchPoints.length === 0) return;
    const randomIndex = Math.floor(Math.random() * touchPoints.length);
    const chosen = touchPoints[randomIndex];
    setSelectedTouch(chosen);
    setIsFinished(true);
    setCountdown(null);

    // Try device vibration if available
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 200]);
      } catch {
        // ignore
      }
    }
  };

  // Reset Roulette
  const handleReset = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setTouchPoints([]);
    setSelectedTouch(null);
    setCountdown(null);
    setIsFinished(false);
  };

  // Desktop Simulation helper (Allows testing on laptops/PCs)
  const handleAddSimulatedFinger = () => {
    if (isFinished) return;
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const padding = 60;
    const x = padding + Math.random() * (rect.width - padding * 2);
    const y = padding + Math.random() * (rect.height - padding * 2);
    const id = Date.now() + Math.random();
    const color = NEON_COLORS[touchPoints.length % NEON_COLORS.length];

    setTouchPoints((prev) => [...prev, { id, x, y, color }]);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Top Mode Selection */}
      <div className="p-3.5 rounded-2xl bg-white border-2 border-coffee-950 shadow-warm-sm flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { setMode('hesap'); handleReset(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              mode === 'hesap'
                ? 'bg-terracotta-600 text-white shadow-warm-sm'
                : 'text-coffee-700 hover:bg-cream-100'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Hesap</span>
          </button>
          <button
            onClick={() => { setMode('kahve'); handleReset(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              mode === 'kahve'
                ? 'bg-amber-600 text-white shadow-warm-sm'
                : 'text-coffee-700 hover:bg-cream-100'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Kahve</span>
          </button>
          <button
            onClick={() => { setMode('oyun_basi'); handleReset(); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              mode === 'oyun_basi'
                ? 'bg-emerald-600 text-white shadow-warm-sm'
                : 'text-coffee-700 hover:bg-cream-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>İlk Kişi</span>
          </button>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-coffee-800 transition-colors"
          title="Sıfırla"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Touch Arena Canvas */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
        className="w-full min-h-[350px] h-[52vh] max-h-[440px] rounded-4xl bg-coffee-950 border-3 border-coffee-950 shadow-print relative overflow-hidden select-none touch-none flex flex-col items-center justify-center text-center p-5"
      >
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-radial from-coffee-900/60 to-transparent pointer-events-none" />

        {/* Dynamic Touch Circles */}
        {touchPoints.map((pt) => {
          const isSelected = selectedTouch && selectedTouch.id === pt.id;
          const isFaded = isFinished && !isSelected;

          return (
            <div
              key={pt.id}
              style={{
                left: `${pt.x}px`,
                top: `${pt.y}px`,
                backgroundColor: pt.color,
                boxShadow: isSelected 
                  ? `0 0 60px 20px ${pt.color}, 0 0 100px 40px rgba(255,255,255,0.8)` 
                  : `0 0 25px 8px ${pt.color}`
              }}
              className={`absolute w-16 h-16 -ml-8 -mt-8 rounded-full pointer-events-none transition-all duration-300 flex items-center justify-center ${
                isSelected
                  ? 'scale-150 animate-bounce ring-4 ring-white z-30'
                  : isFaded
                  ? 'opacity-10 scale-75'
                  : 'scale-100 animate-pulse z-10'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white/80 animate-ping" />
            </div>
          );
        })}

        {/* Center Prompt & Countdown Overlay */}
        {!isFinished && (
          <div className="space-y-3 z-20 pointer-events-none">
            {countdown !== null ? (
              <div className="space-y-2 animate-fade-in">
                <span className="font-mono font-black text-6xl sm:text-7xl text-amber-400 drop-shadow-md animate-pulse block">
                  {countdown}
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-cream-200 bg-coffee-900/80 px-4 py-1.5 rounded-full border border-caramel-400/40 inline-flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Parmağınızı Çekmeyin!
                </span>
              </div>
            ) : (
              <div className="space-y-2 max-w-xs">
                <div className="w-16 h-16 rounded-3xl bg-coffee-900 border border-coffee-800 text-caramel-400 flex items-center justify-center mx-auto shadow-warm">
                  <Flame className="w-8 h-8 animate-pulse text-amber-400" />
                </div>
                <h3 className="font-serif font-black text-2xl text-cream-50">
                  {modeLabels[mode].title} Ruleti
                </h3>
                <p className="text-xs text-cream-300 leading-relaxed">
                  Masadaki herkes telefon ekranına aynı anda <strong>tek bir parmağını basılı tutsun!</strong>
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-caramel-300 bg-coffee-900/90 px-3 py-1 rounded-full border border-caramel-400/30">
                    Dokunan Parmak: {touchPoints.length} (Min 2)
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VICTORY / SELECTION RESULT OVERLAY */}
        {isFinished && selectedTouch && (
          <div className="space-y-4 z-20 animate-fade-in p-6 bg-coffee-900/90 rounded-3xl border border-caramel-400/50 backdrop-blur-md max-w-xs shadow-print">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-coffee-950 flex items-center justify-center mx-auto shadow-warm animate-bounce">
              <Zap className="w-8 h-8 fill-coffee-950" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                KURBAN SEÇİLDİ
              </span>
              <h2 className="font-serif font-black text-2xl text-cream-50 leading-tight">
                {modeLabels[mode].result}
              </h2>
              <p className="text-xs text-cream-300">
                Işıklı halkanın üstündeki parmak bu masanın kahramanı oldu!
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full btn-primary !py-3 !text-xs font-black flex items-center justify-center gap-1.5 shadow-warm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Çevir</span>
            </button>
          </div>
        )}
      </div>

      {/* Desktop / Laptop Testing Button & Rules Note */}
      <div className="flex items-center justify-between text-[11px] text-coffee-500 px-2">
        <span>Telefon masanın ortasına düz konur</span>
        <button
          onClick={handleAddSimulatedFinger}
          disabled={isFinished}
          className="text-terracotta-600 hover:text-terracotta-800 font-bold underline disabled:opacity-30"
        >
          + Sanal Parmak Ekle (PC Testi)
        </button>
      </div>

      {onFinishGame && (
        <button
          onClick={onFinishGame}
          className="w-full py-2.5 text-xs font-bold text-coffee-600 hover:text-coffee-950 text-center"
        >
          Masaya Dön
        </button>
      )}
    </div>
  );
};
