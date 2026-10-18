import React from 'react';
import { Heart, Sparkles, ArrowLeft, Music } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface DecisionScreenProps {
  onSelectMilestone: (milestone: 'twenty-one' | 'twenty-seven') => void;
  onGoBack: () => void;
  onOpenPlaylist?: () => void;
}

export const DecisionScreen: React.FC<DecisionScreenProps> = ({
  onSelectMilestone,
  onGoBack,
  onOpenPlaylist,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden bg-transparent text-[#FFF7F0] flex flex-col items-center justify-center px-6 transition-all duration-500 font-sans z-10">
      {/* Decorative Atmospheric Glows from Reference Theme */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#4C1A37]/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#8E384C]/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-[#E88E74]/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Main Centered Content */}
      <div className="relative z-10 mx-auto max-w-xl w-full text-center rounded-3xl border border-[#8E384C]/45 bg-[#240D26]/85 p-8 sm:p-12 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_35px_rgba(232,142,116,0.12)] animate-fadeIn">
        {/* Heart Badge */}
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#341437]/90 shadow-md border border-[#A94C57]/50 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
          <Heart className="h-8 w-8 text-[#E88E74] fill-[#E88E74] animate-pulse" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF7F0]">
          Happy for Your Decision! 💗
        </h2>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-[#E8D3C8] font-medium tracking-normal">
          Now, make one more little choice…
        </p>

        {/* The Two Choices: Twenty One 🌸 & Twenty Seven ✨ */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          {/* Twenty One 🌸 Button */}
          <button
            onClick={() => {
              soundEngine.playChime(784);
              onSelectMilestone('twenty-one');
            }}
            type="button"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-8 py-3.5 text-sm sm:text-base font-semibold text-[#18051B] shadow-[0_4px_24px_rgba(232,142,116,0.4)] border border-[#FDDA9D]/40 transition-all duration-300 hover:scale-105 hover:from-[#FFA288] hover:to-[#D9766F] hover:shadow-[0_4px_30px_rgba(232,142,116,0.55)] active:scale-95 cursor-pointer"
          >
            <span>Twenty One 🌸</span>
          </button>

          {/* Twenty Seven ✨ Button */}
          <button
            onClick={() => {
              soundEngine.playChime(880);
              onSelectMilestone('twenty-seven');
            }}
            type="button"
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FDDA9D] via-[#F8DBBD] to-[#E88E74] px-8 py-3.5 text-sm sm:text-base font-semibold text-[#18051B] shadow-[0_4px_24px_rgba(253,218,157,0.35)] border border-[#FDDA9D]/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_4px_30px_rgba(253,218,157,0.5)] active:scale-95 cursor-pointer"
          >
            <span>Twenty Seven ✨</span>
          </button>
        </div>

        {/* Navigation & Playlist Link */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              soundEngine.playChime(500);
              onGoBack();
            }}
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-[#341437]/90 px-6 py-2.5 text-xs font-semibold text-[#E8D3C8] shadow-md border border-[#8E384C]/45 hover:bg-[#441948] hover:text-[#FFF7F0] transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Go Back ↩</span>
          </button>

          {onOpenPlaylist && (
            <button
              onClick={() => {
                soundEngine.playChime(750);
                onOpenPlaylist();
              }}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#8E384C]/50 bg-[#280F2A]/90 px-6 py-2.5 text-xs font-semibold text-[#FDDA9D] hover:bg-[#361539] hover:border-[#E88E74]/60 transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Music className="h-3.5 w-3.5 text-[#FDDA9D]" />
              <span>A Little Playlist for You 🎧</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
