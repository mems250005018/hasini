"use client";

import { motion } from "motion/react";

const WORDS = ["Chicken Biryani", "Happy Birthday Hasini", "Extra Raita", "23 September", "Make a Wish", "Dum Biryani", "Lake at Midnight"];

function Band({ reverse, tone, angle, from }: { reverse?: boolean; tone: "ink" | "chili"; angle: number; from: number }) {
  // The row is rendered twice; sliding the track by exactly half loops it with no seam.
  const row = (k: number) => (
    <div className="tape-row" key={k}>
      {WORDS.map((w) => (
        <span key={w}>
          {w}
          <i>{"✦"}</i>
        </span>
      ))}
    </div>
  );
  return (
    <motion.div
      className={`tape-band ${tone}`}
      initial={{ x: from, rotate: angle * 2.2, opacity: 0 }}
      whileInView={{ x: 0, rotate: angle, opacity: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ type: "spring", stiffness: 60, damping: 14 }}
    >
      <div className={reverse ? "tape-track reverse" : "tape-track"}>
        {row(0)}
        {row(1)}
      </div>
    </motion.div>
  );
}

// Two tapes crossing in an X, sliding in opposite directions.
export default function Marquee({ flip = false }: { flip?: boolean }) {
  return (
    <div className="tapes" aria-hidden="true">
      <Band tone={flip ? "chili" : "ink"} angle={flip ? 4 : -4} from={-500} />
      <Band tone={flip ? "ink" : "chili"} angle={flip ? -4 : 4} from={500} reverse />
    </div>
  );
}
