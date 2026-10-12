/**
 * Web Audio API tabanlı sesli bildirim yardımcısı.
 * Harici ses dosyası indirmeye gerek olmadan saf tarayıcı senteziyle
 * hafif ve hoş bir "ding-dong" garson çağrı zili çalar.
 */
let audioCtx: AudioContext | null = null;

export const playCallChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }

    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // 1. Ton (Ding - 659.25 Hz - E5)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.03);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 0.4);

    // 2. Ton (Dong - 880 Hz - A5)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.15);

    gain2.gain.setValueAtTime(0, now + 0.15);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);

    osc2.start(now + 0.15);
    osc2.stop(now + 0.7);
  } catch (e) {
    // Ses çalınamazsa sessizce devam et
    console.debug('Audio chime playback omitted:', e);
  }
};
