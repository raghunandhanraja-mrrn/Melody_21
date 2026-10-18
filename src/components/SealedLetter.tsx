import React, { useState } from 'react';
import { Mail, Heart, Sparkles, Copy, Check, FoldHorizontal } from 'lucide-react';
import { SurpriseData } from '../types';
import { soundEngine } from '../utils/audio';

interface SealedLetterProps {
  letterData: SurpriseData['loveLetter'];
  senderName: string;
  recipientName: string;
}

export const SealedLetter: React.FC<SealedLetterProps> = ({
  letterData,
  senderName,
  recipientName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpenLetter = () => {
    soundEngine.playSealCrack();
    setIsOpen(true);
  };

  const handleClose = () => {
    soundEngine.playChime(500);
    setIsOpen(false);
  };

  const handleCopy = () => {
    const fullText = `${letterData.greeting}\n\n${letterData.body.join('\n\n')}\n\n${letterData.closing}\n${letterData.signature} (${senderName})\n${letterData.date}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    soundEngine.playChime(1000);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="letter" className="relative py-20 bg-stone-900/60 border-t border-stone-800/80">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-amber-400 uppercase">
            <span>Chapter 05</span>
            <span aria-hidden="true">·</span>
            <span>Handwritten Words</span>
          </div>

          <h2 className="mt-3 font-serif text-3xl font-medium text-stone-100 sm:text-4xl text-balance">
            The Wax-Sealed Epistle
          </h2>
          <p className="mt-3 text-sm text-stone-400 max-w-md mx-auto">
            A private letter written from the quietest and truest depths of my heart.
          </p>
        </div>

        {/* Envelope or Unfolded Letter */}
        <div className="mt-12 mx-auto max-w-2xl">
          {!isOpen ? (
            /* Sealed Envelope */
            <div className="group relative mx-auto overflow-hidden rounded-2xl border border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 p-8 sm:p-12 shadow-2xl transition-all duration-300 hover:border-amber-500/40 text-center">
              {/* Envelope flap aesthetic */}
              <div className="mx-auto w-full max-w-sm rounded-xl border border-amber-900/30 bg-amber-950/20 p-8 relative">
                <div className="text-xs uppercase tracking-widest text-amber-300/80 font-mono">
                  Strictly Confidential · For Her Eyes Only
                </div>
                <div className="mt-4 font-serif text-2xl text-stone-200">
                  {recipientName}
                </div>
                <div className="mt-1 text-xs text-stone-400 font-mono">
                  Postmarked with Forever Love
                </div>

                {/* The Royal Wax Seal Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleOpenLetter}
                    type="button"
                    className="group relative flex flex-col items-center gap-2 rounded-full p-2 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                    aria-label="Break seal to read letter"
                  >
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-rose-900 to-red-700 border-2 border-amber-400/80 shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center justify-center text-amber-200">
                      <Heart className="h-8 w-8 fill-amber-300/40 text-amber-300" />
                    </div>
                    <span className="font-serif text-xs font-semibold tracking-wider text-amber-300/90 mt-1">
                      BREAK WAX SEAL
                    </span>
                  </button>
                </div>
              </div>

              <p className="mt-6 text-xs text-stone-500">
                Click the red wax seal above to unfold this letter
              </p>
            </div>
          ) : (
            /* Unfolded Parchment Letter */
            <div className="relative rounded-2xl border border-amber-900/40 bg-stone-950 p-8 sm:p-12 shadow-2xl animate-fadeIn">
              {/* Top toolbar */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-4 text-xs text-stone-400">
                <span className="font-mono text-[11px] text-amber-400">
                  {letterData.date}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-300 hover:text-white transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Letter</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleClose}
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-300 hover:text-white transition-colors"
                  >
                    <FoldHorizontal className="h-3.5 w-3.5" />
                    <span>Fold</span>
                  </button>
                </div>
              </div>

              {/* Letter Prose */}
              <div className="mt-8 space-y-5 font-serif text-lg leading-relaxed text-stone-200">
                <p className="font-semibold text-amber-200 text-xl">
                  {letterData.greeting}
                </p>

                {letterData.body.map((paragraph, idx) => (
                  <p key={idx} className="text-base sm:text-lg text-stone-200/95 font-light">
                    {paragraph}
                  </p>
                ))}

                <div className="pt-8">
                  <p className="text-base text-stone-400 italic">
                    {letterData.closing}
                  </p>
                  <p className="mt-2 text-xl font-medium text-amber-300">
                    {letterData.signature}
                  </p>
                  <p className="text-xs font-mono text-stone-500 mt-1">
                    — {senderName}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
