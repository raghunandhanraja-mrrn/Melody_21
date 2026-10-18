import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MudivuuScreenProps {
  onGoBack: () => void;
  recipientName?: string;
}

const PRIMARY_MUDIVUU_IMAGE_URL =
  'https://i.pinimg.com/736x/48/29/07/4829071f99dc125bcdb98df4ed7777f9.jpg';
const FALLBACK_MUDIVUU_IMAGE_URL = '/mudivuu.jpg';

export const MudivuuScreen: React.FC<MudivuuScreenProps> = ({
  onGoBack,
  recipientName = 'Lishoow',
}) => {
  const [imageSrc, setImageSrc] = useState(PRIMARY_MUDIVUU_IMAGE_URL);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Scroll to top smoothly when entering Mudivuu page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    soundEngine.playChime(620);
  }, []);

  const handleImageError = () => {
    if (imageSrc !== FALLBACK_MUDIVUU_IMAGE_URL) {
      setImageSrc(FALLBACK_MUDIVUU_IMAGE_URL);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden bg-transparent text-[#FFF7F0] flex flex-col items-center justify-start py-8 px-4 sm:px-6 transition-all duration-500 font-sans z-10">
      {/* Decorative Atmospheric Glows */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-[#4C1A37]/50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-[#8E384C]/35 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-[560px] w-[560px] rounded-full bg-[#E88E74]/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-2xl w-full mx-auto flex flex-col items-center">
        {/* Top Navigation Row: Small Back Button */}
        <div className="w-full flex items-center justify-between mb-6">
          <button
            onClick={() => {
              soundEngine.playChime(500);
              onGoBack();
            }}
            type="button"
            className="group inline-flex items-center gap-1.5 rounded-full border border-[#8E384C]/45 bg-[#240D26]/85 px-4 py-2 text-xs sm:text-sm font-semibold text-[#E8D3C8] hover:bg-[#341437] hover:text-[#FFF7F0] hover:border-[#E88E74]/60 transition-all cursor-pointer backdrop-blur-md shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-[#FDDA9D]" />
            <span>← Back</span>
          </button>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#341437]/90 border border-[#A94C57]/50 text-[#FDDA9D] shadow-sm">
            <span>🎀</span>
            <span>Final Secret Page</span>
          </div>
        </div>

        {/* Main Mudivuu Card */}
        <div className="relative w-full overflow-hidden rounded-3xl border border-[#8E384C]/50 bg-[#240D26]/90 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.7),0_0_35px_rgba(232,142,116,0.18)] flex flex-col items-center text-center animate-fadeIn">
          {/* Ambient Top Glow */}
          <div
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-44 w-80 rounded-full bg-[#FDDA9D]/12 blur-3xl"
            aria-hidden="true"
          />

          {/* Heading */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold mb-3 bg-[#341437]/90 border border-[#FDDA9D]/40 text-[#FDDA9D] shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#FDDA9D]" />
              <span>Dedicated to {recipientName}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#FFF7F0] drop-shadow-[0_2px_15px_rgba(232,142,116,0.3)]">
              Mudivuu 💗
            </h1>
          </div>

          {/* Prominent Responsive Image Container */}
          <div className="relative w-full max-w-lg mx-auto mb-8 overflow-hidden rounded-2xl border border-[#8E384C]/50 bg-[#160519] shadow-[0_10px_35px_rgba(0,0,0,0.6)] flex items-center justify-center min-h-[300px] sm:min-h-[420px]">
            {!imageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-[#E8D3C8] bg-[#160519]/70 animate-pulse">
                <Heart className="h-6 w-6 text-[#E88E74] animate-bounce" />
                <span>Loading cherish moment...</span>
              </div>
            )}
            <img
              src={imageSrc}
              alt="Mudivuu Cherished Moment"
              referrerPolicy="no-referrer"
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              className={`max-h-[58vh] sm:max-h-[64vh] w-auto max-w-full object-contain rounded-xl shadow-lg transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </div>

          {/* Specified Quote Lines */}
          <div className="w-full max-w-lg space-y-3 pt-2 pb-4">
            {/* Line 1 */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#FFF7F0] drop-shadow-[0_2px_10px_rgba(253,218,157,0.25)]">
              Maybe in another life?
            </h2>

            {/* Line 2 */}
            <p className="text-base sm:text-lg md:text-xl font-medium italic text-[#FDDA9D] tracking-wide">
              “Anbil thodangi anbil mudikirean”
            </p>

            {/* Line 3 */}
            <p className="text-sm sm:text-base md:text-lg font-bold text-[#E88E74] tracking-normal pt-1">
              — So I'm not the One [ Decided ] 🎀
            </p>
          </div>

          {/* Bottom Back Button */}
          <div className="mt-8 pt-6 border-t border-[#8E384C]/35 w-full flex justify-center">
            <button
              onClick={() => {
                soundEngine.playChime(500);
                onGoBack();
              }}
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-8 py-3 text-sm font-semibold text-[#18051B] shadow-[0_4px_24px_rgba(232,142,116,0.4)] border border-[#FDDA9D]/40 hover:from-[#FFA288] hover:to-[#D9766F] hover:shadow-[0_4px_30px_rgba(232,142,116,0.55)] transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>← Back</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
