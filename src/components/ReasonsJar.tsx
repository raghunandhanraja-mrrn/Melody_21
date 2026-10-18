import React, { useState } from 'react';
import { Heart, Sparkles, Shuffle, BookOpen } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ReasonsJarProps {
  reasons: string[];
  recipientName: string;
}

export const ReasonsJar: React.FC<ReasonsJarProps> = ({ reasons, recipientName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAllGrid, setShowAllGrid] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const drawNextReason = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    soundEngine.playChime(840);

    setTimeout(() => {
      let nextIndex = (currentIndex + 1) % reasons.length;
      setCurrentIndex(nextIndex);
      setIsAnimating(false);
    }, 200);
  };

  const drawRandom = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    soundEngine.playChime(920);

    setTimeout(() => {
      let rand = Math.floor(Math.random() * reasons.length);
      if (rand === currentIndex && reasons.length > 1) {
        rand = (rand + 1) % reasons.length;
      }
      setCurrentIndex(rand);
      setIsAnimating(false);
    }, 200);
  };

  return (
    <section id="reasons" className="relative py-20 bg-stone-950 border-t border-stone-800/80">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-rose-400 uppercase">
            <span>Chapter 04</span>
            <span aria-hidden="true">·</span>
            <span>The Little Things</span>
          </div>

          <h2 className="mt-3 font-serif text-3xl font-medium text-stone-100 sm:text-4xl text-balance">
            Reasons My Heart Chose You
          </h2>
          <p className="mt-3 text-sm text-stone-400 max-w-md mx-auto">
            Out of eight billion souls, you are the only one who makes my universe feel this gentle.
          </p>
        </div>

        {/* Interactive Love Card Canvas */}
        <div className="mt-12 mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-gradient-to-b from-stone-900/90 to-stone-950 p-8 sm:p-12 shadow-2xl text-center">
            {/* Subtle floating heart watermark */}
            <div
              className="pointer-events-none absolute -bottom-10 -right-10 text-rose-500/5 select-none"
              aria-hidden="true"
            >
              <Heart className="h-64 w-64 fill-current" />
            </div>

            {/* Clean unboxed counter */}
            <div className="flex items-center justify-center gap-2 text-xs text-stone-400 font-mono tabular-nums">
              <span>Reason</span>
              <span className="text-amber-400 font-bold text-sm">
                #{String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span>of {reasons.length}</span>
            </div>

            {/* The Active Reason Statement */}
            <div className="my-10 min-h-[140px] flex items-center justify-center">
              <p
                className={`font-serif text-2xl sm:text-3xl font-normal leading-relaxed text-stone-100 transition-all duration-300 max-w-lg ${
                  isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                "{reasons[currentIndex]}"
              </p>
            </div>

            {/* Interactive Draw Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-stone-800/80">
              <button
                onClick={drawNextReason}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Heart className="h-3.5 w-3.5 fill-white" />
                <span>Next Reason</span>
              </button>

              <button
                onClick={drawRandom}
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-900 px-4 py-2.5 text-xs font-medium text-stone-300 hover:border-stone-700 hover:text-stone-100 transition-colors"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span>Shuffle Deck</span>
              </button>

              <button
                onClick={() => setShowAllGrid(!showAllGrid)}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900 px-4 py-2.5 text-xs font-medium text-stone-400 hover:text-stone-200 transition-colors"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>{showAllGrid ? 'Hide Gallery' : 'View All Reasons'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* All Reasons Expandable View */}
        {showAllGrid && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {reasons.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  soundEngine.playChime(760);
                }}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  currentIndex === idx
                    ? 'border-rose-500/60 bg-rose-950/20 shadow-md'
                    : 'border-stone-800 bg-stone-900/40 hover:border-stone-700 hover:bg-stone-900/70'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono tabular-nums">
                  <span>#{idx + 1}</span>
                  {currentIndex === idx && (
                    <span className="text-rose-400 font-sans text-xs">Active</span>
                  )}
                </div>
                <p className="mt-2 font-serif text-sm text-stone-300 leading-snug">
                  {item}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
