import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, ArrowLeft, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MilestoneResultScreenProps {
  milestone: 'twenty-one' | 'twenty-seven';
  onChooseAgain: () => void;
  onRestart: () => void;
  recipientName?: string;
}

export const MilestoneResultScreen: React.FC<MilestoneResultScreenProps> = ({
  milestone,
  onChooseAgain,
  onRestart,
  recipientName = 'Lishoow',
}) => {
  useEffect(() => {
    soundEngine.playFanfare();

    // Subtle gentle pastel confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFCDB2', '#FFB5C2', '#DCC6F1', '#B8DDD3'],
    });
  }, [milestone]);

  const isTwentyOne = milestone === 'twenty-one';

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden bg-transparent text-[#FFF7F0] flex flex-col items-center justify-center px-6 transition-all duration-500 font-sans z-10">
      {/* Decorative Atmospheric Glows from Reference Theme */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#4C1A37]/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-[#8E384C]/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#E88E74]/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Main Centered Content */}
      <div className="relative z-10 mx-auto max-w-xl w-full text-center rounded-3xl border border-[#8E384C]/45 bg-[#240D26]/85 p-8 sm:p-12 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_35px_rgba(232,142,116,0.12)] animate-fadeIn">
        {/* Top Decorative Icon */}
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#341437]/90 shadow-md border border-[#A94C57]/50 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
          {isTwentyOne ? (
            <span className="text-3xl">🌸</span>
          ) : (
            <span className="text-3xl">✨</span>
          )}
        </div>

        {/* Milestone Heading */}
        <h1 className="font-sans text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF7F0]">
          {isTwentyOne ? 'Twenty One 🌸' : 'Twenty Seven ✨'}
        </h1>

        {/* Dedicated Message */}
        <div className="mt-6 rounded-3xl border border-[#8E384C]/45 bg-[#1E0921]/90 p-8 shadow-sm backdrop-blur-sm">
          <p className="text-sm sm:text-base leading-relaxed text-[#FFF7F0] font-medium">
            {isTwentyOne
              ? `Happy 21st Milestone, ${recipientName}! May this chapter blossom with radiant smiles, unforgettable memories, spontaneous laughter, and all the sweet happiness your heart can hold.`
              : `Twenty-seven wonderful milestones, ${recipientName}! Shining brighter with every single year, bringing warmth, kindness, and magic to everyone around you.`}
          </p>
          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[#E88E74] font-medium">
            <Heart className="h-3.5 w-3.5 fill-current" />
            <span>Crafted especially for {recipientName}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              soundEngine.playChime(600);
              onChooseAgain();
            }}
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-6 py-3 text-xs sm:text-sm font-semibold text-[#18051B] shadow-[0_4px_24px_rgba(232,142,116,0.4)] border border-[#FDDA9D]/40 hover:from-[#FFA288] hover:to-[#D9766F] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Choose Again ↩</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playChime(500);
              onRestart();
            }}
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#341437]/90 border border-[#8E384C]/45 px-6 py-3 text-xs sm:text-sm font-semibold text-[#E8D3C8] shadow-md hover:bg-[#441948] hover:text-[#FFF7F0] transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Start Over 🔄</span>
          </button>
        </div>
      </div>
    </div>
  );
};
