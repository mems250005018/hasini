"use client";

import { useEffect, useRef, useState } from "react";
import { fireConfetti } from "./Confetti";
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

export default function InviteCard() {
  const date = new Date(invite.date);
  const [flipped, setFlipped] = useState(false);
  const [said, setSaid] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const time = useCountdown(date.getTime());

  const day = date.toLocaleDateString("en-IN", { weekday: "long" });
  const dayNum = date.toLocaleDateString("en-IN", { day: "numeric" });
  const month = date.toLocaleDateString("en-IN", { month: "long" });
  const clock = date.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

  const tilt = (e: React.PointerEvent) => {
    const el = card.current!;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tx", `${px * 22}deg`);
    el.style.setProperty("--ty", `${-py * 16}deg`);
  };
  const untilt = () => {
    const el = card.current!;
    el.style.setProperty("--tx", "0deg");
    el.style.setProperty("--ty", "0deg");
  };

  const rsvp = (e: React.MouseEvent) => {
    fireConfetti(e.clientX, e.clientY, 120);
    setSaid(true);
  };
  const waHref = invite.whatsapp
    ? `https://wa.me/${invite.whatsapp}?text=${encodeURIComponent(`Happy birthday in advance ${invite.guest}! I'll be there.`)}`
    : null;

  const stamp = (d: Date) => d.toISOString().replace(/[-:]|\.\d{3}/g, "");
  const end = new Date(date.getTime() + 4 * 3600000);
  const calHref =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(`${invite.guest}'s Birthday`)}` +
    `&dates=${stamp(date)}/${stamp(end)}` +
    `&location=${encodeURIComponent([invite.venue, invite.address].filter(Boolean).join(", "))}`;

  return (
    <section id="invite" className="invite reveal">
      <h2 className="kicker">Flip it over</h2>

      <div className="card-perspective" onPointerMove={tilt} onPointerLeave={untilt}>
        <div className="card-tilt" ref={card}>
          <button
            type="button"
            className={flipped ? "card flipped" : "card"}
            onClick={() => {
              setFlipped((f) => !f);
              fireConfetti(undefined, undefined, 40);
            }}
            aria-label="Flip the invitation card"
          >
            <span className="face front-face">
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
            </span>
            <span className="face back-face">
              <span className="card-small">The details</span>
              <dl>
                <div>
                  <dt>When</dt>
                  <dd>
                    {day}, {dayNum} {month}
                    <br />
                    {clock}
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
            </span>
          </button>
        </div>
      </div>

      <div className="countdown" aria-live="off">
        {(time ? Object.entries(time) : [["Days", 0], ["Hours", 0], ["Minutes", 0], ["Seconds", 0]]).map(([label, value], i) => (
          <div className="tile" key={label} style={{ ["--i" as string]: i }}>
            <span className="tile-num" key={String(value)}>
              {String(value).padStart(2, "0")}
            </span>
            <span className="tile-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="rsvp">
        <button type="button" className="big-btn" onClick={rsvp}>
          {said ? "See you there" : "I'm coming"}
        </button>
        <a className="big-btn alt" href={calHref} target="_blank" rel="noopener noreferrer">
          Add to calendar
        </a>
        {waHref && (
          <a className="big-btn alt" href={waHref} target="_blank" rel="noopener noreferrer">
            Tell {invite.host} on WhatsApp
          </a>
        )}
      </div>
    </section>
  );
}
