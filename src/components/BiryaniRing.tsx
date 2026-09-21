const PANELS = 8;

export default function BiryaniRing() {
  return (
    <section className="ring-section reveal">
      <h2 className="kicker">The real reason to come</h2>
      <div className="ring-perspective">
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
      <p className="ring-note">Hasini&apos;s favourite, served hot and in unreasonable quantity.</p>
    </section>
  );
}
