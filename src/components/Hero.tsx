"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { fireConfetti } from "./Confetti";
import Spices from "./Spices";
import Balloons3D from "./Balloons3D";
import Bling from "./Bling";
import { invite } from "@/lib/invite";

const LETTERS = invite.guest.toUpperCase().split("");
const SLICES = 9;

export default function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const [to, setTo] = useState("");

  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("to");
    if (name) setTo(name.slice(0, 30));
  }, []);

  useEffect(() => {
    const el = stage.current!;
    const hero = el.closest(".hero") as HTMLElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    let lastMove = 0;
    let raf = 0;

    const move = (e: PointerEvent) => {
      hero.style.setProperty("--mx", `${e.clientX}px`);
      hero.style.setProperty("--my", `${e.clientY - hero.getBoundingClientRect().top}px`);
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

  const onHeroClick = (e: React.MouseEvent) => {
    fireConfetti(e.clientX, e.clientY, 70);
    window.dispatchEvent(new CustomEvent("hero-click", { detail: { x: e.clientX, y: e.clientY } }));
  };

  return (
    <section className="hero" onClick={onHeroClick}>
      <Spices count={26} />
      <div className="steam" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="hero-perspective">
        <div className="stage" ref={stage}>
          <div className="back-word" aria-hidden="true">
            HAPPY BIRTHDAY
          </div>

          <div className="arch arch-a" />
          <div className="arch arch-b" />

          <div className="person">
            <div className="person-art">
              <Image src="/photos/hasini.png" alt="Hasini" width={970} height={1621} priority sizes="(max-width: 700px) 60vw, 420px" />
              <Bling />
            </div>
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

          <p className="hero-line">
            <span>{to ? `${to}, ${invite.guest} is turning a year more brilliant.` : `${invite.guest} is turning a year more brilliant.`}</span>
            <em>Biryani is on the menu. Pop a balloon.</em>
          </p>
        </div>
      </div>
      <Balloons3D />
      <a href="#invite" className="scroll-cue" onClick={(e) => e.stopPropagation()}>
        Open the invitation
      </a>
    </section>
  );
}
