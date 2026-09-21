const KINDS = ["rice", "chili", "cardamom", "anise", "leg", "rice", "rice", "cardamom"];

export default function Spices({ count = 22 }: { count?: number }) {
  return (
    <div className="spices" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => {
        const r = (n: number) => {
          const x = Math.sin(i * 91.7 + n * 37.13) * 43758.5453;
          return x - Math.floor(x);
        };
        return (
          <span
            key={i}
            className={`spice ${KINDS[i % KINDS.length]}`}
            style={{
              left: `${Math.round(r(1) * 100)}%`,
              animationDuration: `${12 + r(2) * 14}s`,
              animationDelay: `${-r(3) * 20}s`,
              ["--sway" as string]: `${Math.round((r(4) - 0.5) * 160)}px`,
              scale: String(0.7 + r(5) * 0.9),
            }}
          />
        );
      })}
    </div>
  );
}
