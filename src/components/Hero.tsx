"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fireConfetti } from "./Confetti";
import { invite } from "@/lib/invite";

const LETTERS = invite.guest.toUpperCase().split("");
const SLICES = 9;

const BALLOONS = [
  { color: "#D9432A", x: "6%", y: "14%", z: 220, size: 1.1, delay: 0 },
  { color: "#F0A80C", x: "84%", y: "10%", z: 180, size: 1, delay: -1.5 },
  { color: "#0E5E50", x: "90%", y: "52%", z: 260, size: 1.25, delay: -3 },
  { color: "#7A1F3D", x: "2%", y: "58%", z: 140, size: 0.9, delay: -2 },
  { color: "#2F7FB8", x: "74%", y: "72%", z: 90, size: 0.8, delay: -4 },
  { color: "#F4C7A1", x: "18%", y: "76%", z: 60, size: 0.75, delay: -5 },
];

function Balloon({ color }: { color: string }) {
  return (
    <div className="balloon-body">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="balloon-slice" style={{ background: color, transform: `rotateY(${i * 30}deg)` }} />
      ))}
      <span className="balloon-knot" style={{ background: color }} />
      <span className="balloon-string" />
    </div>
  );
}

export default function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const [popped, setPopped] = useState<number[]>([]);
  const [to, setTo] = useState("");

  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("to");
    if (name) setTo(name.slice(0, 30));
  }, []);

  const pop = (e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    if (popped.includes(i)) return;
    setPopped((p) => [...p, i]);
    fireConfetti(e.clientX, e.clientY, 50);
    setTimeout(() => setPopped((p) => p.filter((n) => n !== i)), 3500);
  };

  useEffect(() => {
    const el = stage.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let lastMove = 0;
    let raf = 0;

    const move = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      lastMove = performance.now();
    };
    window.addEventListener("pointermove", move);
    const tiltPhone = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return;
      tx = Math.max(-1, Math.min(1, e.gamma / 30));
      ty = Math.max(-1, Math.min(1, (e.beta - 50) / 30));
      lastMove = performance.now();
    };
    window.addEventListener("deviceorientation", tiltPhone);

    const loop = (t: number) => {
      if (t - lastMove > 2500) {
        tx = Math.sin(t / 2200) * 0.7;
        ty = Math.cos(t / 3100) * 0.35;
      }
      el.style.setProperty("--sc", String(Math.min(window.scrollY / window.innerHeight, 1)));
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.setProperty("--ry", `${cx * 16}deg`);
      el.style.setProperty("--rx", `${-cy * 9}deg`);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("deviceorientation", tiltPhone);
    };
  }, []);

  return (
    <section className="hero" onClick={(e) => fireConfetti(e.clientX, e.clientY, 70)}>
      <div className="hero-perspective">
        <div className="stage" ref={stage}>
          <div className="back-word" aria-hidden="true">
            HAPPY BIRTHDAY
          </div>

          <div className="arch arch-a" />
          <div className="arch arch-b" />
          <div className="sun-disc" />

          <div className="person">
            <Image src="/photos/hasini.png" alt="Hasini" width={970} height={1650} priority sizes="(max-width: 700px) 60vw, 420px" />
          </div>

          <h1 className="name3d" aria-label={invite.guest}>
            {LETTERS.map((ch, i) => (
              <span className="letter" key={i} style={{ animationDelay: `${i * -0.35}s` }} aria-hidden="true">
                {Array.from({ length: SLICES }).map((_, s) => (
                  <span
                    key={s}
                    className={s === SLICES - 1 ? "slice front" : "slice"}
                    style={{ transform: `translateZ(${(s - SLICES + 1) * 7}px)` }}
                  >
                    {ch}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          {BALLOONS.map((b, i) => (
            <div
              key={i}
              className={popped.includes(i) ? "balloon popped" : "balloon"}
              onClick={(e) => pop(e, i)}
              style={{ left: b.x, top: b.y, transform: `translateZ(${b.z}px) scale(${b.size})`, animationDelay: `${b.delay}s` }}
            >
              <Balloon color={b.color} />
            </div>
          ))}

          <p className="hero-line">
            <span>{to ? `${to}, ${invite.guest} is turning a year more brilliant.` : `${invite.guest} is turning a year more brilliant.`}</span>
            <em>Tap anywhere. Pop a balloon.</em>
          </p>
        </div>
      </div>
      <a href="#invite" className="scroll-cue" onClick={(e) => e.stopPropagation()}>
        Open the invitation
      </a>
    </section>
  );
}
