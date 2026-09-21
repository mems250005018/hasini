"use client";

import { useEffect } from "react";

export default function Reveal() {
  useEffect(() => {
    const once = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            once.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => once.observe(el));

    // Inner items animate in and out as you scroll down or up.
    const both = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("in", e.isIntersecting)),
      { threshold: 0.2, rootMargin: "0px 0px -6% 0px" },
    );
    document.querySelectorAll(".rv").forEach((el, i) => {
      (el as HTMLElement).style.setProperty("--d", String(i % 4));
      both.observe(el);
    });
    return () => {
      once.disconnect();
      both.disconnect();
    };
  }, []);
  return null;
}
