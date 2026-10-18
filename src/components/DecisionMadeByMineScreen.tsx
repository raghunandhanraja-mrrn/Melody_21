import React, { useState } from 'react';
import { ArrowLeft, Heart, X, ZoomIn, Sparkles, Image as ImageIcon, Music } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { RomanticMusicPlayer } from './RomanticMusicPlayer';
import { DivineModal } from './DivineModal';

interface DecisionMadeByMineScreenProps {
  onGoBack: () => void;
  recipientName?: string;
  onOpenPlaylist?: () => void;
  onOpenDivine?: () => void;
}

interface GalleryImage {
  id: number;
  url: string;
  fallbackUrl: string;
  pinUrl: string;
  alt: string;
  caption: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    url: 'https://i.pinimg.com/1200x/88/6d/ca/886dcab9ef5601ebdee136693459f932.jpg',
    fallbackUrl: 'https://i.pinimg.com/736x/88/6d/ca/886dcab9ef5601ebdee136693459f932.jpg',
    pinUrl: 'https://in.pinterest.com/pin/1125548131870421839/',
    alt: 'Candid romantic still - Soft smiles and unspoken feelings',
    caption: 'Unspoken feelings & quiet laughter',
  },
  {
    id: 2,
    url: 'https://i.pinimg.com/1200x/cd/09/67/cd09671401716cf22842a7aa4df20c6d.jpg',
    fallbackUrl: 'https://i.pinimg.com/736x/cd/09/67/cd09671401716cf22842a7aa4df20c6d.jpg',
    pinUrl: 'https://in.pinterest.com/pin/425942077235248412/',
    alt: 'Gentle portrait - Radiant and expressive gaze',
    caption: 'Eyes full of wonder and grace',
  },
  {
    id: 3,
    url: 'https://i.pinimg.com/1200x/43/5f/ed/435feda63e291da108cb0f6a0f44d18a.jpg',
    fallbackUrl: 'https://i.pinimg.com/736x/43/5f/ed/435feda63e291da108cb0f6a0f44d18a.jpg',
    pinUrl: 'https://in.pinterest.com/pin/997125173765759102/',
    alt: 'With Love aesthetic cinematography - Nostalgic and romantic',
    caption: 'With love, every single chapter',
  },
  {
    id: 4,
    url: 'https://i.pinimg.com/1200x/bc/13/f0/bc13f0a1aa88a1685c6c3628bf352f3b.jpg',
    fallbackUrl: 'https://i.pinimg.com/736x/bc/13/f0/bc13f0a1aa88a1685c6c3628bf352f3b.jpg',
    pinUrl: 'https://in.pinterest.com/pin/751116044154735904/',
    alt: 'Moonlight aesthetic - Quiet night flowers and moonlight glow',
    caption: 'Under the silver glow of the moon',
  },
  {
    id: 5,
    url: 'https://i.pinimg.com/1200x/06/f3/50/06f350a84d56e3cf596b354534364503.jpg',
    fallbackUrl: 'https://i.pinimg.com/736x/06/f3/50/06f350a84d56e3cf596b354534364503.jpg',
    pinUrl: 'https://in.pinterest.com/pin/834362268512870939/',
    alt: 'Heartfelt cinematic couple moment - Timeless closeness',
    caption: 'Timeless warmth, held close forever',
  },
];

