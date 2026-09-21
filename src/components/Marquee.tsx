const WORDS = ["Chicken Biryani", "Happy Birthday Hasini", "Extra Raita", "23 September", "Make a Wish", "Dum Biryani"];

export default function Marquee({ flip = false }: { flip?: boolean }) {
  const row = [...WORDS, ...WORDS];
  return (
    <div className={flip ? "marquee flip" : "marquee"} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div className="marquee-row" key={k}>
            {row.map((w, i) => (
              <span key={i}>{w}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
