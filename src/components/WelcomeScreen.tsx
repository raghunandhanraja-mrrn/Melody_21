import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Heart, Eye, EyeOff } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface WelcomeScreenProps {
  onContinue: () => void;
  recipientName?: string;
  isWallpaperUnobstructed?: boolean;
  onToggleWallpaperMode?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onContinue,
  recipientName = 'Lishoow',
  isWallpaperUnobstructed = false,
  onToggleWallpaperMode,
}) => {
  const [internalHideCard, setInternalHideCard] = useState(false);
  const hideCard = onToggleWallpaperMode ? isWallpaperUnobstructed : internalHideCard;

  const handleManualContinue = () => {
    soundEngine.playChime(660);
    onContinue();
  };

  const handleToggleWallpaperView = () => {
    soundEngine.playChime(520);
    if (onToggleWallpaperMode) {
      onToggleWallpaperMode();
    } else {
      setInternalHideCard((prev) => !prev);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden text-[#FFF7F0] flex flex-col items-center justify-center px-6 transition-all duration-700 font-sans z-10">
      {/* Full Wallpaper Mode Toggle (Floating Pill in Corner) */}
      <div className="fixed bottom-5 right-5 z-30">
        <button
          onClick={handleToggleWallpaperView}
          type="button"
          aria-label={hideCard ? 'Show welcome card' : 'View full wallpaper'}
          className="group flex items-center gap-2 rounded-full border border-[#8E384C]/50 bg-[#1A0824]/85 px-3.5 py-2 text-xs font-medium text-[#FFF7F0] shadow-lg backdrop-blur-md transition-all hover:bg-[#280F2A] hover:border-[#E88E74]/60 hover:scale-105 cursor-pointer"
        >
          {hideCard ? (
            <>
              <Eye className="h-3.5 w-3.5 text-[#FDDA9D] transition-transform group-hover:scale-110" />
              <span>Show Welcome Card</span>
            </>
          ) : (
            <>
              <EyeOff className="h-3.5 w-3.5 text-[#E88E74] transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Full Wallpaper View</span>
            </>
          )}
        </button>
      </div>

      {/* Decorative Atmospheric Glows (subtle accents) */}
      {!hideCard && (
        <>
          <div
            className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#4C1A37]/40 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#8E384C]/30 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#E88E74]/15 blur-3xl"
            aria-hidden="true"
          />

          {/* Floating subtle warm decorative shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="absolute top-[18%] left-[15%] animate-bounce text-[#FDDA9D] opacity-80" style={{ animationDuration: '3s' }}>
              <Sparkles className="h-6 w-6" />
            </div>
            <div className="absolute top-[22%] right-[18%] animate-pulse text-[#E88E74] opacity-75" style={{ animationDuration: '2.5s' }}>
              <Heart className="h-5 w-5 fill-current" />
            </div>
            <div className="absolute bottom-[24%] left-[20%] animate-bounce text-[#A94C57] opacity-75" style={{ animationDuration: '3.6s' }}>
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="absolute bottom-[28%] right-[16%] animate-pulse text-[#FDDA9D] opacity-80" style={{ animationDuration: '2.8s' }}>
              <Heart className="h-6 w-6 fill-current" />
            </div>
          </div>
        </>
      )}

      {/* Centered Glassmorphic Card */}
      <div
        className={`relative z-10 mx-auto max-w-lg w-full text-center rounded-3xl border border-[#8E384C]/50 bg-[#240D26]/80 p-8 sm:p-12 backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.7),0_0_35px_rgba(232,142,116,0.15)] transition-all duration-500 ${
          hideCard
            ? 'opacity-0 scale-95 pointer-events-none translate-y-6'
            : 'opacity-100 scale-100 translate-y-0 animate-fadeIn'
        }`}
      >
        {/* Animated Sparkle Icon Badge */}
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#341437]/90 shadow-md border border-[#A94C57]/50 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
          <Sparkles className="h-8 w-8 text-[#FDDA9D] animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        {/* Primary Welcome Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF7F0] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Welcome {recipientName} ✨
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-[#E8D3C8] font-medium tracking-normal drop-shadow-sm">
          Something special is waiting for you…
        </p>

        {/* Gentle guidance text */}
        <p className="mt-6 text-xs text-[#E8D3C8]/80 font-medium tracking-wide">
          Take your time ✨ Click below when you are ready
        </p>

        {/* Continue Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={handleManualContinue}
            type="button"
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#E88E74] via-[#E88E74] to-[#CB6C65] px-8 py-3 text-sm font-semibold text-[#18051B] shadow-[0_4px_24px_rgba(232,142,116,0.4)] border border-[#FDDA9D]/60 hover:from-[#FFA288] hover:to-[#D9766F] hover:shadow-[0_4px_30px_rgba(232,142,116,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span className="tracking-wide">Continue to Setii</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

