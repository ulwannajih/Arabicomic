/**
 * Audio synthesis helper for Arabic texts and sound effects
 */

let synth: SpeechSynthesis | null = null;
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  synth = window.speechSynthesis;
}

export function playArabicSpeech(text: string, slowMode: boolean = false): Promise<void> {
  return new Promise((resolve) => {
    if (!synth) {
      resolve();
      return;
    }

    try {
      synth.cancel(); // cancel any ongoing speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = slowMode ? 0.65 : 0.9;
      utterance.pitch = 1.0;

      // Try finding an Arabic voice
      const voices = synth.getVoices();
      const arabicVoice = voices.find(
        (v) => v.lang.startsWith('ar') || v.lang.includes('Arabic') || v.name.includes('Arabic')
      );
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      synth.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      resolve();
    }
  });
}

export function playSuccessChime() {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3); // C6

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  } catch {
    // audio context might be blocked
  }
}
