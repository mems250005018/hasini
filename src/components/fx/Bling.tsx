"use client";

import { motion } from "motion/react";

// Overlay in the coordinate space of hasini.png (970 x 1621), extended 220 units above
// the image so the crown can sit on top of her head.
const TOP = 220;
const H = 1621;

export default function Bling() {
  return (
    <svg
      className="bling"
      viewBox={`0 -${TOP} 970 ${H + TOP}`}
      style={{ top: `${(-TOP / H) * 100}%`, height: `${((H + TOP) / H) * 100}%` }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe27a" />
          <stop offset="0.55" stopColor="#f2b21a" />
          <stop offset="1" stopColor="#c98a0a" />
        </linearGradient>
        <linearGradient id="silk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d4472c" />
          <stop offset="1" stopColor="#a02611" />
        </linearGradient>
      </defs>

      {/* sash across the shoulder */}
      <motion.g
        initial={{ opacity: 0, x: -140, y: -60 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 90, damping: 14, delay: 5.3 }}
      >
        <g transform="translate(345 298) rotate(53.7)">
          <path d="M18 -52 H572 L554 52 H0 Z" fill="url(#silk)" stroke="#2a140a" strokeWidth="6" strokeLinejoin="round" />
          <rect x="6" y="-52" width="562" height="9" fill="url(#gold)" />
          <rect x="-4" y="43" width="560" height="9" fill="url(#gold)" />
          <text
            x="282"
            y="19"
            textAnchor="middle"
            fontSize="52"
            fontWeight="800"
            letterSpacing="5"
            fill="#ffeeb8"
            stroke="#5b1508"
            strokeWidth="1.5"
            style={{ fontFamily: "var(--f-display), system-ui, sans-serif" }}
          >
            BIRTHDAY GIRL
          </text>
        </g>
      </motion.g>

      {/* crown */}
      <motion.g
        style={{ originX: 0.5, originY: 1 }}
        initial={{ y: -520, rotate: -35, opacity: 0 }}
        animate={{ y: 0, rotate: -7, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 10, delay: 4.8 }}
      >
        <g transform="translate(2 46)">
        <motion.g animate={{ y: [0, -7, 0] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 6.2 }}>
          <path
            d="M405 48 L388 -98 L462 -34 L520 -132 L578 -34 L652 -98 L635 48 Z"
            fill="url(#gold)"
            stroke="#7a4a06"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <rect x="405" y="14" width="230" height="34" rx="6" fill="#c98a0a" stroke="#7a4a06" strokeWidth="6" />
          <circle cx="388" cy="-98" r="15" fill="#e23b3b" stroke="#7a4a06" strokeWidth="4" />
          <circle cx="520" cy="-132" r="17" fill="#e23b3b" stroke="#7a4a06" strokeWidth="4" />
          <circle cx="652" cy="-98" r="15" fill="#e23b3b" stroke="#7a4a06" strokeWidth="4" />
          <circle cx="462" cy="31" r="10" fill="#3f8f3a" stroke="#7a4a06" strokeWidth="3" />
          <circle cx="520" cy="31" r="12" fill="#2f7fb8" stroke="#7a4a06" strokeWidth="3" />
          <circle cx="578" cy="31" r="10" fill="#3f8f3a" stroke="#7a4a06" strokeWidth="3" />
          <path d="M430 -6 L420 -70" stroke="#fff3b0" strokeWidth="8" strokeLinecap="round" opacity="0.7" />
        </motion.g>
        </g>
      </motion.g>
    </svg>
  );
}
