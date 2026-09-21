"use client";

import { motion } from "motion/react";

// Words spring up into place every time the line scrolls into view, in either direction.
export default function SplitText({ text, className, as: Tag = "p" }: { text: string; className?: string; as?: "p" | "h2" | "span" }) {
  return (
    <Tag className={className} aria-label={text}>
      {text.split(" ").map((w, i) => (
        <span key={i} aria-hidden="true" style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", paddingBottom: "0.14em", marginRight: "0.25em" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "115%", rotate: 7, opacity: 0 }}
            whileInView={{ y: 0, rotate: 0, opacity: 1 }}
            viewport={{ amount: 0.9, once: false }}
            transition={{ type: "spring", stiffness: 170, damping: 18, delay: i * 0.06 }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
