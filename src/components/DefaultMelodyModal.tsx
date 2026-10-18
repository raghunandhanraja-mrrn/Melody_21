import React, { useState, useRef } from 'react';
import { Music, Upload, Link as LinkIcon, AlertCircle, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface DefaultMelodyModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string | null;
  onSuccess: () => void;
}

export const DefaultMelodyModal: React.FC<DefaultMelodyModalProps> = ({
  isOpen,
  onClose,
  errorMessage,
  onSuccess,
}) => {
  const [inputUrl, setInputUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundEngine.playChime(700);
    const objectUrl = URL.createObjectURL(file);
    soundEngine.setMelodySource(objectUrl, true);
    onSuccess();
    onClose();
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    soundEngine.playChime(650);
    soundEngine.setMelodySource(inputUrl.trim(), true);
    onSuccess();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn font-sans"
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full rounded-3xl border border-[#8E384C]/50 bg-[#1E0921] p-6 sm:p-7 shadow-2xl overflow-hidden text-[#FFF7F0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div
          className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-[#E88E74]/20 blur-2xl"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          aria-label="Close dialog"
          className="absolute top-4 right-4 z-10 rounded-full bg-[#341437]/90 p-2 text-[#E8D3C8] hover:text-[#FFF7F0] hover:bg-[#441948] border border-[#8E384C]/45 shadow-sm transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#341437]/90 border border-[#A94C57]/50 text-[#FDDA9D]">
            <Music className="h-6 w-6 text-[#FDDA9D]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FDDA9D] uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-[#FDDA9D]" />
              <span>Default Melody</span>
            </div>
            <h3 className="text-lg font-bold text-[#FFF7F0]">Application Melody</h3>
          </div>
        </div>

        {/* Friendly explanation */}
        <div className="p-3.5 rounded-2xl bg-[#280F2A] border border-[#8E384C]/45 text-xs text-[#E8D3C8] leading-relaxed mb-5 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-[#E88E74] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#FFF7F0] mb-0.5">Audio Source Protected</p>
              <p>
                {errorMessage ||
                  'The default melody source is protected or restricted by the host server (HTTP 403 / Cloudflare). Please upload your audio file (.mp3) or provide an accessible direct audio URL below.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Options */}
        <div className="flex flex-col gap-2.5">
          {/* File Upload Option */}
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
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#E88E74] to-[#CB6C65] px-4 py-3 text-xs font-semibold text-[#18051B] border border-[#FDDA9D]/40 hover:from-[#FFA288] hover:to-[#D9766F] transition-all cursor-pointer shadow-md active:scale-98"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Melody Audio File (.mp3)</span>
          </button>

          {/* Toggle Direct URL Input */}
          <button
            onClick={() => setShowUrlInput((prev) => !prev)}
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#341437]/90 px-4 py-2.5 text-xs font-medium text-[#E8D3C8] border border-[#8E384C]/45 hover:bg-[#441948] hover:text-[#FFF7F0] transition-colors cursor-pointer"
          >
            <LinkIcon className="h-3.5 w-3.5 text-[#B5989F]" />
            <span>{showUrlInput ? 'Hide URL Input' : 'Provide Direct Audio Link'}</span>
          </button>

          {showUrlInput && (
            <form onSubmit={handleApplyUrl} className="mt-2 flex flex-col gap-2 animate-fadeIn">
              <input
                type="url"
                placeholder="Paste direct audio link (e.g. https://.../song.mp3)"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#8E384C]/50 bg-[#280F2A] text-[#FFF7F0] placeholder-[#B5989F] focus:outline-none focus:ring-1 focus:ring-[#E88E74]"
              />
              <button
                type="submit"
                disabled={!inputUrl.trim()}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#FDDA9D] via-[#F8DBBD] to-[#E88E74] px-4 py-2 text-xs font-semibold text-[#18051B] hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Apply Audio Source</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
