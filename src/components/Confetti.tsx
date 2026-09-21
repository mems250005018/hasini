"use client";

import { useEffect, useRef } from "react";
import { palette } from "@/lib/invite";

type Piece = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  rot: number;
  vr: number;
  flip: number;
  vf: number;
  color: string;
  life: number;
};

export function fireConfetti(x?: number, y?: number, count = 90) {
  window.dispatchEvent(new CustomEvent("confetti", { detail: { x, y, count } }));
}

export default function Confetti() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const pieces: Piece[] = [];
    let raf = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    resize();
    window.addEventListener("resize", resize);

    const burst = (e: Event) => {
      const d = (e as CustomEvent).detail as { x?: number; y?: number; count: number };
      const cx = d.x ?? window.innerWidth / 2;
      const cy = d.y ?? window.innerHeight * 0.4;
      for (let i = 0; i < d.count; i++) {
        const a = Math.random() * Math.PI * 2;
        const s = 4 + Math.random() * 10;
        pieces.push({
          x: cx,
          y: cy,
          vx: Math.cos(a) * s,
          vy: Math.sin(a) * s - 6,
          w: 6 + Math.random() * 8,
          h: 10 + Math.random() * 10,
          rot: Math.random() * 6.28,
          vr: (Math.random() - 0.5) * 0.4,
          flip: Math.random() * 6.28,
          vf: 0.1 + Math.random() * 0.2,
          color: palette[Math.floor(Math.random() * palette.length)],
          life: 1,
        });
      }
    };
    window.addEventListener("confetti", burst);

    const tick = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);
      for (let i = pieces.length - 1; i >= 0; i--) {
        const p = pieces[i];
        p.vy += 0.28;
        p.vx *= 0.985;
        p.vy *= 0.985;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.flip += p.vf;
        p.life -= 0.006;
        if (p.life <= 0 || p.y > window.innerHeight + 40) {
          pieces.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.scale(1, Math.cos(p.flip));
        ctx.globalAlpha = Math.min(1, p.life * 3);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const opening = window.setTimeout(() => fireConfetti(undefined, undefined, 140), 700);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(opening);
      window.removeEventListener("resize", resize);
      window.removeEventListener("confetti", burst);
    };
  }, []);

  return <canvas ref={ref} className="confetti" aria-hidden="true" />;
}
