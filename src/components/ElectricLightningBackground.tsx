import React, { useEffect, useRef } from 'react';

interface Spark {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

export const ElectricLightningBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Glowing particles in Electric Lavender (#C6A4FF), Pastel Pink (#EBC5E9), and Lightning White (#FFFFFF)
    const colors = [
      'rgba(198, 164, 255, 0.6)', // Electric Lavender
      'rgba(235, 197, 233, 0.5)', // Pastel Pink
      'rgba(232, 229, 250, 0.7)', // Lavender White
      'rgba(255, 255, 255, 0.8)', // Lightning White
    ];

    const sparkCount = Math.min(36, Math.floor(width / 40));
    const sparks: Spark[] = Array.from({ length: sparkCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.2 + Math.random() * 2.2,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -0.2 - Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    // Lightning bolt procedural generator
    let boltPoints: { x: number; y: number }[] = [];
    let boltOpacity = 0;
    let nextBoltTime = Date.now() + 2500 + Math.random() * 4000;

    const generateBolt = () => {
      const startX = width * (0.2 + Math.random() * 0.6);
      const startY = 0;
      let currentX = startX;
      let currentY = startY;
      const points = [{ x: currentX, y: currentY }];

      const targetY = height * (0.45 + Math.random() * 0.45);
      while (currentY < targetY) {
        currentY += 12 + Math.random() * 24;
        currentX += (Math.random() - 0.5) * 32;
        points.push({ x: currentX, y: currentY });
      }
      boltPoints = points;
      boltOpacity = 0.9;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Check for procedural lightning
      const now = Date.now();
      if (now > nextBoltTime) {
        generateBolt();
        nextBoltTime = now + 4000 + Math.random() * 6000;
      }

      // Draw active lightning bolt
      if (boltOpacity > 0.02 && boltPoints.length > 1) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(boltPoints[0].x, boltPoints[0].y);
        for (let i = 1; i < boltPoints.length; i++) {
          ctx.lineTo(boltPoints[i].x, boltPoints[i].y);
        }

        // Electric glow
        ctx.strokeStyle = `rgba(198, 164, 255, ${boltOpacity * 0.4})`;
        ctx.lineWidth = 6;
        ctx.shadowColor = '#C6A4FF';
        ctx.shadowBlur = 20;
        ctx.stroke();

        // Core white-hot lightning filament
        ctx.strokeStyle = `rgba(255, 255, 255, ${boltOpacity})`;
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.stroke();

        ctx.restore();
        boltOpacity *= 0.88; // Quick natural flash decay
      }

      // 2. Draw subtle floating electric sparks
      sparks.forEach((s) => {
        s.y += s.speedY;
        s.x += s.speedX + Math.sin(s.y * 0.02) * 0.3;

        if (s.y < -10) {
          s.y = height + 10;
          s.x = Math.random() * width;
        }
        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = '#C6A4FF';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Foundation Deep Blue & Midnight Violet Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#130747] via-[#302F96]/80 to-[#130747]" />

      {/* Atmospheric Electric Violet Radial Aura in Center */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[900px] rounded-full bg-radial from-[#3C217F]/80 via-[#3535A0]/35 to-transparent blur-3xl opacity-85 animate-plasma"
      />

      {/* Secondary Top-Right Electric Indigo Glow */}
      <div
        className="absolute -top-32 -right-32 h-[550px] w-[550px] rounded-full bg-[#3535A0]/40 blur-[120px]"
      />

      {/* Secondary Bottom-Left Deep Royal Aura */}
      <div
        className="absolute -bottom-32 -left-32 h-[550px] w-[550px] rounded-full bg-[#302F96]/45 blur-[120px]"
      />

      {/* Occasional subtle full-screen lightning flash ambiance */}
      <div className="absolute inset-0 bg-[#C6A4FF]/10 mix-blend-screen animate-lightning-flash pointer-events-none" />

      {/* Canvas for procedural lightning arcs and electric floating particles */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-90" />
    </div>
  );
};
