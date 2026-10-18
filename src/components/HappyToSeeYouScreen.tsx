import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface HappyToSeeYouScreenProps {
  onExplore: () => void;
}

export const HappyToSeeYouScreen: React.FC<HappyToSeeYouScreenProps> = ({ onExplore }) => {
  const [attempts, setAttempts] = useState(0);
  const [dodgeOffset, setDodgeOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isWobbling, setIsWobbling] = useState(false);
  const [hasDisappeared, setHasDisappeared] = useState(false);
  const [playfulNote, setPlayfulNote] = useState<string>('Your next little adventure is waiting for you.');

  const safeOffsets = [
    { x: 35, y: -45 },
    { x: -25, y: 55 },
    { x: 45, y: 40 },
    { x: -40, y: -50 },
    { x: 45, y: -20 },
    { x: 15, y: 60 },
  ];

  const handleDodge = (e?: React.MouseEvent | React.TouchEvent) => {
    if (hasDisappeared) return;
    if (e) {
      e.preventDefault();
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setIsWobbling(true);

    if (nextAttempts >= 4) {
      soundEngine.playPoof();
      setHasDisappeared(true);
      setPlayfulNote('Poof! 💨 Neglect vanished into thin air! Only Explore remains 💖');
      return;
    }

    soundEngine.playDodge();
    const nextOffset = safeOffsets[nextAttempts % safeOffsets.length];
    setDodgeOffset(nextOffset);

    if (nextAttempts === 1) {
      setPlayfulNote("Hmm… someone doesn't want you to click that! 😜");
    } else if (nextAttempts === 2) {
      setPlayfulNote("Hey! That button is ticklish! 🙈");
    } else if (nextAttempts === 3) {
      setPlayfulNote("Almost caught it! One more try… ✨");
    }

    setTimeout(() => {
      setIsWobbling(false);
    }, 250);
  };

  const handleExploreClick = () => {
    soundEngine.playFanfare();
    onExplore();
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden bg-transparent text-[#FFF7F0] flex flex-col items-center justify-center px-6 transition-all duration-700 font-sans z-10">
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
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full bg-[#E88E74]/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Center Interactive Glass Card */}
      <div className="relative z-10 mx-auto max-w-xl w-full text-center rounded-3xl border border-[#8E384C]/45 bg-[#240D26]/85 p-8 sm:p-12 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_35px_rgba(232,142,116,0.12)] animate-fadeIn">
        {/* Heart Badge */}
        <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#341437]/90 shadow-md border border-[#A94C57]/50 backdrop-blur-sm transition-transform duration-300 hover:scale-110">
          <Heart className="h-8 w-8 text-[#E88E74] fill-[#E88E74] animate-pulse" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF7F0]">
          Welcome Setii 💗
        </h2>

        {/* Dynamic Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-[#E8D3C8] font-medium tracking-normal transition-all duration-300 min-h-[2.5rem] flex items-center justify-center">
          {attempts === 0 ? 'I have a little surprise for you…' : playfulNote}
        </p>

        {/* Buttons Playground Container - Zero Layout Shift */}
        <div className="relative mt-8 min-h-[140px] flex items-center justify-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
            {/* Primary CTA: Explore Button (Completely Stationary & Rock-Solid) */}
            <button
              onClick={handleExploreClick}
              type="button"
              className="group relative z-20 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-9 py-3.5 text-sm sm:text-base font-semibold text-[#18051B] shadow-[0_4px_24px_rgba(232,142,116,0.4)] border border-[#FDDA9D]/40 transition-all duration-300 hover:scale-105 hover:from-[#FFA288] hover:to-[#D9766F] hover:shadow-[0_4px_30px_rgba(232,142,116,0.55)] active:scale-95 focus:outline-none cursor-pointer"
            >
              <span>Explore ✨</span>
            </button>

            {/* Playful Dodging Neglect Button */}
            {!hasDisappeared ? (
              <div className="relative inline-block">
                <button
                  type="button"
                  onMouseEnter={() => handleDodge()}
                  onTouchStart={(e) => handleDodge(e)}
                  onClick={(e) => handleDodge(e)}
                  style={{
                    transform: `translate(${dodgeOffset.x}px, ${dodgeOffset.y}px) ${
                      isWobbling ? 'scale(0.85) rotate(-8deg)' : 'scale(1) rotate(0deg)'
                    }`,
                    transition: 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease',
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#38153A] px-8 py-3.5 text-sm sm:text-base font-semibold text-[#F8DBBD] shadow-md border border-[#8E384C]/50 hover:bg-[#481B4B] hover:border-[#A94C57]/60 transition-colors cursor-pointer select-none"
                  aria-label="Neglect button (playful)"
                >
                  <span>Neglect 🙈</span>
                </button>
              </div>
            ) : (
              /* When Neglect has disappeared */
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#38153A]/90 border border-[#8E384C]/45 text-xs font-medium text-[#E8D3C8] animate-fadeIn">
                <span>💨 Button vanished! Only Explore remains 💕</span>
              </div>
            )}
          </div>
        </div>

        {/* Small hint footer */}
        <div className="mt-4 text-xs text-[#B5989F]">
          {attempts > 0 && !hasDisappeared && (
            <span className="italic font-sans">
              Attempt {attempts} of 4 — it really doesn't want to be neglected! 😄
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
