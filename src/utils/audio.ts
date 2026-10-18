// Application Default Romantic Melody URL
export const DEFAULT_APP_MELODY_URL =
  'https://www.masstamilan.dev/downloader/_PtrqeFYAPRpMKJl0feTnQ/1792339638/d320_cdn/44054/MjQwNToyMDE6ZTA1NDplMDhiOmQ4ZTM6ZTUxYjpkNDY2OmRjMWI=';

class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingMusic = false;
  private melodyUrl = DEFAULT_APP_MELODY_URL;
  private audioElement: HTMLAudioElement | null = null;
  private onStateChangeCallback: ((playing: boolean) => void) | null = null;
  private onErrorCallback: ((errorMsg: string) => void) | null = null;
  private isMuted = false;
  private volume = 0.7;

  constructor() {
    this.initAudioElement();
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return;
    if (!this.audioElement) {
      this.audioElement = new Audio();
      this.audioElement.preload = 'metadata';
      this.audioElement.loop = true;
      this.audioElement.volume = this.volume;
      this.audioElement.src = this.melodyUrl;

      this.audioElement.addEventListener('playing', () => {
        this.isPlayingMusic = true;
        this.onStateChangeCallback?.(true);
      });

      this.audioElement.addEventListener('pause', () => {
        this.isPlayingMusic = false;
        this.onStateChangeCallback?.(false);
      });

      this.audioElement.addEventListener('ended', () => {
        this.isPlayingMusic = false;
        this.onStateChangeCallback?.(false);
      });

      this.audioElement.addEventListener('error', () => {
        this.isPlayingMusic = false;
        this.onStateChangeCallback?.(false);
        this.onErrorCallback?.(
          'The default melody source is protected or restricted by the host server (HTTP 403 / Cloudflare). Please upload your song file (.mp3) or provide an accessible direct audio URL.'
        );
      });
    }
  }

  // Set or replace the default melody source (e.g. from direct URL or uploaded file)
  public setMelodySource(url: string, playImmediately = true): void {
    this.melodyUrl = url;
    this.initAudioElement();
    if (this.audioElement) {
      this.audioElement.src = url;
      this.audioElement.load();
      if (playImmediately) {
        this.startMusic();
      }
    }
  }

  public getMelodyUrl(): string {
    return this.melodyUrl;
  }

  public registerListeners(
    onStateChange: (playing: boolean) => void,
    onError?: (errorMsg: string) => void
  ) {
    this.onStateChangeCallback = onStateChange;
    if (onError) this.onErrorCallback = onError;
  }

  // Toggle default melody playback
  public async toggleMusic(
    onStateChange?: (playing: boolean) => void,
    onError?: (errorMsg: string) => void
  ): Promise<boolean> {
    this.initContext();
    this.initAudioElement();

    if (onStateChange) this.onStateChangeCallback = onStateChange;
    if (onError) this.onErrorCallback = onError;

    if (this.isPlayingMusic) {
      this.stopMusic();
      return false;
    } else {
      return await this.startMusic();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlayingMusic;
  }

  public async startMusic(): Promise<boolean> {
    this.initContext();
    this.initAudioElement();
    if (!this.audioElement) return false;

    // Notify any page-specific players to pause to avoid simultaneous audio
    window.dispatchEvent(new CustomEvent('app-melody-playing'));

    try {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
      await this.audioElement.play();
      this.isPlayingMusic = true;
      this.onStateChangeCallback?.(true);
      return true;
    } catch (err: any) {
      this.isPlayingMusic = false;
      this.onStateChangeCallback?.(false);
      this.onErrorCallback?.(
        'The default melody source is protected or restricted by the host server (HTTP 403 / Cloudflare). Please upload your song file (.mp3) or provide an accessible direct audio URL.'
      );
      return false;
    }
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.onStateChangeCallback?.(false);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    return this.isMuted;
  }

  // Sound Effect: Sweet glass bell / chime
  public playChime(freq = 880) {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.9);
  }

  // Sound Effect: Soft ribbon untie flutter
  public playRibbonSound() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Filtered noise swoosh
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + 0.35);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Sound Effect: Wax seal breaking / cracking with gentle resonance
  public playSealCrack() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);

    // Followed by celebratory chime
    setTimeout(() => this.playChime(1046.5), 120);
  }

  // Sound Effect: Candle blow whoosh & fairy starlight
  public playCandleBlow() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Breath whoosh
    const bufferSize = this.ctx.sampleRate * 0.6;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.35;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);

    // Starlight sparkle arpeggio
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chord.forEach((freq, idx) => {
      setTimeout(() => this.playChime(freq), 250 + (idx * 90));
    });
  }

  // Sound Effect: Magical fanfare for big reveals
  public playFanfare() {
    this.initContext();
    if (!this.ctx) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playChime(freq), idx * 110);
    });
  }

  // Playful dodge sound effect (cute upward whistle / slide)
  public playDodge() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  // Playful poof sound effect (disappearing puff)
  public playPoof() {
    this.initContext();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.2);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }
}

export const soundEngine = new RomanticAudioEngine();
