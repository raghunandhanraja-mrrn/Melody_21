import React, { useEffect, useState } from 'react';
import { X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface DivineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateMudivuu?: () => void;
}

const PRIMARY_DIVINE_IMAGE_URL =
  'https://i.pinimg.com/736x/f8/69/bb/f869bbdc76fee8b9e5a5b8c1fbda88c6.jpg';
const FALLBACK_DIVINE_IMAGE_URL = '/divine_murugan.jpg';

export const DivineModal: React.FC<DivineModalProps> = ({
  isOpen,
  onClose,
  onNavigateMudivuu,
}) => {
  const [imageSrc, setImageSrc] = useState(PRIMARY_DIVINE_IMAGE_URL);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset image state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImageSrc(PRIMARY_DIVINE_IMAGE_URL);
      setImageError(false);
      setImageLoaded(false);
    }
  }, [isOpen]);

  // Prevent background scrolling while popup is open and support Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Play a gentle devotional chime when opened
    soundEngine.playChime(659.25);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleImageError = () => {
    // If primary Pinterest URL has CDN or CORS issues, immediately switch to the local public asset
    if (imageSrc !== FALLBACK_DIVINE_IMAGE_URL) {
      setImageSrc(FALLBACK_DIVINE_IMAGE_URL);
    } else {
      setImageError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="divine-quote-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md transition-all duration-300 animate-fadeIn"
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="relative max-w-md sm:max-w-lg w-full max-h-[92vh] overflow-y-auto rounded-3xl border border-[#FDDA9D]/60 bg-[#200A23]/95 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(253,218,157,0.22)] flex flex-col items-center text-center transition-all duration-300 transform scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div
          className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-44 w-72 rounded-full bg-[#FDDA9D]/15 blur-2xl"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close divine popup"
          className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#341437]/90 text-[#E8D3C8] hover:bg-[#441948] hover:text-[#FFF7F0] border border-[#8E384C]/50 shadow-md transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Divine Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold mb-4 bg-[#341437]/90 border border-[#FDDA9D]/40 text-[#FDDA9D] shadow-sm">
          <span>🦚</span>
          <span>Divine Blessing</span>
          <Sparkles className="h-3.5 w-3.5 text-[#FDDA9D]" />
        </div>

        {/* Image Display Area */}
        <div className="relative w-full flex items-center justify-center mb-6 overflow-hidden rounded-2xl border border-[#8E384C]/40 bg-[#160519] shadow-inner min-h-[260px] sm:min-h-[340px]">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-xs text-[#E8D3C8] bg-[#160519]/70 animate-pulse">
              <span className="text-xl">🦚</span>
              <span>Loading divine darshan...</span>
            </div>
          )}

          {imageError ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-xs text-[#E8D3C8] gap-3">
              <AlertCircle className="h-6 w-6 text-[#E88E74]" />
              <p className="max-w-xs">
                Unable to load the image. Click retry to reload.
              </p>
              <button
                onClick={() => {
                  setImageError(false);
                  setImageLoaded(false);
                  setImageSrc(FALLBACK_DIVINE_IMAGE_URL);
                }}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#341437] border border-[#FDDA9D]/40 px-3.5 py-1.5 text-xs text-[#FDDA9D] hover:bg-[#441948] cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Loading</span>
              </button>
            </div>
          ) : (
            <img
              src={imageSrc}
              alt="Divine Murugan"
              referrerPolicy="no-referrer"
              loading="eager"
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              className={`max-h-[52vh] sm:max-h-[58vh] w-auto max-w-full object-contain rounded-xl shadow-lg transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>

        {/* Quote Section */}
        <div className="w-full pt-1 px-2">
          {/* Main Quote */}
          <h3
            id="divine-quote-title"
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#FFF7F0] drop-shadow-[0_2px_12px_rgba(253,218,157,0.3)]"
          >
            Nee Illamal Naan Illaye
          </h3>

          {/* Attribution */}
          <p className="mt-2 text-sm sm:text-base font-semibold text-[#FDDA9D] tracking-wide">
            — Un Appan Murugan 🦚
          </p>

          <p className="mt-3 text-xs text-[#E8D3C8]/80 font-medium tracking-normal">
            A timeless blessing held close forever ✨
          </p>

          {/* Mudivuu Action Button inside Divine popup */}
          {onNavigateMudivuu && (
            <div className="mt-6 pt-5 border-t border-[#8E384C]/40 w-full flex flex-col items-center">
              <button
                onClick={() => {
                  soundEngine.playChime(700);
                  onClose();
                  onNavigateMudivuu();
                }}
                type="button"
                className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#E88E74] via-[#CB6C65] to-[#E88E74] px-8 py-3 text-sm sm:text-base font-bold text-[#18051B] shadow-[0_4px_22px_rgba(232,142,116,0.45)] border border-[#FDDA9D]/60 hover:scale-105 hover:from-[#FFA288] hover:to-[#D9766F] hover:shadow-[0_4px_30px_rgba(232,142,116,0.65)] active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <span className="text-base group-hover:scale-125 transition-transform duration-300">🎀</span>
                <span>Mudivuu</span>
                <Sparkles className="h-4 w-4 text-[#18051B] group-hover:rotate-12 transition-transform" />
              </button>
              <p className="mt-2 text-[11px] text-[#E8D3C8]/70">
                Click to reveal the final reflection 💗
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
