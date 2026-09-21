"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import SplitText from "@/components/fx/SplitText";
import { invite } from "@/lib/invite";
import { photos } from "@/lib/assets";

export default function Polaroid() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const swing = useTransform(x, [-220, 0, 220], [-16, 0, 16]);

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
        <motion.div
          className="polaroid-drag"
          drag="x"
          dragSnapToOrigin
          dragElastic={0.35}
          style={{ x, rotate: swing, touchAction: "pan-y" }}
          whileDrag={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        >
        <div className="polaroid" ref={ref}>
          <span className="tape" />
          <Image src={photos.group.src} alt="Hasini with two friends showing off a project" width={photos.group.width} height={photos.group.height} sizes="(max-width: 700px) 80vw, 480px" />
          <p>Same people. Same chaos. One more candle.</p>
        </div>
        </motion.div>
      </div>
      <div className="memory-copy rv from-right">
        <h2 className="kicker">Why this party</h2>
        <SplitText className="memory-big" text={`Because ${invite.guest} makes every room louder in the best way.`} />
        <p className="memory-small">So the biryani is ordered, the cake is ready, and your only job is to show up.</p>
      </div>
    </section>
  );
}
