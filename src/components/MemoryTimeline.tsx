import React, { useState } from 'react';
import { Camera, MapPin, Calendar, X, Heart, ZoomIn } from 'lucide-react';
import { MemoryItem } from '../types';
import { soundEngine } from '../utils/audio';

interface MemoryTimelineProps {
  memories: MemoryItem[];
}

export const MemoryTimeline: React.FC<MemoryTimelineProps> = ({ memories }) => {
  const [activePhoto, setActivePhoto] = useState<MemoryItem | null>(null);

  const handleOpenPhoto = (item: MemoryItem) => {
    soundEngine.playChime(720);
    setActivePhoto(item);
  };

  return (
    <section id="memories" className="relative py-20 bg-stone-900/50 border-t border-stone-800/80">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-amber-400 uppercase">
            <span>Chapter 03</span>
            <span aria-hidden="true">·</span>
            <span>The Memory Reel</span>
          </div>

          <h2 className="mt-3 font-serif text-3xl font-medium text-stone-100 sm:text-4xl text-balance">
            Moments Frozen in Starlight
          </h2>
          <p className="mt-3 text-sm text-stone-400 max-w-lg mx-auto">
            A visual anthology of the days where you made time stand completely still.
          </p>
        </div>

        {/* 3-in-a-row Memory Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {memories.map((mem, idx) => (
            <article
              key={mem.id}
              onClick={() => handleOpenPhoto(mem)}
              className="group relative cursor-pointer rounded-2xl border border-stone-800 bg-stone-950 p-4 transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
            >
              {/* Photo Frame */}
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-stone-900">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-stone-950/80 px-3 py-1.5 text-xs font-medium text-stone-200 backdrop-blur-sm">
                      <ZoomIn className="h-3.5 w-3.5" />
                      <span>View Polaroid</span>
                    </span>
                  </div>
                </div>

                {/* Clean unboxed metadata */}
                <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
                  <span>{mem.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>{mem.location}</span>
                </div>

                <h3 className="mt-1.5 font-serif text-xl font-medium text-stone-100 group-hover:text-amber-200 transition-colors">
                  {mem.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-stone-400 line-clamp-3">
                  {mem.story}
                </p>
              </div>

              {/* Card Footer Tag */}
              <div className="mt-5 border-t border-stone-800/80 pt-3 flex items-center justify-between text-xs text-amber-400/80">
                <span className="font-serif italic text-sm">{mem.tag}</span>
                <Heart className="h-3.5 w-3.5 text-rose-500" />
              </div>
            </article>
          ))}
        </div>

        {/* Fullscreen Lightbox Modal */}
        {activePhoto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-fadeIn"
            onClick={() => setActivePhoto(null)}
          >
            <div
              className="relative w-full max-w-3xl rounded-2xl border border-stone-800 bg-stone-900 p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 rounded-full bg-stone-800 p-2 text-stone-300 hover:bg-stone-700 hover:text-white transition-colors"
                aria-label="Close photo view"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-stone-950 border border-stone-800">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs text-amber-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{activePhoto.date}</span>
                  <span aria-hidden="true">·</span>
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{activePhoto.location}</span>
                </div>

                <h3 className="mt-2 font-serif text-2xl font-medium text-stone-100">
                  {activePhoto.title}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-stone-300 font-serif italic text-base">
                  "{activePhoto.story}"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
