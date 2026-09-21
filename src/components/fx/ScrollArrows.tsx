"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

// Small bouncing arrows on the right edge that show which way you can still scroll.
export default function ScrollArrows() {
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(true);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setCanUp(window.scrollY > 240);
      setCanDown(window.scrollY < max - 240);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const step = (dir: 1 | -1) => window.scrollBy({ top: dir * window.innerHeight * 0.85, behavior: "smooth" });

  return (
    <div className="scroll-arrows">
      <AnimatePresence>
        {canUp && (
          <motion.button
            key="up"
            type="button"
            className="arrow-btn up"
            aria-label="Scroll up"
            onClick={() => step(-1)}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            whileTap={{ scale: 0.88 }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        )}
        {canDown && (
          <motion.button
            key="down"
            type="button"
            className="arrow-btn down"
            aria-label="Scroll down"
            onClick={() => step(1)}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.4 }}
            whileTap={{ scale: 0.88 }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 9l7 7 7-7" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
