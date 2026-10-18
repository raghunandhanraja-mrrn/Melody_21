import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Music,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Disc,
  Headphones,
  Loader2,
} from 'lucide-react';
import { PLAYLIST_TRACKS, PlaylistTrack } from '../data/playlistTracks';
import { soundEngine } from '../utils/audio';

interface PlaylistSpaceScreenProps {
  onGoBack: () => void;
  recipientName?: string;
}

type RepeatMode = 'off' | 'all' | 'one';

export const PlaylistSpaceScreen: React.FC<PlaylistSpaceScreenProps> = ({
  onGoBack,
  recipientName = 'Lishoow',
}) => {
  const [tracks, setTracks] = useState<PlaylistTrack[]>(PLAYLIST_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showUrlModal, setShowUrlModal] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [trackDurations, setTrackDurations] = useState<{ [id: string]: number }>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  // Initialize Audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    audioRef.current = audio;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoading(false);
      setErrorMessage(null);
      if (currentTrack?.id && audio.duration && !isNaN(audio.duration)) {
        setTrackDurations((prev) => ({
          ...prev,
          [currentTrack.id]: audio.duration,
        }));
      }
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
        `Unable to stream ${currentTrack?.title || 'this track'}. The audio link is protected or restricted by the host server (HTTP 403 / Cloudflare). You can select another song, upload a music file (.mp3), or paste a direct audio link.`
      );
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    // Stop playlist if global background melody is toggled
    const handleGlobalMelodyPlaying = () => {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };
    window.addEventListener('app-melody-playing', handleGlobalMelodyPlaying);

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
      window.removeEventListener('app-melody-playing', handleGlobalMelodyPlaying);
      audioRef.current = null;
    };
  }, []);

  // Sync volume & mute with audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle Track End (Advance logic based on Repeat and Shuffle)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (isShuffle) {
        let nextIndex = Math.floor(Math.random() * tracks.length);
        if (tracks.length > 1 && nextIndex === currentTrackIndex) {
          nextIndex = (nextIndex + 1) % tracks.length;
        }
        playTrackByIndex(nextIndex);
      } else {
        if (currentTrackIndex < tracks.length - 1) {
          playTrackByIndex(currentTrackIndex + 1);
        } else if (repeatMode === 'all') {
          playTrackByIndex(0);
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, isShuffle, currentTrackIndex, tracks]);

  // Play a specific track by index
  const playTrackByIndex = async (index: number) => {
    if (!tracks[index]) return;

    soundEngine.stopMusic(); // Stop ambient melody
    soundEngine.playChime(750);

    const targetTrack = tracks[index];
    setCurrentTrackIndex(index);
    setErrorMessage(null);
    setCurrentTime(0);
    setDuration(0);

    if (audioRef.current) {
      audioRef.current.src = targetTrack.audioUrl;
      audioRef.current.load();
      setIsLoading(true);
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        setIsPlaying(false);
        setErrorMessage(
          `Unable to stream ${targetTrack.title}. The audio link is protected or restricted by the host server (HTTP 403 / Cloudflare). You can select another song, upload an audio file (.mp3), or paste a direct audio link.`
        );
      }
    }
  };

  // Toggle Play / Pause for the active track
  const handleTogglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    soundEngine.stopMusic();

    try {
      setErrorMessage(null);
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = currentTrack.audioUrl;
      }
      setIsLoading(true);
      await audioRef.current.play();
      setIsPlaying(true);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setIsPlaying(false);
      setErrorMessage(
        `Unable to stream ${currentTrack.title}. The audio link is protected or restricted by the host server (HTTP 403 / Cloudflare). You can select another song, upload an audio file (.mp3), or paste a direct audio link.`
      );
    }
  };

  // Handle Next
  const handleNext = () => {
    if (isShuffle) {
      let nextIndex = Math.floor(Math.random() * tracks.length);
      if (tracks.length > 1 && nextIndex === currentTrackIndex) {
        nextIndex = (nextIndex + 1) % tracks.length;
      }
      playTrackByIndex(nextIndex);
    } else {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      playTrackByIndex(nextIndex);
    }
  };

  // Handle Previous
  const handlePrevious = () => {
    if (currentTime > 3) {
      // If played more than 3 seconds, replay from start
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
      return;
    }

    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    playTrackByIndex(prevIndex);
  };

  // Toggle Repeat mode (off -> all -> one -> off)
  const handleToggleRepeat = () => {
    soundEngine.playChime(820);
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  // Toggle Shuffle
  const handleToggleShuffle = () => {
    soundEngine.playChime(800);
    setIsShuffle((prev) => !prev);
  };

  // Seek bar handler
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Volume slider handler
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Format time mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Custom audio file upload for active track
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playChime(880);
    const objectUrl = URL.createObjectURL(file);
    const updatedTitle = file.name.replace(/\.[^/.]+$/, '');

    setTracks((prev) =>
      prev.map((t, idx) =>
        idx === currentTrackIndex
          ? { ...t, title: updatedTitle, subtitle: 'Uploaded Song 🎵', audioUrl: objectUrl }
          : t
      )
    );

    setErrorMessage(null);
    setCurrentTime(0);

    if (audioRef.current) {
      audioRef.current.src = objectUrl;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  // Custom audio direct URL input
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    soundEngine.playChime(880);
    const url = inputUrl.trim();

    setTracks((prev) =>
      prev.map((t, idx) =>
        idx === currentTrackIndex
          ? { ...t, subtitle: 'Custom Link 🎵', audioUrl: url }
          : t
      )
    );

    setErrorMessage(null);
    setCurrentTime(0);
    setShowUrlModal(false);
    setInputUrl('');

    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

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

      <div className="relative z-10 max-w-4xl w-full mx-auto">
        {/* Navigation Bar / Go Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              soundEngine.playChime(600);
              onGoBack();
            }}
            type="button"
            className="group inline-flex items-center gap-2 rounded-full border border-[#8E384C]/45 bg-[#240D26]/85 px-4 py-2 text-xs sm:text-sm font-medium text-[#E8D3C8] hover:bg-[#341437] hover:text-[#FFF7F0] hover:border-[#E88E74]/50 transition-all cursor-pointer backdrop-blur-md shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-[#FDDA9D]" />
            <span>Go Back</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#341437]/90 border border-[#A94C57]/50 text-[#FDDA9D] shadow-sm">
            <Headphones className="h-3.5 w-3.5 text-[#FDDA9D]" />
            <span>Dedicated to {recipientName} 💗</span>
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-semibold mb-3 bg-[#341437]/90 border border-[#A94C57]/50 text-[#FDDA9D] shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-[#FDDA9D]" />
            <span>Personal Music Corner</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FFF7F0]">
            A Little Playlist for You 🎧
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#E8D3C8] font-medium tracking-normal max-w-xl mx-auto">
            Every song has a feeling, and every melody holds a little memory. 💗
          </p>
        </div>

        {/* Playlist Cover & Quick Play Header Card */}
        <div className="relative overflow-hidden rounded-3xl border border-[#8E384C]/50 bg-[#240D26]/85 p-6 sm:p-8 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_35px_rgba(232,142,116,0.12)] mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            {/* Vinyl Record Visual */}
            <div className="relative group shrink-0">
              <div
                className={`relative flex h-36 w-36 sm:h-44 sm:w-44 items-center justify-center rounded-3xl border border-[#FDDA9D]/40 bg-gradient-to-br from-[#361539] via-[#240D26] to-[#180721] shadow-2xl p-4 transition-all duration-700 ${
                  isPlaying ? 'rotate-3 scale-105 shadow-[0_0_35px_rgba(232,142,116,0.35)]' : ''
                }`}
              >
                {/* Vinyl Grooves */}
                <div
                  className={`relative flex h-full w-full items-center justify-center rounded-full border-4 border-[#13051A] bg-[#180721] shadow-inner ${
                    isPlaying ? 'animate-spin [animation-duration:10s]' : ''
                  }`}
                >
                  <div className="h-20 w-20 rounded-full border border-[#8E384C]/60 flex items-center justify-center bg-gradient-to-tr from-[#E88E74] to-[#CB6C65] shadow-md">
                    <Disc className="h-10 w-10 text-[#18051B]" />
                  </div>
                  {/* Subtle vinyl concentric ring */}
                  <div className="pointer-events-none absolute inset-2 rounded-full border border-[#FDDA9D]/15" />
                  <div className="pointer-events-none absolute inset-5 rounded-full border border-[#FDDA9D]/10" />
                </div>

                {isPlaying && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#FDDA9D]" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#FDDA9D]" />
                  </span>
                )}
              </div>
            </div>

            {/* Playlist Meta & Action Buttons */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#341437] text-[#FDDA9D] border border-[#8E384C]/50 mb-2">
                <span>Curated Space 🎶</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF7F0] tracking-tight">
                Our Little Playlist
              </h2>
              <p className="mt-1 text-sm text-[#E8D3C8]">
                A hand-picked collection of romantic melodies and sweet tunes.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3 text-xs sm:text-sm text-[#B5989F]">
                <span className="px-3 py-1 rounded-full bg-[#180721]/80 border border-[#8E384C]/40 text-[#FDDA9D] font-semibold">
                  {tracks.length} Tracks Total
                </span>
                <span className="px-3 py-1 rounded-full bg-[#180721]/80 border border-[#8E384C]/40 text-[#E8D3C8]">
                  Currently Playing:{' '}
                  <strong className="text-[#FFF7F0]">{currentTrack.title}</strong>
                </span>
              </div>

              {/* Quick Play & Shuffle Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  onClick={() => {
                    if (isPlaying) {
                      handleTogglePlay();
                    } else {
                      playTrackByIndex(currentTrackIndex);
                    }
                  }}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-6 py-2.5 text-xs sm:text-sm font-semibold text-[#18051B] shadow-[0_4px_20px_rgba(232,142,116,0.4)] border border-[#FDDA9D]/40 hover:scale-105 hover:from-[#FFA288] hover:to-[#D9766F] transition-all cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 fill-[#18051B]" />
                      <span>Pause Playlist</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-[#18051B]" />
                      <span>{currentTime > 0 ? 'Resume Track' : 'Play All'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    const randomIndex = Math.floor(Math.random() * tracks.length);
                    setIsShuffle(true);
                    playTrackByIndex(randomIndex);
                  }}
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-[#8E384C]/50 bg-[#341437]/90 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#FFF7F0] hover:bg-[#441948] hover:border-[#E88E74]/50 transition-all cursor-pointer shadow-sm"
                >
                  <Shuffle className="h-4 w-4 text-[#FDDA9D]" />
                  <span>Shuffle Play</span>
                </button>

                {/* Source Options (Upload / Link) */}
                <div className="flex items-center gap-2">
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
                    title="Upload replacement MP3 for active track"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#8E384C]/45 bg-[#280F2A] px-3.5 py-2 text-xs font-medium text-[#E8D3C8] hover:text-[#FFF7F0] hover:bg-[#361539] transition-all cursor-pointer"
                  >
                    <Upload className="h-3.5 w-3.5 text-[#FDDA9D]" />
                    <span>Upload Song</span>
                  </button>
                  <button
                    onClick={() => setShowUrlModal(true)}
                    type="button"
                    title="Paste direct audio URL"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#8E384C]/45 bg-[#280F2A] px-3.5 py-2 text-xs font-medium text-[#E8D3C8] hover:text-[#FFF7F0] hover:bg-[#361539] transition-all cursor-pointer"
                  >
                    <LinkIcon className="h-3.5 w-3.5 text-[#FDDA9D]" />
                    <span>Direct Link</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Link Input Drawer/Modal */}
        {showUrlModal && (
          <div className="mb-6 p-4 rounded-2xl bg-[#1F0922] border border-[#8E384C]/60 shadow-lg animate-fadeIn">
            <h4 className="text-sm font-semibold text-[#FFF7F0] mb-1 flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-[#FDDA9D]" />
              Provide Direct Audio URL for {currentTrack.title}
            </h4>
            <p className="text-xs text-[#E8D3C8] mb-3">
              Paste an accessible direct MP3 or audio stream URL.
            </p>
            <form onSubmit={handleApplyCustomUrl} className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                required
                placeholder="https://example.com/audio.mp3"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="flex-1 rounded-xl bg-[#280F2A] border border-[#8E384C]/50 px-3.5 py-2 text-xs text-[#FFF7F0] placeholder-[#B5989F] focus:outline-none focus:border-[#E88E74]"
              />
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-4 py-2 text-xs font-semibold text-[#18051B] hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Apply to {currentTrack.title}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlModal(false)}
                  className="rounded-xl bg-[#280F2A] border border-[#8E384C]/45 px-3 py-2 text-xs text-[#E8D3C8] hover:text-[#FFF7F0] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error / Accessibility Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#2D1022] border border-[#A94C57]/60 text-[#E8D3C8] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn shadow-lg">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-[#E88E74] shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-[#FFF7F0]">Audio Notice: </span>
                {errorMessage}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-3.5 py-1.5 text-xs font-semibold text-[#18051B] hover:from-[#FFA288] hover:to-[#D9766F] transition-all cursor-pointer shadow-md"
              >
                <Upload className="h-3 w-3" />
                <span>Upload Song File</span>
              </button>
              <button
                onClick={handleNext}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#8E384C]/50 bg-[#341437] px-3.5 py-1.5 text-xs font-medium text-[#FFF7F0] hover:bg-[#441948] transition-colors cursor-pointer"
              >
                <SkipForward className="h-3 w-3" />
                <span>Next Song</span>
              </button>
            </div>
          </div>
        )}

        {/* Main Grid: Track List & Sticky Bottom Player */}
        <div className="grid grid-cols-1 gap-6 mb-28">
          {/* Track List Section */}
          <div className="rounded-3xl border border-[#8E384C]/50 bg-[#240D26]/85 backdrop-blur-xl p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
            <div className="flex items-center justify-between pb-4 border-b border-[#8E384C]/35 mb-4">
              <h3 className="text-lg font-bold text-[#FFF7F0] flex items-center gap-2">
                <Music className="h-4 w-4 text-[#FDDA9D]" />
                <span>Tracks in This Playlist</span>
              </h3>
              <span className="text-xs text-[#FDDA9D] font-medium bg-[#341437] px-3 py-1 rounded-full border border-[#8E384C]/40">
                12 Songs
              </span>
            </div>

            {/* Vertically Arranged Songs */}
            <div className="space-y-2.5">
              {tracks.map((track, index) => {
                const isSelected = index === currentTrackIndex;
                const isThisPlaying = isSelected && isPlaying;
                const trackDuration = trackDurations[track.id];

                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      if (isSelected) {
                        handleTogglePlay();
                      } else {
                        playTrackByIndex(index);
                      }
                    }}
                    className={`group relative flex items-center justify-between p-3.5 sm:p-4 rounded-2xl transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'border-[#E88E74]/70 bg-gradient-to-r from-[#38163B] to-[#2B0E2E] shadow-[0_0_20px_rgba(232,142,116,0.18)]'
                        : 'border-[#8E384C]/25 bg-[#1C0820]/60 hover:bg-[#2B0E2E]/80 hover:border-[#8E384C]/60'
                    }`}
                  >
                    {/* Track Number / Play Icon */}
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#280F2A] border border-[#8E384C]/45 group-hover:border-[#E88E74]/60 transition-colors">
                        {isThisPlaying ? (
                          /* Animated Equalizer Bars */
                          <div className="flex items-end justify-center gap-0.5 h-4 w-4">
                            <span className="w-1 bg-[#FDDA9D] rounded-full animate-[bounce_0.8s_infinite] h-full" />
                            <span className="w-1 bg-[#E88E74] rounded-full animate-[bounce_0.6s_infinite_0.2s] h-3/4" />
                            <span className="w-1 bg-[#CB6C65] rounded-full animate-[bounce_0.9s_infinite_0.4s] h-full" />
                          </div>
                        ) : isSelected ? (
                          <Play className="h-4 w-4 text-[#FDDA9D] fill-[#FDDA9D] translate-x-0.5" />
                        ) : (
                          <span className="text-xs font-mono font-bold text-[#E8D3C8] group-hover:text-[#FDDA9D] transition-colors">
                            {track.trackNumber}
                          </span>
                        )}
                      </div>

                      {/* Track Details */}
                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm sm:text-base font-semibold truncate ${
                              isSelected ? 'text-[#FFF7F0]' : 'text-[#E8D3C8] group-hover:text-[#FFF7F0]'
                            }`}
                          >
                            {track.title}
                          </h4>
                          {isSelected && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E88E74]/20 text-[#FDDA9D] border border-[#E88E74]/40">
                              {isThisPlaying ? 'Playing' : 'Selected'}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#B5989F] font-medium truncate mt-0.5">
                          {track.subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Right Side: Duration & Play State */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-[#B5989F]">
                        {isSelected && duration > 0
                          ? formatTime(duration)
                          : trackDuration
                          ? formatTime(trackDuration)
                          : '--:--'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isSelected) {
                            handleTogglePlay();
                          } else {
                            playTrackByIndex(index);
                          }
                        }}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-transform group-hover:scale-105 cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#E88E74] to-[#CB6C65] text-[#18051B] border-[#FDDA9D]/50 shadow-md'
                            : 'bg-[#280F2A] text-[#E8D3C8] border-[#8E384C]/40 group-hover:text-[#FFF7F0] group-hover:border-[#E88E74]/60'
                        }`}
                        aria-label={isThisPlaying ? 'Pause song' : 'Play song'}
                      >
                        {isSelected && isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : isThisPlaying ? (
                          <Pause className="h-3.5 w-3.5 fill-current" />
                        ) : (
                          <Play className="h-3.5 w-3.5 fill-current translate-x-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Fixed Bottom Master Audio Player */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-[#180721]/95 border-t border-[#8E384C]/50 backdrop-blur-2xl shadow-[0_-10px_35px_rgba(0,0,0,0.7)]">
          <div className="max-w-4xl mx-auto flex flex-col gap-2">
            {/* Progress Slider (Edge-to-Edge inside bar) */}
            <div className="relative group flex items-center">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#361539]">
                <div
                  className="h-full bg-gradient-to-r from-[#FDDA9D] via-[#E88E74] to-[#CB6C65] transition-all duration-100 ease-out rounded-full shadow-[0_0_8px_rgba(232,142,116,0.6)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                disabled={duration === 0}
                aria-label="Seek track position"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>

            {/* Time labels under progress bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-[#B5989F] px-1 -mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between gap-3 pt-1">
              {/* Left: Active Track Info */}
              <div className="flex items-center gap-3 min-w-0 w-1/3">
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#E88E74] to-[#CB6C65] border border-[#FDDA9D]/40 text-[#18051B] shadow-md">
                  <Music className={`h-5 w-5 ${isPlaying ? 'animate-bounce' : ''}`} />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-xs font-bold text-[#FFF7F0] truncate">
                      {currentTrack.title}
                    </span>
                    <span className="text-[10px] text-[#FDDA9D] bg-[#341437] px-1.5 py-0.5 rounded border border-[#8E384C]/40 shrink-0">
                      {currentTrack.trackNumber}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#B5989F] truncate">
                    {currentTrack.subtitle || 'Welcome Lishoow Playlist'}
                  </p>
                </div>
              </div>

              {/* Center: Playback Controls (Shuffle, Prev, Play/Pause, Next, Repeat) */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-3 w-1/3">
                {/* Shuffle Button */}
                <button
                  type="button"
                  onClick={handleToggleShuffle}
                  title={isShuffle ? 'Shuffle is ON' : 'Shuffle is OFF'}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    isShuffle
                      ? 'text-[#FDDA9D] bg-[#341437] border border-[#FDDA9D]/50 shadow-[0_0_10px_rgba(253,218,157,0.3)]'
                      : 'text-[#B5989F] hover:text-[#FFF7F0] hover:bg-[#280F2A]'
                  }`}
                >
                  <Shuffle className="h-4 w-4" />
                </button>

                {/* Previous Button */}
                <button
                  type="button"
                  onClick={handlePrevious}
                  title="Previous song"
                  className="p-2 rounded-full text-[#E8D3C8] hover:text-[#FFF7F0] hover:bg-[#341437] transition-colors cursor-pointer"
                >
                  <SkipBack className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                {/* Main Play / Pause Button */}
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  disabled={isLoading}
                  title={isPlaying ? 'Pause' : 'Play'}
                  className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#E88E74] to-[#CB6C65] text-[#18051B] shadow-[0_4px_20px_rgba(232,142,116,0.45)] border border-[#FDDA9D]/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#18051B]" />
                  ) : isPlaying ? (
                    <Pause className="h-5 w-5 fill-[#18051B]" />
                  ) : (
                    <Play className="h-5 w-5 fill-[#18051B] translate-x-0.5" />
                  )}
                </button>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  title="Next song"
                  className="p-2 rounded-full text-[#E8D3C8] hover:text-[#FFF7F0] hover:bg-[#341437] transition-colors cursor-pointer"
                >
                  <SkipForward className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                {/* Repeat Button */}
                <button
                  type="button"
                  onClick={handleToggleRepeat}
                  title={`Repeat: ${repeatMode.toUpperCase()}`}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    repeatMode !== 'off'
                      ? 'text-[#FDDA9D] bg-[#341437] border border-[#FDDA9D]/50 shadow-[0_0_10px_rgba(253,218,157,0.3)]'
                      : 'text-[#B5989F] hover:text-[#FFF7F0] hover:bg-[#280F2A]'
                  }`}
                >
                  {repeatMode === 'one' ? (
                    <Repeat1 className="h-4 w-4" />
                  ) : (
                    <Repeat className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Right: Volume & Options */}
              <div className="flex items-center justify-end gap-2 w-1/3">
                <button
                  type="button"
                  onClick={() => setIsMuted((prev) => !prev)}
                  title={isMuted ? 'Unmute' : 'Mute'}
                  className="p-1.5 rounded-full text-[#E8D3C8] hover:text-[#FFF7F0] hover:bg-[#341437] transition-colors cursor-pointer"
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
                  className="hidden sm:block h-1.5 w-20 md:w-28 cursor-pointer bg-[#361539] rounded-lg accent-[#E88E74]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
