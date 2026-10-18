import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Music,
  RotateCcw,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { soundEngine, DEFAULT_APP_MELODY_URL } from '../utils/audio';

interface RomanticMusicPlayerProps {
  initialAudioUrl?: string;
  recipientName?: string;
  badgeText?: string;
  title?: string;
  subtitle?: string;
  songTitle?: string;
  themeColor?: 'peach' | 'teal';
}

export const RomanticMusicPlayer: React.FC<RomanticMusicPlayerProps> = ({
  initialAudioUrl = DEFAULT_APP_MELODY_URL,
  recipientName = 'Lishoow',
  badgeText = 'Melody for Her',
  title = 'A Little Melody for You 🎶',
  subtitle = 'Sit back, relax, and enjoy this melody 💗',
  songTitle: initialSongTitle = 'Special Melody for You',
  themeColor = 'peach',
}) => {
  const [audioUrl, setAudioUrl] = useState<string>(initialAudioUrl);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentSongTitle, setCurrentSongTitle] = useState<string>(initialSongTitle);
  const [isCustomSource, setIsCustomSource] = useState<boolean>(false);
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize and clean up audio on unmount
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    // Check accessibility of provided URL
    try {
      audio.src = initialAudioUrl;
      audio.load();
    } catch {
      // Ignored, error event will handle
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
      setErrorMessage(null);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleWaiting = () => {
      setIsLoading(true);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setIsPlaying(true);
      setErrorMessage(null);
    };

    const handleError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setErrorMessage(
        'The provided music link is protected or requires direct access (HTTP 403 / Cloudflare). You can easily upload the audio file (.mp3) or paste a direct audio URL below.'
      );
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    // Stop page player if global app melody starts playing
    const handleGlobalMelodyPlaying = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('app-melody-playing', handleGlobalMelodyPlaying);

    return () => {
      // Ensure audio stops playing immediately when user leaves the page
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
      window.removeEventListener('app-melody-playing', handleGlobalMelodyPlaying);
      audioRef.current = null;
    };
  }, []);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle play / pause toggle
  const handleTogglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // Stop global application melody to prevent simultaneous audio
    soundEngine.stopMusic();

    try {
      setErrorMessage(null);

      // If audio element does not have src set yet, set it now
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = audioUrl;
      }

      setIsLoading(true);
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      setIsPlaying(false);
      setErrorMessage(
        'The music source is protected or restricted by the host server (HTTP 403 / Cloudflare). Please upload your song file (.mp3) or supply a direct audio URL below.'
      );
    }
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Handle mute toggle
  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Handle local audio file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playChime(700);
    const objectUrl = URL.createObjectURL(file);
    setAudioUrl(objectUrl);
    setCurrentSongTitle(file.name.replace(/\.[^/.]+$/, ''));
    setIsCustomSource(true);
    setErrorMessage(null);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = objectUrl;
      audioRef.current.load();
      setIsLoading(false);
    }
  };

  // Handle direct audio URL submission
  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    soundEngine.playChime(650);
    setAudioUrl(inputUrl.trim());
    setCurrentSongTitle('Custom Audio Stream');
    setIsCustomSource(true);
    setErrorMessage(null);
    setCurrentTime(0);
    setShowUrlInput(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = inputUrl.trim();
      audioRef.current.load();
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-2xl mx-auto mt-14 mb-8">
      {/* Section Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold mb-2 bg-[#341437]/90 border border-[#A94C57]/50 text-[#FDDA9D] shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-[#FDDA9D]" />
          <span>{badgeText}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#FFF7F0]">
          {title}
        </h2>
        <p className="mt-1.5 text-sm sm:text-base text-[#E8D3C8] font-medium tracking-normal">
          {subtitle}
        </p>
      </div>

      {/* Main Music Player Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#8E384C]/50 bg-[#240D26]/90 p-6 sm:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_35px_rgba(232,142,116,0.12)] hover:border-[#E88E74]/40 transition-all duration-300 backdrop-blur-xl">
        {/* Decorative subtle background accents */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full blur-2xl bg-[#4C1A37]/45"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#E88E74]/15 blur-2xl"
          aria-hidden="true"
        />

        {/* Track Info & Animated Icon Header */}
        <div className="relative z-10 flex items-center justify-between gap-4 pb-5 border-b border-[#8E384C]/35">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Animated Vinyl / Music Note Badge */}
            <div
              className={`relative flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 shadow-md ${
                isPlaying
                  ? 'bg-gradient-to-tr from-[#E88E74] to-[#CB6C65] border-[#FDDA9D]/60 rotate-12 scale-105'
                  : 'bg-[#341437] border-[#8E384C]/50'
              }`}
            >
              <Music
                className={`h-6 w-6 ${
                  isPlaying ? 'text-[#18051B] animate-bounce' : 'text-[#FDDA9D]'
                } transition-transform duration-700`}
              />
              {isPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FDDA9D]"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FDDA9D]"></span>
                </span>
              )}
            </div>

            {/* Song Title and Status */}
            <div className="truncate">
              <h3 className="text-base sm:text-lg font-bold text-[#FFF7F0] truncate">
                {currentSongTitle}
              </h3>
              <p className="text-xs text-[#E8D3C8] font-medium flex items-center gap-1.5 mt-0.5">
                {isCustomSource ? (
                  <span className="inline-flex items-center gap-1 text-[#FDDA9D]">
                    <CheckCircle2 className="h-3 w-3" />
                    Custom Audio Loaded
                  </span>
                ) : (
                  <span>Dedicated to {recipientName} ✨</span>
                )}
              </p>
            </div>
          </div>

          {/* Quick Upload / Source Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              title="Upload your MP3 or audio file"
              className="inline-flex items-center gap-1 rounded-full bg-[#341437]/90 px-3 py-1.5 text-xs font-medium text-[#E8D3C8] hover:bg-[#441948] hover:text-[#FFF7F0] transition-colors border border-[#8E384C]/45 cursor-pointer"
            >
              <Upload className="h-3 w-3" />
              <span className="hidden sm:inline">Upload Song</span>
            </button>
            <button
              onClick={() => setShowUrlInput((prev) => !prev)}
              type="button"
              title="Provide audio link"
              className="inline-flex items-center gap-1 rounded-full bg-[#341437]/90 p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-[#E8D3C8] hover:bg-[#441948] hover:text-[#FFF7F0] transition-colors border border-[#8E384C]/45 cursor-pointer"
            >
              <LinkIcon className="h-3 w-3" />
              <span className="hidden sm:inline">Direct Link</span>
            </button>
          </div>
        </div>

        {/* Direct URL Input Popup / Expandable */}
        {showUrlInput && (
          <form
            onSubmit={handleApplyUrl}
            className="relative z-10 mt-4 p-3 rounded-2xl bg-[#1A071E] border border-[#8E384C]/50 flex flex-col sm:flex-row items-center gap-2 animate-fadeIn"
          >
            <input
              type="url"
              placeholder="Paste direct audio URL (e.g. https://.../song.mp3)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-[#8E384C]/50 bg-[#280F2A] text-[#FFF7F0] placeholder-[#B5989F] focus:outline-none focus:ring-1 focus:ring-[#E88E74]"
            />
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
              <button
                type="submit"
                className="rounded-xl bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-3.5 py-2 text-xs font-semibold text-[#18051B] hover:from-[#FFA288] hover:to-[#D9766F] transition-colors cursor-pointer"
              >
                Set Audio
              </button>
              <button
                type="button"
                onClick={() => setShowUrlInput(false)}
                className="text-xs text-[#B5989F] hover:text-[#FFF7F0] px-2 py-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Error Notice with helpful fallback upload button */}
        {errorMessage && (
          <div className="relative z-10 mt-4 p-4 rounded-2xl bg-[#2D1022] border border-[#A94C57]/60 text-[#E8D3C8] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-[#E88E74] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-[#FFF7F0]">Audio Access Protected: </span>
                {errorMessage}
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              type="button"
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-3.5 py-1.5 text-xs font-semibold text-[#18051B] hover:from-[#FFA288] hover:to-[#D9766F] transition-all cursor-pointer shadow-md"
            >
              <Upload className="h-3 w-3" />
              <span>Upload Audio File</span>
            </button>
          </div>
        )}

        {/* Progress Bar & Scrubbing */}
        <div className="relative z-10 mt-6">
          <div className="relative group flex items-center">
            {/* Custom Track Background */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-[#361539]">
              <div
                className="h-full bg-gradient-to-r from-[#FDDA9D] via-[#E88E74] to-[#CB6C65] transition-all duration-100 ease-out rounded-full shadow-[0_0_8px_rgba(232,142,116,0.5)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            {/* Invisible Native Scrubber Input */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              disabled={duration === 0}
              aria-label="Audio progress slider"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>

          {/* Time Display */}
          <div className="mt-2 flex items-center justify-between text-xs font-medium text-[#B5989F] font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
          </div>
        </div>

        {/* Player Controls Strip */}
        <div className="relative z-10 mt-5 flex items-center justify-between gap-4">
          {/* Volume Control */}
          <div className="flex items-center gap-2 w-32 sm:w-36">
            <button
              onClick={handleToggleMute}
              type="button"
              className="rounded-full p-1.5 text-[#E8D3C8] hover:text-[#FFF7F0] hover:bg-[#341437] transition-colors cursor-pointer"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-[#B5989F]" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-4 w-4 text-[#E8D3C8]" />
              ) : (
                <Volume2 className="h-4 w-4 text-[#E88E74]" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              aria-label="Volume slider"
              className="h-1.5 w-full cursor-pointer bg-[#361539] rounded-lg accent-[#E88E74]"
            />
          </div>

          {/* Primary Play / Pause Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={handleTogglePlay}
              type="button"
              disabled={isLoading}
              className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#E88E74] to-[#CB6C65] text-[#18051B] shadow-[0_4px_24px_rgba(232,142,116,0.45)] border border-[#FDDA9D]/50 hover:scale-105 hover:from-[#FFA288] hover:to-[#D9766F] hover:shadow-[0_4px_30px_rgba(232,142,116,0.6)] active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none"
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-[#18051B]" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6 fill-[#18051B] text-[#18051B]" />
              ) : (
                <Play className="h-6 w-6 fill-[#18051B] text-[#18051B] translate-x-0.5" />
              )}
            </button>
          </div>

          {/* Replay / Reset action */}
          <div className="flex items-center justify-end w-32 sm:w-36">
            <button
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              type="button"
              className="inline-flex items-center gap-1 rounded-full p-2 text-[#B5989F] hover:text-[#FFF7F0] hover:bg-[#341437] transition-colors cursor-pointer text-xs"
              title="Restart from beginning"
              aria-label="Restart from beginning"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
