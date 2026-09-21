"use client";

import { useEffect, useState } from "react";
import { fireConfetti } from "./Confetti";
import { invite } from "@/lib/invite";

const KINDS = ["rice", "rice", "chili", "cardamom", "leg", "rice", "anise", "leg"];

// Deterministic so server and client markup match.
const BITS = Array.from({ length: 34 }).map((_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    kind: KINDS[i % KINDS.length],
    dx: Math.round((r(1) - 0.5) * 760),
    dy: -Math.round(180 + r(2) * 300),
    rot: Math.round((r(3) - 0.5) * 900),
    delay: (2.05 + r(4) * 0.35).toFixed(2),
  };
});

export default function Intro() {
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t1 = setTimeout(() => setOpen(true), reduce ? 0 : 4200);
    return () => {
      clearTimeout(t1);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      setGone(true);
      document.body.style.overflow = "";
    }, 1100);
    const c = setTimeout(() => fireConfetti(undefined, undefined, 180), 350);
    return () => {
      clearTimeout(t);
      clearTimeout(c);
    };
  }, [open]);

  if (gone) return null;

  return (
    <div className={open ? "intro open" : "intro"} onClick={() => setOpen(true)} role="presentation">
      <div className="curtain left" />
      <div className="curtain right" />

      <div className="intro-center">
        <div className="pot-wrap">
          <div className="fire" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

          <svg className="pot" viewBox="0 0 300 270" aria-hidden="true">
            <path d="M40 122 Q14 205 92 240 Q150 262 208 240 Q286 205 260 122 Z" fill="#B5651D" stroke="#2a140a" strokeWidth="5" />
            <path d="M62 150 Q60 200 100 224" fill="none" stroke="#E0964A" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
            <rect x="28" y="104" width="244" height="26" rx="13" fill="#8f4a12" stroke="#2a140a" strokeWidth="5" />
            <g className="lid">
              <path d="M52 106 Q150 6 248 106 Z" fill="#C97A2B" stroke="#2a140a" strokeWidth="5" strokeLinejoin="round" />
              <path d="M84 92 Q120 48 160 40" fill="none" stroke="#F2B36A" strokeWidth="7" strokeLinecap="round" opacity="0.7" />
              <circle cx="150" cy="44" r="12" fill="#2a140a" />
            </g>
          </svg>

          <div className="steam-set" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          {BITS.map((b, i) => (
            <span
              key={i}
              className={`bit ${b.kind}`}
              style={{ ["--dx" as string]: `${b.dx}px`, ["--dy" as string]: `${b.dy}px`, ["--rot" as string]: `${b.rot}deg`, animationDelay: `${b.delay}s` }}
            />
          ))}
        </div>

        <p className="intro-line one">Dum on. Lid sealed. Aroma building...</p>
        <p className="intro-line two">
          Happy Birthday,
          <br />
          <b>{invite.guest}</b>
        </p>
        <button type="button" className="skip">
          Skip
        </button>
      </div>
    </div>
  );
}
