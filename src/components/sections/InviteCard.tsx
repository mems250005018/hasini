"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { fireConfetti } from "@/components/fx/Confetti";
import { invite } from "@/lib/invite";

function useCountdown(target: number) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return null;
  const diff = Math.max(0, target - now);
  return {
    Days: Math.floor(diff / 86400000),
    Hours: Math.floor(diff / 3600000) % 24,
    Minutes: Math.floor(diff / 60000) % 60,
    Seconds: Math.floor(diff / 1000) % 60,
  };
}

const pop = {
  whileHover: { scale: 1.07, rotate: -2 },
  whileTap: { scale: 0.94 },
  transition: { type: "spring", stiffness: 400, damping: 15 },
} as const;

export default function InviteCard() {
  const date = new Date(invite.date);
  const [flipped, setFlipped] = useState(false);
  const [lifted, setLifted] = useState(false);
  const [said, setSaid] = useState(false);
  const time = useCountdown(date.getTime());

  // Pointer tilt, smoothed with springs.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 120, damping: 16 });
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 16 });

  const dayNum = date.toLocaleDateString("en-IN", { day: "numeric" });
  const month = date.toLocaleDateString("en-IN", { month: "long" });
  const meet = new Date(invite.meetAt);
  const meetClock = meet.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();

  const flip = () => {
    setFlipped((f) => !f);
    setLifted(true);
    setTimeout(() => setLifted(false), 550);
    fireConfetti(undefined, undefined, 40);
  };

  const rsvp = (e: React.MouseEvent) => {
    fireConfetti(e.clientX, e.clientY, 120);
    setSaid(true);
  };
  const waHref = invite.whatsapp
    ? `https://wa.me/${invite.whatsapp}?text=${encodeURIComponent(`Happy birthday in advance ${invite.guest}! I'll be there.`)}`
    : null;

  const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const end = new Date(meet.getTime() + 4 * 3600000);
  const calHref =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(`${invite.guest}'s Birthday`)}` +
    `&dates=${stamp(meet)}/${stamp(end)}` +
    `&location=${encodeURIComponent([invite.venue, invite.address].filter(Boolean).join(", "))}`;

  return (
    <section id="invite" className="invite reveal">
      <h2 className="kicker rv">Flip it over</h2>

      <div
        className="card-perspective rv from-left"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
      >
        <motion.div className="card-tilt" style={{ rotateX: tiltX, rotateY: tiltY }} animate={{ scale: lifted ? 1.09 : 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}>
          <motion.div
            className="card"
            role="button"
            tabIndex={0}
            aria-label="Flip the invitation card"
            aria-pressed={flipped}
            onClick={flip}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                flip();
              }
            }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 13, mass: 1.1 }}
          >
            <div className="face front-face">
              <span className="card-small">You are invited to</span>
              <span className="card-big">
                {invite.guest}
                <i>&apos;s</i>
                <br />
                birthday
              </span>
              <span className="card-stamp">
                <b>{dayNum}</b>
                {month}
              </span>
              <span className="card-hint">Tap to flip</span>
            </div>
            <div className="face back-face">
              <span className="card-small">The details</span>
              <dl>
                <div>
                  <dt>When</dt>
                  <dd>
                    {invite.whenLabel}
                    <br />
                    {meetClock}
                  </dd>
                </div>
                <div>
                  <dt>Where</dt>
                  <dd>
                    {invite.venue}
                    {invite.address && (
                      <>
                        <br />
                        {invite.address}
                      </>
                    )}
                  </dd>
                </div>
                <div>
                  <dt>Wear</dt>
                  <dd>{invite.dressCode}</dd>
                </div>
              </dl>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <div className="countdown" aria-live="off">
        {(time ? Object.entries(time) : [["Days", 0], ["Hours", 0], ["Minutes", 0], ["Seconds", 0]]).map(([label, value], i) => (
          <div className="tile rv" key={label} style={{ ["--i" as string]: i }}>
            <span className="tile-num" key={String(value)}>
              {String(value).padStart(2, "0")}
            </span>
            <span className="tile-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="rsvp rv">
        <motion.button type="button" className="big-btn" onClick={rsvp} {...pop}>
          {said ? "See you there" : "I'm coming"}
        </motion.button>
        <motion.a className="big-btn alt" href={calHref} target="_blank" rel="noopener noreferrer" {...pop}>
          Add to calendar
        </motion.a>
        {waHref && (
          <motion.a className="big-btn alt" href={waHref} target="_blank" rel="noopener noreferrer" {...pop}>
            Tell {invite.host} on WhatsApp
          </motion.a>
        )}
      </div>
    </section>
  );
}
