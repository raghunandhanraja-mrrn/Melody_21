import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Sparkles, Heart, Compass, Crown, Eye, CheckCircle2, RotateCcw } from 'lucide-react';
import { SurpriseGift } from '../types';
import { soundEngine } from '../utils/audio';

interface InteractiveGiftBoxProps {
  gifts: SurpriseGift[];
  recipientName: string;
}

export const InteractiveGiftBox: React.FC<InteractiveGiftBoxProps> = ({ gifts, recipientName }) => {
  // Steps: 0 = fully wrapped with ribbon, 1 = ribbon untied (wax seal visible), 2 = unboxed & revealed
  const [unboxingStep, setUnboxingStep] = useState<0 | 1 | 2>(0);
  const [selectedGift, setSelectedGift] = useState<SurpriseGift | null>(null);

  const handleUntieRibbon = () => {
    soundEngine.playRibbonSound();
    setUnboxingStep(1);
  };

  const handleBreakSeal = () => {
    soundEngine.playSealCrack();
    setUnboxingStep(2);

    // Multi-color golden confetti shower
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#FBBF24', '#F43F5E', '#10B981', '#FFFFFF'],
    });

    setTimeout(() => {
      soundEngine.playFanfare();
    }, 200);
  };

  const handleReset = () => {
    setUnboxingStep(0);
    setSelectedGift(null);
    soundEngine.playChime(520);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Compass':
        return <Compass className="h-5 w-5 text-amber-400" />;
      case 'Heart':
        return <Heart className="h-5 w-5 text-rose-400" />;
      case 'Crown':
        return <Crown className="h-5 w-5 text-amber-400" />;
      default:
        return <Sparkles className="h-5 w-5 text-amber-400" />;
    }
  };

  return (
    <section id="surprise-box" className="relative py-20 bg-stone-950 border-t border-stone-800/80">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-amber-400 uppercase">
            <span>Chapter 02</span>
            <span aria-hidden="true">·</span>
            <span>Interactive Unboxing</span>
          </div>

          <h2 className="mt-3 font-serif text-3xl font-medium text-stone-100 sm:text-4xl text-balance">
            The Velvet Delivery Box
          </h2>
          <p className="mt-3 text-sm text-stone-400 max-w-lg mx-auto">
            A bespoke delivery package tailored exclusively for you. Follow the ritual to reveal what lies inside.
          </p>
        </div>

        {/* The Gift Box Experience */}
        {unboxingStep < 2 ? (
          <div className="mt-12 mx-auto max-w-xl">
            <div className="relative rounded-2xl border border-stone-800 bg-stone-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-sm overflow-hidden text-center">
              {/* Warm ambient aura */}
              <div
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-emerald-900/20 blur-[100px]"
                aria-hidden="true"
              />

              {/* Realistic Box Visual */}
              <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl border border-stone-800 shadow-2xl">
                <img
                  src="/src/assets/images/luxury_gift_box_1792141310341.jpg"
                  alt="Luxury emerald birthday gift box"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />

                {/* Ribbon overlay if step 0 */}
                {unboxingStep === 0 && (
                  <div className="absolute inset-0 bg-stone-950/20 flex flex-col items-center justify-center pointer-events-none">
                    <div className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-200 border border-amber-500/30 backdrop-blur-sm shadow-lg animate-float-gentle">
                      🎀 Tied with Pure Gold Silk
                    </div>
                  </div>
                )}

                {/* Wax seal overlay if step 1 */}
                {unboxingStep === 1 && (
                  <div className="absolute inset-0 bg-stone-950/40 flex flex-col items-center justify-center animate-fadeIn">
                    <button
                      onClick={handleBreakSeal}
                      type="button"
                      className="group flex flex-col items-center gap-2 rounded-2xl bg-gradient-to-br from-rose-900/90 to-red-950/90 p-5 border-2 border-amber-500/60 shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all hover:scale-110 active:scale-95"
                    >
                      <div className="h-14 w-14 rounded-full border-2 border-dashed border-amber-300 flex items-center justify-center bg-rose-950 shadow-inner">
                        <Heart className="h-7 w-7 text-amber-300 fill-amber-300/30" />
                      </div>
                      <span className="font-serif text-sm font-semibold tracking-wider text-amber-200">
                        BREAK WAX SEAL
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Step Action Prompts */}
              <div className="mt-8 flex flex-col items-center gap-4">
                {unboxingStep === 0 && (
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-stone-300">
                      Step 1: Pull and untie the golden silk ribbon
                    </p>
                    <button
                      onClick={handleUntieRibbon}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-950/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <span>Untie Golden Ribbon</span>
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </div>
                )}

                {unboxingStep === 1 && (
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-sm font-medium text-amber-300">
                      Ribbon is undone! Now tap the royal wax seal to break it open.
                    </p>
                    <button
                      onClick={handleBreakSeal}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-semibold text-white transition-all hover:bg-rose-500"
                    >
                      <span>Break Seal Now</span>
                    </button>
                  </div>
                )}

                {/* Clean unboxed step indicator */}
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-2">
                  <span className={unboxingStep === 0 ? 'text-amber-400 font-semibold' : ''}>Untie Ribbon</span>
                  <span aria-hidden="true">→</span>
                  <span className={unboxingStep === 1 ? 'text-amber-400 font-semibold' : ''}>Break Wax Seal</span>
                  <span aria-hidden="true">→</span>
                  <span>Surprises Revealed</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Unboxed & Gifts Revealed Showcase */
          <div className="mt-12 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Delivery Unwrapped for {recipientName}</span>
                </div>
                <h3 className="mt-1 font-serif text-2xl font-medium text-stone-100">
                  Your Curated Birthday Surprises
                </h3>
              </div>

              <button
                onClick={handleReset}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Wrap Box Again</span>
              </button>
            </div>

            {/* Gifts Grid */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {gifts.map((gift, idx) => (
                <div
                  key={gift.id}
                  onClick={() => {
                    setSelectedGift(gift);
                    soundEngine.playChime(780);
                  }}
                  className="group relative flex flex-col justify-between rounded-xl border border-stone-800 bg-stone-900/50 p-6 transition-all duration-300 hover:border-amber-500/50 hover:bg-stone-900/80 hover:-translate-y-1 cursor-pointer shadow-lg"
                >
                  <div>
                    {/* Top Icon & Unboxed Category */}
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-800 group-hover:bg-amber-500/20 transition-colors">
                        {getIcon(gift.iconName)}
                      </div>
                      <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                        0{idx + 1}
                      </span>
                    </div>

                    <div className="mt-4 text-[11px] uppercase tracking-wider text-amber-400/90 font-medium">
                      {gift.category}
                    </div>

                    <h4 className="mt-1 font-serif text-lg font-medium text-stone-100 group-hover:text-amber-200 transition-colors">
                      {gift.title}
                    </h4>

                    <p className="mt-2.5 text-xs leading-relaxed text-stone-400 line-clamp-3">
                      {gift.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-stone-800/80 pt-4 text-xs font-medium text-amber-400">
                    <span>Inspect Details</span>
                    <Eye className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Gift Inspection Modal */}
        {selectedGift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-lg rounded-2xl border border-stone-800 bg-stone-900 p-6 sm:p-8 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20">
                  {getIcon(selectedGift.iconName)}
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-amber-400 font-medium">
                    {selectedGift.category}
                  </div>
                  <h3 className="font-serif text-2xl font-medium text-stone-100">
                    {selectedGift.title}
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-stone-800 bg-stone-950/60 p-4">
                  <div className="text-xs text-stone-400 uppercase tracking-wider">The Experience</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-stone-200">
                    {selectedGift.description}
                  </p>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                  <div className="text-xs text-amber-400 uppercase tracking-wider">Personal Note From Him</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-amber-200/90 font-serif italic">
                    "{selectedGift.details}"
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setSelectedGift(null)}
                  type="button"
                  className="rounded-xl bg-stone-800 px-5 py-2.5 text-xs font-medium text-stone-200 hover:bg-stone-700 transition-colors"
                >
                  Close Surprise
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
