import React, { useState } from 'react';
import { ArrowLeft, Heart, X, ZoomIn, Sparkles, Image as ImageIcon, Music } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { RomanticMusicPlayer } from './RomanticMusicPlayer';
import { DivineModal } from './DivineModal';

interface DecisionMadeByYouScreenProps {
  onGoBack: () => void;
  recipientName?: string;
  onOpenPlaylist?: () => void;
  onOpenDivine?: () => void;
  onSelectMilestone: (milestone: 'twenty-one' | 'twenty-seven') => void;
}

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  caption: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  {
    id: 1,
    url: 'https://i.pinimg.com/1200x/24/83/31/24833118bd6a0bded68acc079d2e20e8.jpg',
    alt: 'Cherished Moment 1 for Lishoow',
    caption: 'Soft sunlight & pure warmth',
  },
  {
    id: 2,
    url: 'https://i.pinimg.com/1200x/2f/e3/58/2fe3588a7f415b7820bab453262c3ca4.jpg',
    alt: 'Cherished Moment 2 for Lishoow',
    caption: 'Quiet gentle smiles',
  },
  {
    id: 3,
    url: 'https://i.pinimg.com/736x/68/65/72/686572d3ebb132718f1a7594c7e5f394.jpg',
    alt: 'Cherished Moment 3 for Lishoow',
    caption: 'The sweetest memories',
  },
  {
    id: 4,
    url: 'https://i.pinimg.com/1200x/fe/a2/91/fea2913a6617f93617de675ef7cc86b2.jpg',
    alt: 'Cherished Moment 4 for Lishoow',
    caption: 'Radiant and unforgettable',
  },
  {
    id: 5,
    url: 'https://i.pinimg.com/1200x/05/55/dd/0555dd346b47386b1131b453ec1c70ce.jpg',
    alt: 'Cherished Moment 5 for Lishoow',
    caption: 'Always in my heart',
  },
];

export const DecisionMadeByYouScreen: React.FC<DecisionMadeByYouScreenProps> = ({
  onGoBack,
  recipientName = 'Lishoow',
  onOpenPlaylist,
  onOpenDivine,
  onSelectMilestone,
}) => {
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [isDivineOpen, setIsDivineOpen] = useState(false);

  const handleImageError = (id: number) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
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
            <Heart className="h-3.5 w-3.5 text-[#E88E74] fill-[#E88E74]" />
            <span>Twenty One Selection</span>
          </div>
        </div>

        {/* Heart Badge */}
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#341437]/90 shadow-md border border-[#A94C57]/50 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
          <Heart className="h-8 w-8 text-[#E88E74] fill-[#E88E74] animate-pulse" />
        </div>

        {/* Heading Exactly as Requested */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF7F0] text-center">
          Decision Made By You 💗
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-sm sm:text-base text-[#E8D3C8] font-medium tracking-normal text-center max-w-lg">
          Five cherished snapshots chosen with all my heart for you, {recipientName}.
        </p>

        {/* 5-Image Responsive Gallery */}
        <div className="mt-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {GALLERY_IMAGES.map((img, index) => {
            const isFailed = failedImages[img.id];
            const spanClass = index === 0 ? 'sm:col-span-2 lg:col-span-1' : '';

            return (
              <div
                key={img.id}
                onClick={() => !isFailed && handleOpenLightbox(img)}
                className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#8E384C]/45 bg-[#240D26]/85 p-3 shadow-lg hover:shadow-[0_8px_30px_rgba(232,142,116,0.22)] hover:border-[#E88E74]/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer backdrop-blur-xl ${spanClass}`}
              >
                {/* Photo Frame Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#16051A]">
                  {!isFailed ? (
                    <img
                      src={img.url}
                      alt={img.alt}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      onError={() => handleImageError(img.id)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    /* Graceful fallback if URL is blocked */
                    <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center bg-[#240D26]">
                      <ImageIcon className="h-10 w-10 text-[#E88E74] mb-2" />
                      <p className="text-xs text-[#E8D3C8] font-medium">{img.caption}</p>
                    </div>
                  )}

                  {/* Hover Overlay Hint */}
                  {!isFailed && (
                    <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#341437]/90 px-3.5 py-1.5 text-xs font-semibold text-[#FFF7F0] shadow-md border border-[#E88E74]/50 backdrop-blur-sm">
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

        {/* Custom Minimal Music Player: A Little Melody for You 🎶 */}
        <RomanticMusicPlayer
          initialAudioUrl="https://www.masstamilan.dev/downloader/a6jtPrN6wLAf8WT8aWn4fg/1792338106/d320_cdn/21973/MjAwMTo0ODYwOjc6ODA1Ojo5MQ=="
          recipientName={recipientName}
          badgeText="Melody for You 🌸"
          title="A Little Melody for You 🎶"
          subtitle="Sit back, relax, and enjoy this melody 💗"
          songTitle="Special Melody for You"
          themeColor="peach"
        />

        {/* Bottom Navigation: Exactly One Button (Twenty Seven ✨) */}
        <div className="mt-12 mb-6 flex items-center justify-center">
          <button
            onClick={() => {
              soundEngine.playChime(880);
              onSelectMilestone('twenty-seven');
            }}
            type="button"
            className="group inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#FDDA9D] via-[#F8DBBD] to-[#E88E74] px-10 py-4 text-base font-bold text-[#18051B] shadow-[0_4px_28px_rgba(253,218,157,0.45),0_0_20px_rgba(232,142,116,0.3)] border border-[#FDDA9D]/70 hover:scale-105 hover:shadow-[0_4px_35px_rgba(253,218,157,0.65)] active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span>Twenty Seven ✨</span>
            <Sparkles className="h-4 w-4 text-[#8E384C] group-hover:rotate-12 transition-transform" />
          </button>
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
                src={activeImage.url}
                alt={activeImage.alt}
                referrerPolicy="no-referrer"
                className="h-full w-full object-contain"
              />
            </div>

            {/* Lightbox Footer */}
            <div className="mt-4 px-2 flex items-center justify-between text-xs text-[#E8D3C8]">
              <span className="font-semibold text-sm text-[#FFF7F0]">{activeImage.caption}</span>
              <span className="italic text-[#FDDA9D]">For {recipientName} 💗</span>
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
