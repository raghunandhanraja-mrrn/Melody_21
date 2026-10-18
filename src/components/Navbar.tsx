import React from 'react';
import { Volume2, VolumeX, Sparkles, Music } from 'lucide-react';

interface NavbarProps {
  isMusicPlaying: boolean;
  onToggleMusic: () => void;
  onNavigateHome?: () => void;
  onOpenPlaylist?: () => void;
  isPlaylistActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  isMusicPlaying,
  onToggleMusic,
  onNavigateHome,
  onOpenPlaylist,
  isPlaylistActive = false,
}) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-[#8E384C]/35 bg-[#180721]/85 px-4 sm:px-6 py-3.5 backdrop-blur-md transition-colors duration-300 font-sans shadow-md">
      {/* Brand Wordmark */}
      <button
        onClick={onNavigateHome}
        type="button"
        className="group flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight text-[#FFF7F0] hover:text-[#E88E74] transition-all cursor-pointer"
      >
        <Sparkles className="h-4 w-4 text-[#FDDA9D] transition-transform group-hover:scale-110 group-hover:rotate-12" />
        <span className="bg-gradient-to-r from-[#FFF7F0] via-[#FDDA9D] to-[#E88E74] bg-clip-text text-transparent">
          Lishoow ✨
        </span>
      </button>

      {/* Nav Actions: Playlist & Ambient Melody Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenPlaylist && (
          <button
            onClick={onOpenPlaylist}
            type="button"
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 sm:px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              isPlaylistActive
                ? 'border-[#E88E74] bg-gradient-to-r from-[#E88E74] to-[#CB6C65] text-[#18051B] shadow-[0_0_15px_rgba(232,142,116,0.35)]'
                : 'border-[#8E384C]/45 bg-[#280F2A]/80 text-[#E8D3C8] hover:bg-[#361539] hover:text-[#FFF7F0] hover:border-[#E88E74]/50'
            }`}
          >
            <Music className={`h-3.5 w-3.5 ${isPlaylistActive ? 'text-[#18051B]' : 'text-[#FDDA9D]'}`} />
            <span>Playlist 🎶</span>
          </button>
        )}

        <button
          onClick={onToggleMusic}
          type="button"
          aria-label={isMusicPlaying ? 'Mute ambient melody' : 'Play ambient melody'}
          className={`inline-flex items-center gap-2 rounded-full border px-3 sm:px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${
            isMusicPlaying
              ? 'border-[#E88E74]/60 bg-[#E88E74]/20 text-[#FFF7F0] shadow-[0_0_15px_rgba(232,142,116,0.25)]'
              : 'border-[#8E384C]/40 bg-[#280F2A]/80 text-[#E8D3C8] hover:bg-[#361539] hover:text-[#FFF7F0]'
          }`}
        >
          {isMusicPlaying ? (
            <>
              <Volume2 className="h-3.5 w-3.5 animate-pulse text-[#E88E74]" />
              <span className="hidden sm:inline">Melody Playing</span>
            </>
          ) : (
            <>
              <VolumeX className="h-3.5 w-3.5 text-[#B5989F]" />
              <span className="hidden sm:inline">Play Melody</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
