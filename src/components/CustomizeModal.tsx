import React, { useState } from 'react';
import { X, Check, Copy, Share2, Sparkles, Heart, RefreshCw, Upload, Plus, Trash2 } from 'lucide-react';
import { SurpriseData, MemoryItem, SurpriseGift } from '../types';
import { generateShareableUrl } from '../utils/storage';
import { soundEngine } from '../utils/audio';

interface CustomizeModalProps {
  data: SurpriseData;
  onSave: (updated: SurpriseData) => void;
  onClose: () => void;
  onReset: () => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  data,
  onSave,
  onClose,
  onReset,
}) => {
  const [formData, setFormData] = useState<SurpriseData>(JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<'basics' | 'letter' | 'memories' | 'share'>('basics');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    const url = generateShareableUrl(formData);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    soundEngine.playChime(1000);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSaveAndApply = () => {
    onSave(formData);
    soundEngine.playChime(880);
    onClose();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, memoryIndex: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updatedMemories = [...formData.memories];
        updatedMemories[memoryIndex].imageUrl = reader.result;
        setFormData({ ...formData, memories: updatedMemories });
      }
    };
    reader.readAsDataURL(file);
  };

  const addMemory = () => {
    const newMem: MemoryItem = {
      id: `mem-${Date.now()}`,
      title: 'Our New Memory',
      date: 'Special Day',
      location: 'Together with You',
      story: 'Every single second spent with you is a gift I will treasure for the rest of my days.',
      imageUrl: '/src/assets/images/romantic_memory_sunset_1792141311715.jpg',
      tag: 'Endless Joy',
    };
    setFormData({ ...formData, memories: [...formData.memories, newMem] });
  };

  const removeMemory = (id: string) => {
    setFormData({
      ...formData,
      memories: formData.memories.filter((m) => m.id !== id),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative flex h-[90vh] max-h-[800px] w-full max-w-3xl flex-col rounded-2xl border border-stone-800 bg-stone-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
            <div>
              <h2 className="font-serif text-xl font-medium text-stone-100">
                Personalize Her Birthday Surprise
              </h2>
              <p className="text-xs text-stone-400">
                Tailor names, photos, letter, and send her a secret interactive link.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls (Functional Buttons with Segmented Style) */}
        <div className="flex border-b border-stone-800 bg-stone-950/50 px-6 py-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('basics')}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'basics'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              1. Names & Dates
            </button>
            <button
              onClick={() => setActiveTab('letter')}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'letter'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              2. Love Letter
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'memories'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              3. Photos & Memories
            </button>
            <button
              onClick={() => setActiveTab('share')}
              type="button"
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeTab === 'share'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              4. Share Link
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Her Name
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientName: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Her Pet Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) =>
                      setFormData({ ...formData, nickname: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Your Name / Signature
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) =>
                      setFormData({ ...formData, senderName: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Her Birthday Date
                  </label>
                  <input
                    type="text"
                    value={formData.birthDate}
                    onChange={(e) =>
                      setFormData({ ...formData, birthDate: e.target.value })
                    }
                    placeholder="e.g. October 16"
                    className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300">
                  Headline Milestone Title
                </label>
                <input
                  type="text"
                  value={formData.specialMilestone}
                  onChange={(e) =>
                    setFormData({ ...formData, specialMilestone: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300">
                  Hero Subtitle Greeting
                </label>
                <textarea
                  rows={2}
                  value={formData.heroSubtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, heroSubtitle: e.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>
          )}

          {activeTab === 'letter' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300">
                  Letter Greeting
                </label>
                <input
                  type="text"
                  value={formData.loveLetter.greeting}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      loveLetter: { ...formData.loveLetter, greeting: e.target.value },
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300">
                  Love Letter Body (Separate paragraphs with double enter)
                </label>
                <textarea
                  rows={8}
                  value={formData.loveLetter.body.join('\n\n')}
                  onChange={(e) => {
                    const paragraphs = e.target.value
                      .split('\n\n')
                      .filter((p) => p.trim().length > 0);
                    setFormData({
                      ...formData,
                      loveLetter: { ...formData.loveLetter, body: paragraphs },
                    });
                  }}
                  className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors font-serif text-base"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Letter Sign-off
                  </label>
                  <input
                    type="text"
                    value={formData.loveLetter.closing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loveLetter: { ...formData.loveLetter, closing: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300">
                    Signature Line
                  </label>
                  <input
                    type="text"
                    value={formData.loveLetter.signature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loveLetter: { ...formData.loveLetter, signature: e.target.value },
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-stone-800 bg-stone-950 px-3.5 py-2 text-sm text-stone-200 outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">
                  Upload photos or customize your favorite memories together
                </span>
                <button
                  onClick={addMemory}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-stone-800 px-3 py-1.5 text-xs text-stone-200 hover:bg-stone-700 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Memory</span>
                </button>
              </div>

              {formData.memories.map((mem, idx) => (
                <div
                  key={mem.id}
                  className="rounded-xl border border-stone-800 bg-stone-950 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-amber-400">
                      Memory #{idx + 1}
                    </span>
                    {formData.memories.length > 1 && (
                      <button
                        onClick={() => removeMemory(mem.id)}
                        className="text-stone-500 hover:text-rose-400"
                        title="Delete memory"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 space-y-2">
                      <input
                        type="text"
                        value={mem.title}
                        onChange={(e) => {
                          const copy = [...formData.memories];
                          copy[idx].title = e.target.value;
                          setFormData({ ...formData, memories: copy });
                        }}
                        placeholder="Memory Title"
                        className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={mem.date}
                          onChange={(e) => {
                            const copy = [...formData.memories];
                            copy[idx].date = e.target.value;
                            setFormData({ ...formData, memories: copy });
                          }}
                          placeholder="Date"
                          className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500"
                        />
                        <input
                          type="text"
                          value={mem.location}
                          onChange={(e) => {
                            const copy = [...formData.memories];
                            copy[idx].location = e.target.value;
                            setFormData({ ...formData, memories: copy });
                          }}
                          placeholder="Location"
                          className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={mem.story}
                        onChange={(e) => {
                          const copy = [...formData.memories];
                          copy[idx].story = e.target.value;
                          setFormData({ ...formData, memories: copy });
                        }}
                        placeholder="What happened that made this day so magical?"
                        className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* Photo preview & upload */}
                    <div className="flex flex-col items-center justify-center border border-dashed border-stone-800 rounded-lg p-2 bg-stone-900/50">
                      <div className="h-20 w-full overflow-hidden rounded bg-stone-950">
                        <img
                          src={mem.imageUrl}
                          alt="preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <label className="mt-2 cursor-pointer inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300">
                        <Upload className="h-3 w-3" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handlePhotoUpload(e, idx)}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 mb-2">
                <Share2 className="h-7 w-7" />
              </div>

              <h3 className="font-serif text-2xl text-stone-100">
                Ready to Send Her This Birthday Surprise?
              </h3>

              <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
                When you click "Copy Gift Link", the application compresses your customized names, letter, and memories directly into a unique link. When she opens it, she will see your personalized surprise instantly!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleCopyLink}
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 py-3 text-sm font-semibold text-stone-950 shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 text-stone-950" />
                      <span>Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>Copy Her Secret Gift Link</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 text-left">
                <span className="text-[11px] font-mono text-stone-400 block mb-1">
                  💡 How to Deliver It:
                </span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Send her the copied link at midnight with a sweet note like: <em className="text-amber-300">"Happy Birthday my love! Close your eyes and tap here for your special delivery 🎁"</em>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-stone-800 px-6 py-4">
          <button
            onClick={() => {
              onReset();
              soundEngine.playChime(600);
              onClose();
            }}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset to Defaults</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              type="button"
              className="rounded-xl border border-stone-800 px-4 py-2 text-xs font-medium text-stone-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAndApply}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2 text-xs font-medium text-stone-950 hover:bg-amber-400 transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