export const DecisionMadeByMineScreen: React.FC<DecisionMadeByMineScreenProps> = ({
  onGoBack,
  recipientName = 'Lishoow',
  onOpenPlaylist,
  onOpenDivine,
}) => {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [useFallback, setUseFallback] = useState<Record<number, boolean>>({});
  const [isDivineOpen, setIsDivineOpen] = useState(false);

  const handleImageError = (id: number) => {
    if (!useFallback[id]) {
      // First try fallback 736x resolution
      setUseFallback((prev) => ({ ...prev, [id]: true }));
    } else {
      // Both failed, mark as failed
      setFailedImages((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleOpenLightbox = (img: GalleryImage) => {
    soundEngine.playChime(750);
    setActiveImage(img);
  };

  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full overflow-hidden bg-transparent text-[#FFF7F0] flex flex-col items-center py-10 px-6 transition-all duration-500 font-sans z-10">
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

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-5xl w-full flex flex-col items-center">
        {/* Navigation Bar / Go Back Button */}
        <div className="w-full flex items-center justify-between mb-8">
          <button
            onClick={() => {
              soundEngine.playChime(500);
              onGoBack();
            }}
            type="button"
            className="group inline-flex items-center gap-2 rounded-full bg-[#341437]/90 px-5 py-2 text-xs font-semibold text-[#E8D3C8] shadow-md border border-[#8E384C]/45 hover:bg-[#441948] hover:text-[#FFF7F0] transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Go Back ↩</span>
          </button>

          <div className="inline-flex items-center gap-1.5 text-xs text-[#E8D3C8] font-medium">
            <Sparkles className="h-3.5 w-3.5 text-[#FDDA9D]" />
            <span>Twenty Seven Selection</span>
          </div>
        </div>

        {/* Heart / Sparkle Badge */}
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#341437]/90 shadow-md border border-[#A94C57]/50 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
          <Heart className="h-8 w-8 text-[#FDDA9D] fill-[#FDDA9D] animate-pulse" />
        </div>

        {/* Exact Heading as Requested */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF7F0] text-center">
          Decision Made By Mine 💗
        </h1>

        {/* Exact Subtitle as Requested */}
        <p className="mt-3 text-sm sm:text-base text-[#E8D3C8] font-medium tracking-normal text-center max-w-lg">
          My choice, my little world ✨
        </p>

        {/* 5-Image Responsive Gallery */}
        <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {GALLERY_IMAGES.map((img, index) => {
            const isFailed = failedImages[img.id];
            const currentSrc = useFallback[img.id] ? img.fallbackUrl : img.url;
            const spanClass = index === 0 ? 'sm:col-span-2 lg:col-span-1' : '';

            return (
              <div
                key={img.id}
                onClick={() => !isFailed && handleOpenLightbox(img)}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#8E384C]/45 bg-[#240D26]/85 p-3 shadow-lg hover:shadow-[0_8px_30px_rgba(253,218,157,0.2)] hover:border-[#FDDA9D]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer backdrop-blur-xl ${spanClass}`}
              >
                {/* Photo Frame Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#16051A]">
                  {!isFailed ? (
                    <img
                      src={currentSrc}
                      alt={img.alt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() => handleImageError(img.id)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    /* Graceful fallback if URL is blocked */
                    <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-[#240D26]">
                      <ImageIcon className="h-10 w-10 text-[#FDDA9D] mb-2" />
                      <p className="text-xs text-[#E8D3C8] font-medium">{img.caption}</p>
                    </div>
                  )}

                  {/* Hover Overlay Hint */}
                  {!isFailed && (
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#341437]/90 px-3.5 py-1.5 text-xs font-semibold text-[#FFF7F0] shadow-md border border-[#FDDA9D]/50 backdrop-blur-sm">
                        <ZoomIn className="h-3.5 w-3.5 text-[#FDDA9D]" />
                        <span>View Photo</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Caption / Note */}
                <div className="mt-3 px-1.5 pb-1 flex items-center justify-between text-xs">
                  <span className="font-medium text-[#FFF7F0]">{img.caption}</span>
                  <span className="font-mono text-[11px] text-[#B5989F]">0{index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dedicated Minimal Music Player: Twenty Seven — Decision Made By Mine 🎶 */}
        <RomanticMusicPlayer
          initialAudioUrl="https://www.masstamilan.dev/downloader/G4xhDjqmRYwKEtpdFYGO0A/1792338223/d320_cdn/41227/MjQwNToyMDE6ZTA1NDplMDhiOmQ4ZTM6ZTUxYjpkNDY2OmRjMWI="
          recipientName={recipientName}
          badgeText="Melody for Us ✨"
          title="A Special Melody by Mine 🎶"
          subtitle="Chosen with love for our little world 💗"
          songTitle="My Favorite Melody for You"
          themeColor="teal"
        />

        {/* Bottom Navigation & Divine Special Button */}
        <div className="mt-12 mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              soundEngine.playChime(500);
              onGoBack();
            }}
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FDDA9D] via-[#F8DBBD] to-[#E88E74] px-8 py-3.5 text-sm font-semibold text-[#18051B] shadow-[0_4px_24px_rgba(253,218,157,0.35)] border border-[#FDDA9D]/60 hover:scale-105 hover:shadow-[0_4px_30px_rgba(253,218,157,0.5)] transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back to Choices ↩</span>
          </button>

          {/* 🦚 Divine Button */}
          <button
            onClick={() => {
              soundEngine.playChime(659);
              setIsDivineOpen(true);
            }}
            type="button"
            className="group relative inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FDDA9D] via-[#F8DBBD] to-[#E88E74] px-8 py-3.5 text-sm font-bold text-[#18051B] shadow-[0_4px_25px_rgba(253,218,157,0.38),0_0_20px_rgba(232,142,116,0.25)] border border-[#FDDA9D]/70 hover:scale-105 hover:shadow-[0_4px_35px_rgba(253,218,157,0.6),0_0_25px_rgba(232,142,116,0.45)] active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span className="text-base group-hover:scale-125 transition-transform duration-300">🦚</span>
            <span className="tracking-wide">Divine</span>
            <Sparkles className="h-4 w-4 text-[#8E384C] group-hover:rotate-12 transition-transform" />
          </button>

          {onOpenPlaylist && (
            <button
              onClick={() => {
                soundEngine.playChime(750);
                onOpenPlaylist();
              }}
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#8E384C]/50 bg-[#280F2A]/90 px-6 py-3.5 text-sm font-semibold text-[#FDDA9D] hover:bg-[#361539] hover:border-[#E88E74]/60 transition-all active:scale-95 cursor-pointer shadow-md"
            >
              <Music className="h-4 w-4 text-[#FDDA9D]" />
              <span>A Little Playlist for You 🎧</span>
            </button>
          )}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-3xl border border-[#8E384C]/60 bg-[#1E0921] p-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 z-10 rounded-full bg-[#341437]/90 p-2 text-[#E8D3C8] hover:bg-[#441948] hover:text-[#FFF7F0] shadow-md border border-[#8E384C]/50 transition-colors cursor-pointer"
              aria-label="Close photo view"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Photo in Full Resolution */}
            <div className="relative aspect-[3/4] max-h-[75vh] w-full overflow-hidden rounded-2xl bg-[#13051A]">
              <img
                src={useFallback[activeImage.id] ? activeImage.fallbackUrl : activeImage.url}
                alt={activeImage.alt}
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="mt-4 px-2 flex items-center justify-between text-xs text-[#E8D3C8]">
              <span className="font-semibold text-sm text-[#FFF7F0]">{activeImage.caption}</span>
              <span className="italic text-[#FDDA9D]">My choice for {recipientName} ✨</span>
            </div>
          </div>
        </div>
      )}

      {/* Divine Popup Modal with Mudivuu navigation button */}
      <DivineModal
        isOpen={isDivineOpen}
        onClose={() => setIsDivineOpen(false)}
        onNavigateMudivuu={onOpenDivine}
      />
    </div>
  );
};
