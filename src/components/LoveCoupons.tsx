import React, { useState } from 'react';
import { Ticket, Sparkles, Check, Heart, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LoveCoupon } from '../types';
import { soundEngine } from '../utils/audio';

interface LoveCouponsProps {
  coupons: LoveCoupon[];
  onUpdateCoupons: (updated: LoveCoupon[]) => void;
}

export const LoveCoupons: React.FC<LoveCouponsProps> = ({ coupons, onUpdateCoupons }) => {
  const [activeCoupons, setActiveCoupons] = useState<LoveCoupon[]>(coupons);

  const handleRedeem = (id: string) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const updated = activeCoupons.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          isRedeemed: true,
          redeemedDate: today,
        };
      }
      return c;
    });

    setActiveCoupons(updated);
    onUpdateCoupons(updated);

    soundEngine.playChime(1046);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F43F5E', '#F59E0B', '#10B981'],
    });
  };

  const handleResetOne = (id: string) => {
    const updated = activeCoupons.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          isRedeemed: false,
          redeemedDate: undefined,
        };
      }
      return c;
    });

    setActiveCoupons(updated);
    onUpdateCoupons(updated);
    soundEngine.playChime(500);
  };

  return (
    <section id="coupons" className="relative py-20 bg-stone-950 border-t border-stone-800/80">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-medium tracking-widest text-emerald-400 uppercase">
            <span>Chapter 06</span>
            <span aria-hidden="true">·</span>
            <span>Unconditional Privileges</span>
          </div>

          <h2 className="mt-3 font-serif text-3xl font-medium text-stone-100 sm:text-4xl text-balance">
            The Golden Love Vouchers
          </h2>
          <p className="mt-3 text-sm text-stone-400 max-w-md mx-auto">
            Six binding promise certificates. Non-expiring, redeemable whenever your heart desires.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {activeCoupons.map((coupon, idx) => (
            <div
              key={coupon.id}
              className={`relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
                coupon.isRedeemed
                  ? 'border-stone-800/60 bg-stone-950/40 opacity-75'
                  : 'border-stone-800 bg-gradient-to-b from-stone-900/90 to-stone-950 hover:border-amber-500/40 hover:-translate-y-1 shadow-lg'
              }`}
            >
              {/* Ticket Notch decorations on sides */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-stone-950 border border-stone-800" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-stone-950 border border-stone-800" />

              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Ticket className="h-3.5 w-3.5" />
                    <span>COUPON #{String(idx + 1).padStart(2, '0')}</span>
                  </span>
                  <span>100% VALID</span>
                </div>

                <h3 className="mt-3 font-serif text-xl font-medium text-stone-100">
                  {coupon.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-stone-300">
                  {coupon.promise}
                </p>

                <p className="mt-3 text-[11px] text-stone-500 font-mono italic">
                  * {coupon.terms}
                </p>
              </div>

              {/* Action Button & Stamp */}
              <div className="mt-6 border-t border-dashed border-stone-800 pt-4 flex items-center justify-between">
                {!coupon.isRedeemed ? (
                  <button
                    onClick={() => handleRedeem(coupon.id)}
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 py-2.5 px-4 text-xs font-semibold text-stone-950 hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
                  >
                    <span>Tap to Claim Voucher</span>
                    <Heart className="h-3.5 w-3.5 fill-stone-950" />
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-between">
                    <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-300">
                      <Check className="h-3.5 w-3.5" />
                      <span>Claimed on {coupon.redeemedDate}</span>
                    </div>

                    <button
                      onClick={() => handleResetOne(coupon.id)}
                      type="button"
                      className="text-stone-500 hover:text-stone-300 text-xs p-1"
                      title="Reset voucher"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
