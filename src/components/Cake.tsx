"use client";

import { useRef, useState } from "react";
import { fireConfetti } from "./Confetti";

const SEGMENTS = 22;
const TIERS = [
  { r: 130, h: 70, y: 0, color: "#7A1F3D", icing: "#F4C7A1" },
  { r: 92, h: 62, y: -70, color: "#D9432A", icing: "#F0A80C" },
  { r: 56, h: 52, y: -132, color: "#0E5E50", icing: "#F4C7A1" },
];

function Tier({ r, h, y, color, icing }: (typeof TIERS)[number]) {
  const w = (2 * Math.PI * r) / SEGMENTS + 1.5;
  return (
    <div className="tier" style={{ transform: `translateY(${y}px)` }}>
      {Array.from({ length: SEGMENTS }).map((_, i) => (
        <span
          key={i}
          className="tier-side"
          style={{
            width: w,
            height: h,
            marginLeft: -w / 2,
            background: i % 2 ? color : color,
            transform: `rotateY(${(360 / SEGMENTS) * i}deg) translateZ(${r}px)`,
          }}
        >
          <span className="drip" style={{ background: icing, height: 12 + ((i * 7) % 5) * 5 }} />
        </span>
      ))}
      <span className="tier-top" style={{ width: r * 2, height: r * 2, marginLeft: -r, marginTop: -r, background: icing, transform: `translateY(0) rotateX(90deg) translateZ(${h}px)` }} />
    </div>
  );
}

export default function Cake() {
  const [lit, setLit] = useState(true);
  const [spin, setSpin] = useState({ x: 0, drag: false });
  const start = useRef(0);
  const base = useRef(0);

  const blow = (e: React.MouseEvent) => {
    if (!lit) {
      setLit(true);
      return;
    }
    setLit(false);
    fireConfetti(e.clientX, e.clientY, 160);
  };

  return (
    <section className="cake-section reveal">
      <div className="cake-copy">
        <h2 className="kicker">Before the party</h2>
        <p className="cake-title">Grab the cake. Turn it. Blow it out.</p>
        <button type="button" className="big-btn" onClick={blow}>
          {lit ? "Blow the candles" : "Light them again"}
        </button>
        <p className="wish">{lit ? "Drag the cake to spin it." : "Wish made. Now come and eat it for real."}</p>
      </div>

      <div
        className="cake-perspective"
        onPointerDown={(e) => {
          start.current = e.clientX;
          base.current = spin.x;
          setSpin((s) => ({ ...s, drag: true }));
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (spin.drag) setSpin({ x: base.current + (e.clientX - start.current) * 0.6, drag: true });
        }}
        onPointerUp={() => setSpin((s) => ({ ...s, drag: false }))}
      >
        <div className="cake-rotor" style={{ ["--spin" as string]: `${spin.x}deg` }}>
          <div className={spin.drag ? "cake" : "cake auto"}>
            <div className="plate" />
            {TIERS.map((t, i) => (
              <Tier key={i} {...t} />
            ))}
            <div className="candles">
              {[0, 1, 2, 3, 4].map((i) => {
                const a = (i / 5) * Math.PI * 2;
                return (
                  <span key={i} className="candle" style={{ transform: `translate3d(${Math.cos(a) * 30}px, -184px, ${Math.sin(a) * 30}px)` }}>
                    <span className="stick" />
                    <span className={lit ? "flame" : "flame out"} style={{ animationDelay: `${i * -0.2}s` }} />
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
