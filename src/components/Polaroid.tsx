"use client";

import Image from "next/image";
import { useRef } from "react";
import { invite } from "@/lib/invite";

export default function Polaroid() {
  const ref = useRef<HTMLDivElement>(null);

  const tilt = (e: React.PointerEvent) => {
    const el = ref.current!;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--py", `${((e.clientX - r.left) / r.width - 0.5) * 30}deg`);
    el.style.setProperty("--px", `${-((e.clientY - r.top) / r.height - 0.5) * 22}deg`);
  };
  const reset = () => {
    ref.current!.style.setProperty("--py", "0deg");
    ref.current!.style.setProperty("--px", "0deg");
  };

  return (
    <section className="memory reveal">
      <div className="memory-perspective rv from-left" onPointerMove={tilt} onPointerLeave={reset}>
        <div className="polaroid" ref={ref}>
          <span className="tape" />
          <Image src="/photos/friends.jpeg" alt="Hasini with two friends showing off a project" width={1280} height={960} sizes="(max-width: 700px) 80vw, 480px" />
          <p>Same people. Same chaos. One more candle.</p>
        </div>
      </div>
      <div className="memory-copy rv from-right">
        <h2 className="kicker">Why this party</h2>
        <p className="memory-big">Because {invite.guest} makes every room louder in the best way.</p>
        <p className="memory-small">So the biryani is ordered, the cake is ready, and your only job is to show up.</p>
      </div>
    </section>
  );
}
