"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Spices from "@/components/fx/Spices";
import { photos } from "@/lib/assets";

const DISHES = photos.dishes;

// Cover-flow style gallery: the active dish faces you, the others fan out at an angle behind it.
export default function Feast() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = DISHES.length;

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 3200);
    return () => clearInterval(id);
  }, [paused, n]);

  return (
    <section className="ring-section feast reveal">
      <Spices count={16} />
      <h2 className="kicker rv">The real reason to come</h2>

      <div
        className="feast-stage rv"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        role="group"
        aria-label="Dishes on the menu"
      >
        <motion.div
          className="feast-pan"
          onPanEnd={(_, info) => {
            if (info.offset.x < -40) setActive((a) => (a + 1) % n);
            else if (info.offset.x > 40) setActive((a) => (a + n - 1) % n);
          }}
        >
          {DISHES.map((d, i) => {
            const rel = (i - active + n) % n; // 0 front, 1 right, 2 left
            const offset = rel === 0 ? 0 : rel === 1 ? 1 : -1;
            return (
              <motion.button
                type="button"
                key={d.src}
                className="dish"
                aria-label={d.name}
                onClick={() => setActive(i)}
                animate={{
                  x: `${offset * 62}%`,
                  z: offset === 0 ? 0 : -180,
                  rotateY: offset * -38,
                  scale: offset === 0 ? 1 : 0.8,
                  opacity: offset === 0 ? 1 : 0.85,
                }}
                transition={{ type: "spring", stiffness: 110, damping: 16 }}
                style={{ zIndex: offset === 0 ? 3 : 1 }}
                whileHover={offset === 0 ? { scale: 1.04 } : undefined}
              >
                <Image src={d.src} alt={d.name} width={1200} height={800} sizes="(max-width: 700px) 78vw, 440px" priority={i === 0} />
                <span className="dish-tag">{d.name}</span>
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="feast-dots" aria-hidden="true">
        {DISHES.map((d, i) => (
          <span key={d.src} className={i === active ? "on" : ""} />
        ))}
      </div>
      <p className="ring-note rv">Hasini&apos;s favourites, served hot and in unreasonable quantity.</p>
    </section>
  );
}
