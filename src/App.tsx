/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SurpriseData } from './types';
import { DEFAULT_SURPRISE_DATA } from './data/defaultSurprise';
import { loadSurpriseData, saveSurpriseData } from './utils/storage';
import { soundEngine } from './utils/audio';

import { FloatingPetals } from './components/FloatingPetals';
import { Navbar } from './components/Navbar';
import { DefaultMelodyModal } from './components/DefaultMelodyModal';
import { BackgroundWallpaper } from './components/BackgroundWallpaper';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HappyToSeeYouScreen } from './components/HappyToSeeYouScreen';
import { DecisionScreen } from './components/DecisionScreen';
import { DecisionMadeByYouScreen } from './components/DecisionMadeByYouScreen';
import { DecisionMadeByMineScreen } from './components/DecisionMadeByMineScreen';
import { PlaylistSpaceScreen } from './components/PlaylistSpaceScreen';
import { MudivuuScreen } from './components/MudivuuScreen';

type ScreenType =
  | 'welcome'
  | 'happy'
  | 'decision'
  | 'twenty-one-decision'
  | 'twenty-seven-decision'
  | 'playlist'
  | 'mudivuu';

export default function App() {
  const [data] = useState<SurpriseData>(() => loadSurpriseData());
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('happy');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [melodyErrorMessage, setMelodyErrorMessage] = useState<string | null>(null);
  const [showMelodyModal, setShowMelodyModal] = useState(false);
  const [isWallpaperUnobstructed, setIsWallpaperUnobstructed] = useState(false);

  useEffect(() => {
    saveSurpriseData(data);
  }, [data]);

  useEffect(() => {
    soundEngine.registerListeners(
      (playing) => {
        setIsMusicPlaying(playing);
      },
      (errorMsg) => {
        setMelodyErrorMessage(errorMsg);
        setShowMelodyModal(true);
      }
    );
  }, []);

  const handleToggleMusic = async () => {
    setMelodyErrorMessage(null);
    await soundEngine.toggleMusic(
      (playing) => {
        setIsMusicPlaying(playing);
      },
      (errorMsg) => {
        setMelodyErrorMessage(errorMsg);
        setShowMelodyModal(true);
      }
    );
  };

  const handleSelectMilestone = (milestone: 'twenty-one' | 'twenty-seven') => {
    setIsWallpaperUnobstructed(false);
    if (milestone === 'twenty-one') {
      setCurrentScreen('twenty-one-decision');
    } else {
      setCurrentScreen('twenty-seven-decision');
    }
  };

  const handleNavigateHome = () => {
    setIsWallpaperUnobstructed(false);
    setCurrentScreen('welcome');
  };

  const handleOpenPlaylist = () => {
    setIsWallpaperUnobstructed(false);
    if (currentScreen !== 'playlist') {
      setPreviousScreen(currentScreen);
    }
    setCurrentScreen('playlist');
  };

  const handleBackFromPlaylist = () => {
    setCurrentScreen(previousScreen === 'playlist' ? 'decision' : previousScreen);
  };

  const handleOpenMudivuu = () => {
    setIsWallpaperUnobstructed(false);
    if (currentScreen !== 'mudivuu') {
      setPreviousScreen(currentScreen);
    }
    setCurrentScreen('mudivuu');
  };

  const handleBackFromMudivuu = () => {
    setCurrentScreen(previousScreen === 'mudivuu' ? 'decision' : previousScreen);
  };

  return (
    <div className="relative min-h-screen bg-[#13051A] text-[#FFF7F0] selection:bg-[#E88E74]/40 selection:text-white font-sans overflow-x-hidden">
      {/* Global Background Wallpaper across ALL pages */}
      <BackgroundWallpaper unobstructed={isWallpaperUnobstructed && currentScreen === 'welcome'} />

      {/* Ambient Atmospheric Radial Glow from Reference Theme */}
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(142,56,76,0.25),rgba(255,255,255,0))]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed bottom-0 left-0 right-0 h-96 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(232,142,116,0.1),rgba(19,5,26,0))]"
        aria-hidden="true"
      />

      {/* Floating Starlight & Petals */}
      <FloatingPetals />

      {/* Top Navbar */}
      <Navbar
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onNavigateHome={handleNavigateHome}
        onOpenPlaylist={handleOpenPlaylist}
        isPlaylistActive={currentScreen === 'playlist'}
      />

      {/* Default Melody Upload & Direct Link Dialog */}
      <DefaultMelodyModal
        isOpen={showMelodyModal}
        errorMessage={melodyErrorMessage}
        onClose={() => setShowMelodyModal(false)}
        onSuccess={() => {
          setIsMusicPlaying(true);
        }}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex flex-col items-center justify-center">
        {/* Screen 1: Welcome Lishoow ✨ */}
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            recipientName={data.recipientName}
            isWallpaperUnobstructed={isWallpaperUnobstructed}
            onToggleWallpaperMode={() => setIsWallpaperUnobstructed((prev) => !prev)}
            onContinue={() => {
              setIsWallpaperUnobstructed(false);
              setCurrentScreen('happy');
            }}
          />
        )}

        {/* Screen 2: Welcome Setii 💗 (with Explore ✨ & playful dodging Neglect 🙈) */}
        {currentScreen === 'happy' && (
          <HappyToSeeYouScreen
            onExplore={() => {
              setIsWallpaperUnobstructed(false);
              setCurrentScreen('decision');
            }}
          />
        )}

        {/* Screen 3: Happy for Your Decision! 💗 (Choices: Twenty One 🌸 & Twenty Seven ✨) */}
        {currentScreen === 'decision' && (
          <DecisionScreen
            onSelectMilestone={handleSelectMilestone}
            onGoBack={() => setCurrentScreen('happy')}
            onOpenPlaylist={handleOpenPlaylist}
          />
        )}

        {/* Screen 4 (Twenty One Feature): Decision Made By You 💗 with 5-Image Gallery */}
        {currentScreen === 'twenty-one-decision' && (
          <DecisionMadeByYouScreen
            onGoBack={() => setCurrentScreen('decision')}
            recipientName={data.recipientName}
            onOpenPlaylist={handleOpenPlaylist}
            onOpenDivine={handleOpenMudivuu}
            onSelectMilestone={handleSelectMilestone}
          />
        )}

        {/* Screen 4 (Twenty Seven Feature): Decision Made By Mine 💗 with 5-Image Gallery */}
        {currentScreen === 'twenty-seven-decision' && (
          <DecisionMadeByMineScreen
            onGoBack={() => setCurrentScreen('decision')}
            recipientName={data.recipientName}
            onOpenPlaylist={handleOpenPlaylist}
            onOpenDivine={handleOpenMudivuu}
          />
        )}

        {/* Dedicated Playlist Space 🎶 */}
        {currentScreen === 'playlist' && (
          <PlaylistSpaceScreen
            onGoBack={handleBackFromPlaylist}
            recipientName={data.recipientName}
          />
        )}

        {/* Final Secret Surprise Page: Mudivuu 💗 */}
        {currentScreen === 'mudivuu' && (
          <MudivuuScreen
            onGoBack={handleBackFromMudivuu}
            recipientName={data.recipientName}
          />
        )}
      </main>
    </div>
  );
}
