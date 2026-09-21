const PANELS = 8;

import Spices from "./Spices";

export default function BiryaniRing() {
  return (
    <section className="ring-section reveal">
      <Spices count={16} />
      <h2 className="kicker rv">The real reason to come</h2>
      <div className="ring-perspective rv">
        <div className="ring" aria-hidden="true">
          {Array.from({ length: PANELS }).map((_, i) => (
            <span key={i} className="ring-panel" style={{ transform: `rotateY(${(360 / PANELS) * i}deg) translateZ(314px)` }}>
              Chicken
              <br />
              Biryani
            </span>
          ))}
        </div>
      </div>
      <p className="ring-note rv">Hasini&apos;s favourite, served hot and in unreasonable quantity.</p>
    </section>
  );
}
