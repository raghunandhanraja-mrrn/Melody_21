import React from 'react';
import { Heart, Sparkles, ArrowDown, Gift, Cake } from 'lucide-react';
import { SurpriseData } from '../types';

interface HeroCinematicProps {
  data: SurpriseData;
  onBegin: () => void;
}

export const HeroCinematic: React.FC<HeroCinematicProps> = ({ data, onBegin }) => {
  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Background radial gradient glow */}
      <div
        className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-rose-950/20 blur-[130px]"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Split Screen Hero */}
        <div className="grid grid-cols-1 items-stretch gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Typographic Hierarchy */}
          <div className="flex flex-col justify-center lg:col-span-7">
            {/* Clean unboxed kicker metadata */}
            <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-amber-300/90 uppercase">
              <span>A Special Delivery</span>
              <span aria-hidden="true">·</span>
              <span>For {data.recipientName}</span>
              <span aria-hidden="true">·</span>
              <span>{data.birthDate}</span>
            </div>

            <h1 className="mt-4 font-serif text-4xl font-normal tracking-tight text-stone-100 sm:text-5xl lg:text-6xl text-balance">
              {data.specialMilestone}
            </h1>

            <p className="mt-6 text-base leading-relaxed text-stone-300 sm:text-lg max-w-2xl font-light">
              {data.heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onBegin}
                type="button"
                className="group relative inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3.5 text-sm font-semibold text-stone-950 shadow-lg shadow-rose-950/40 transition-all hover:scale-[1.02] hover:shadow-rose-900/50 active:scale-[0.98]"
              >
                <Gift className="h-4 w-4 transition-transform group-hover:rotate-12" />
                <span>Open Your Birthday Delivery</span>
              </button>

              <a
                href="#cake"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-800 bg-stone-900/60 px-5 py-3 text-sm font-medium text-stone-300 transition-colors hover:border-stone-700 hover:text-amber-200 backdrop-blur-sm"
              >
                <Cake className="h-4 w-4 text-amber-400" />
                <span>Make a Candle Wish</span>
              </a>
            </div>

            {/* Dedication tag */}
            <div className="mt-10 flex items-center gap-2.5 border-t border-stone-800/80 pt-6 text-xs text-stone-400">
              <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
              <span>
                Crafted with endless affection by <strong className="font-semibold text-stone-200">{data.senderName}</strong>
              </span>
            </div>
          </div>

          {/* Right Column: Large Visual Media Container */}
          <div className="relative lg:col-span-5 flex items-center">
            <div className="group relative w-full overflow-hidden rounded-2xl border border-stone-800/80 bg-stone-900/50 shadow-2xl">
              <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
                <img
                  src="/src/assets/images/cinematic_surprise_hero_1792141310489.jpg"
                  alt="Romantic rooftop candlelight celebration"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Measured Scrim for Media Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-stone-300">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span className="font-serif italic text-amber-200/90 text-sm">
                    "You are my favorite place to be."
                  </span>
                </div>
                <span className="text-stone-400 font-mono text-[11px] tabular-nums">100% Love</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width Romantic Proof & Milestone Strip below split */}
        <div className="mt-16 grid grid-cols-2 gap-4 border-y border-stone-800/80 py-6 sm:grid-cols-4 sm:gap-6 text-center">
          <div>
            <div className="font-serif text-2xl font-bold text-amber-300 sm:text-3xl">∞</div>
            <div className="mt-1 text-xs text-stone-400 uppercase tracking-wider">Love & Kisses</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-rose-400 sm:text-3xl tabular-nums">365</div>
            <div className="mt-1 text-xs text-stone-400 uppercase tracking-wider">Days of Adoration</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-amber-300 sm:text-3xl">Chapter 1</div>
            <div className="mt-1 text-xs text-stone-400 uppercase tracking-wider">Of Forever Together</div>
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-rose-400 sm:text-3xl">1 & Only</div>
            <div className="mt-1 text-xs text-stone-400 uppercase tracking-wider">Queen of My Heart</div>
          </div>
        </div>
      </div>
    </section>
  );
};
