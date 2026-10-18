import React, { useState } from 'react';

const PRIMARY_WALLPAPER_URL = 'https://i.pinimg.com/736x/9b/39/b3/9b39b39b95c2f18759a82ca66e18f7c3.jpg';
const FALLBACK_WALLPAPER_URL = '/front_wallpaper.jpg';

interface BackgroundWallpaperProps {
  unobstructed?: boolean;
}

export const BackgroundWallpaper: React.FC<BackgroundWallpaperProps> = ({ unobstructed = false }) => {
  const [wallpaperSrc, setWallpaperSrc] = useState(PRIMARY_WALLPAPER_URL);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
      {/* High-fidelity full PC wallpaper image */}
      <img
        src={wallpaperSrc}
        alt="Atmospheric Wallpaper"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (wallpaperSrc !== FALLBACK_WALLPAPER_URL) {
            setWallpaperSrc(FALLBACK_WALLPAPER_URL);
          }
        }}
        className={`h-full w-full object-cover object-center transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
        } ${unobstructed ? 'brightness-100 contrast-100' : 'brightness-[0.78] contrast-[1.08]'}`}
      />

      {/* Atmospheric Vignette & Color Balance Overlay for Perfect Readability */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          unobstructed
            ? 'opacity-30 bg-gradient-to-t from-black/70 via-transparent to-black/30'
            : 'opacity-100 bg-gradient-to-t from-[#13051A]/85 via-[#13051A]/40 to-[#13051A]/60'
        }`}
      />

      {/* Subtle emerald tint overlay matching image aesthetic */}
      <div
        className={`absolute inset-0 bg-[#1A2B29]/25 mix-blend-multiply transition-opacity duration-700 ${
          unobstructed ? 'opacity-10' : 'opacity-100'
        }`}
      />

      {/* Radial soft focus center vignette */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,rgba(19,5,26,0.65)_100%)] transition-opacity duration-700 ${
          unobstructed ? 'opacity-25' : 'opacity-100'
        }`}
      />
    </div>
  );
};
