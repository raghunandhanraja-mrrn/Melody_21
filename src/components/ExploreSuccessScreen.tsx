import React from 'react';
import { ArrowLeft, Sparkles, LayoutDashboard, Zap } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ExploreSuccessScreenProps {
  recipientName?: string;
  onGoBack: () => void;
}

export const ExploreSuccessScreen: React.FC<ExploreSuccessScreenProps> = ({
  recipientName = 'Lishoow',
  onGoBack,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-65px)] w-full text-[#E8E5FA] transition-all duration-500 font-sans z-10">
      {/* Top Bar / Navigation */}
      <div className="border-b border-white/10 bg-[#130747]/60 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <button
            onClick={() => {
              soundEngine.playChime(500);
              onGoBack();
            }}
            type="button"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#130747]/70 px-4 py-2 text-xs font-semibold text-[#E8E5FA] shadow-sm transition-all hover:bg-[#302F96]/50 hover:border-white/40 hover:text-white active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 text-[#C6A4FF]" />
            <span>Go Back ↩</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-[#E8E5FA]/70">
            <LayoutDashboard className="h-4 w-4 text-[#C6A4FF]" />
            <span className="font-medium text-white">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Main Plain Dashboard Content */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Welcome Banner */}
        <div className="rounded-3xl border border-white/20 bg-[#302F96]/20 p-8 sm:p-12 shadow-[0_0_40px_rgba(19,7,71,0.7)] backdrop-blur-xl text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#3535A0] to-[#3C217F] border border-white/30 text-[#C6A4FF] shadow-[0_0_20px_rgba(198,164,255,0.4)]">
            <Zap className="h-7 w-7 fill-[#C6A4FF]/30" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_20px_rgba(198,164,255,0.5)]">
            Yay! You Chose to Explore! 🎉
          </h1>

          <p className="mt-3 text-base sm:text-lg text-[#E8E5FA] font-medium">
            Let's discover something wonderful together.
          </p>

          <div className="mt-8 mx-auto max-w-md rounded-2xl border border-white/15 bg-[#130747]/60 p-6 text-left shadow-inner">
            <div className="flex items-center justify-between text-xs text-[#E8E5FA]/70">
              <span className="font-semibold text-white uppercase tracking-wider">Dashboard Status</span>
              <span className="text-[#C6A4FF] font-semibold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-[#C6A4FF] animate-pulse" />
                Active
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#E8E5FA]/80">
              Welcome to your dedicated dashboard, {recipientName}. This space is kept plain and static by default, ready for only the specific updates and content you choose to add.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
