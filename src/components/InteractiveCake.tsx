import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Mic, MicOff, Wind, Sparkles, RefreshCw, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface InteractiveCakeProps {
  recipientName: string;
  onProceedToGift: () => void;
}

export const InteractiveCake: React.FC<InteractiveCakeProps> = ({
  recipientName,
  onProceedToGift,
}) => {
  const [areCandlesBlown, setAreCandlesBlown] = useState(false);
  const [isMicListening, setIsMicListening] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [wishMade, setWishMade] = useState(false);
  const [wishText, setWishText] = useState('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop mic helper
  const stopMic = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsMicListening(false);
  };

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, []);

  const triggerBlowOut = () => {
    if (areCandlesBlown) return;
    setAreCandlesBlown(true);
    stopMic();
    soundEngine.playCandleBlow();

    // Multistage Confetti fireworks
    const count = 200;
    const defaults = {
      origin: { y: 0.65 },
      colors: ['#F59E0B', '#F43F5E', '#FB7185', '#FCD34D', '#FFFFFF', '#EC4899'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const startMicDetection = async () => {
    setMicError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;

      const microphone = ctx.createMediaStreamSource(stream);
      microphone.connect(analyser);

      setIsMicListening(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let consecutiveBlowFrames = 0;

      const detectBlow = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume energy, with higher weight to high-frequency wind noise
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;

        // When user blows directly into mic, average spikes (> 65)
        if (average > 65) {
          consecutiveBlowFrames++;
          if (consecutiveBlowFrames >= 4) {
            triggerBlowOut();
            return;
          }
        } else {
          consecutiveBlowFrames = Math.max(0, consecutiveBlowFrames - 1);
        }

        animationFrameRef.current = requestAnimationFrame(detectBlow);
      };

      detectBlow();
    } catch (err) {
      console.warn('Microphone permission denied or not supported', err);
      setMicError('Microphone access was denied or not available. Tap "Make a Wish & Blow" instead!');
      setIsMicListening(false);
    }
  };

  const relightCandles = () => {
    setAreCandlesBlown(false);
    soundEngine.playChime(660);
  };

  return (
    <section id="cake" className="relative py-16 bg-stone-900/40 border-t border-stone-800/80">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-amber-400 uppercase">
            <span>Chapter 01</span>
            <span aria-hidden="true">·</span>
            <span>Make a Birthday Wish</span>
          </div>

          <h2 className="mt-3 font-serif text-3xl font-medium text-stone-100 sm:text-4xl text-balance">
            The Candlelight Ceremony
          </h2>
          <p className="mt-3 text-sm text-stone-400 max-w-lg mx-auto">
            Close your eyes, think of the one dream your heart craves most this year, and blow out the candles.
          </p>
        </div>

        {/* Cake Centerpiece Card */}
        <div className="mt-10 mx-auto max-w-2xl rounded-2xl border border-stone-800 bg-stone-950/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Candlelight glow backdrop */}
          {!areCandlesBlown && (
            <div
              className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-amber-500/20 blur-[80px]"
              aria-hidden="true"
            />
          )}

          <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-xl border border-stone-800 shadow-inner group">
            <img
              src="/src/assets/images/artisan_birthday_cake_1792141312448.jpg"
              alt="Artisan birthday cake with glowing candles"
              referrerPolicy="no-referrer"
              className={`h-full w-full object-cover transition-all duration-1000 ${
                areCandlesBlown ? 'filter brightness-75 contrast-105' : 'brightness-100'
              }`}
            />

            {/* Simulated Dynamic Candle Flame Overlay */}
            {!areCandlesBlown ? (
              <div className="absolute inset-0 pointer-events-none">
                {/* Candle flame glow spots matching cake candle positions */}
                <div className="absolute top-[21%] left-[50%] -translate-x-1/2 flex items-center justify-center gap-5 sm:gap-7">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="animate-flicker flex flex-col items-center"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    >
                      {/* Teardrop flame */}
                      <div className="h-4 w-2.5 rounded-full bg-gradient-to-t from-amber-500 via-yellow-300 to-white shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400/80 -mt-1 blur-[1px]" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Wisps of smoke when blown */
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xs uppercase tracking-widest text-stone-400">
                    Candles Extinguished · Wish Made
                  </div>
                </div>
              </div>
            )}

            {/* Corner status tag */}
            <div className="absolute bottom-3 right-3 rounded-md bg-stone-950/80 px-2.5 py-1 text-xs text-stone-300 backdrop-blur-sm border border-stone-800">
              {areCandlesBlown ? '🕯️ Wish Floating to Heaven' : '🔥 Candles Glowing'}
            </div>
          </div>

          {/* Interaction controls */}
          <div className="mt-8">
            {!areCandlesBlown ? (
              <div className="flex flex-col items-center gap-4">
                {/* Wish input (optional) */}
                <div className="w-full max-w-md">
                  <input
                    type="text"
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Whisper your secret wish here (optional)..."
                    className="w-full rounded-xl border border-stone-800 bg-stone-900/80 px-4 py-2.5 text-sm text-stone-200 placeholder-stone-500 outline-none focus:border-amber-500/80 transition-colors text-center"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={triggerBlowOut}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3 text-sm font-semibold text-stone-950 shadow-md transition-all hover:scale-105 active:scale-95"
                  >
                    <Wind className="h-4 w-4" />
                    <span>Blow Out the Candles</span>
                  </button>

                  <button
                    onClick={isMicListening ? stopMic : startMicDetection}
                    type="button"
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                      isMicListening
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
                    }`}
                  >
                    {isMicListening ? (
                      <>
                        <Mic className="h-4 w-4 animate-pulse text-rose-400" />
                        <span>Blow into Mic to Extinguish</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 text-stone-400" />
                        <span>Use Device Mic</span>
                      </>
                    )}
                  </button>
                </div>

                {isMicListening && (
                  <p className="text-xs text-rose-400 animate-pulse">
                    Listening... Take a deep breath and gently blow into your microphone!
                  </p>
                )}

                {micError && (
                  <p className="text-xs text-amber-400 max-w-md text-center">{micError}</p>
                )}
              </div>
            ) : (
              /* When candles are blown out */
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/20 text-amber-300 mb-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-medium text-amber-200">
                  Happy Birthday, {recipientName}!
                </h3>
                <p className="mt-2 text-sm text-stone-300 max-w-md mx-auto">
                  {wishText ? (
                    <span>
                      Your wish: <em className="text-amber-300">"{wishText}"</em> has been sealed into the stars.
                    </span>
                  ) : (
                    'Your wish has been whispered directly to the heavens. May every dream of yours bloom into reality.'
                  )}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={onProceedToGift}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-2.5 text-sm font-semibold text-stone-950 transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    <span>Proceed to Surprise Gift Box</span>
                    <Sparkles className="h-4 w-4" />
                  </button>

                  <button
                    onClick={relightCandles}
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900 px-4 py-2.5 text-xs text-stone-400 hover:text-stone-200 transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Relight Candles</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
