import { type SVGProps } from "react";

const common: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 100 100",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function ArtFlashMath() {
  return (
    <svg {...common}>
      <path d="M10 50 L20 50 L26 30 L36 70 L46 22 L54 78 L62 38 L70 60 L78 50 L90 50" />
      <circle cx="54" cy="78" r="2.4" fill="hsl(var(--primary))" stroke="none" />
    </svg>
  );
}

export function ArtGauntlet() {
  return (
    <svg {...common}>
      <g opacity="0.85">
        <rect x="14" y="20" width="14" height="14" rx="2" />
        <rect x="36" y="14" width="14" height="14" rx="2" transform="rotate(-6 43 21)" />
        <rect x="60" y="22" width="14" height="14" rx="2" transform="rotate(8 67 29)" />
        <rect x="20" y="48" width="14" height="14" rx="2" transform="rotate(4 27 55)" />
        <rect x="44" y="52" width="14" height="14" rx="2" transform="rotate(-10 51 59)" />
        <rect x="68" y="58" width="14" height="14" rx="2" transform="rotate(6 75 65)" />
      </g>
      <circle cx="51" cy="59" r="2.4" fill="hsl(var(--primary))" stroke="none" />
    </svg>
  );
}

export function ArtSchulte() {
  return (
    <svg {...common}>
      <g>
        {[0, 1, 2, 3].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect key={`${r}-${c}`} x={14 + c * 18} y={14 + r * 18} width="14" height="14" rx="1" />
          ))
        )}
      </g>
      <rect x="50" y="32" width="14" height="14" rx="1" fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth="1.4" />
      <circle cx="57" cy="39" r="1.6" fill="hsl(var(--primary))" stroke="none" />
    </svg>
  );
}

export function ArtNBack() {
  return (
    <svg {...common}>
      {[18, 34, 50, 66, 82].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={50} r="5" />
          {i < 4 && <line x1={x + 5} y1={50} x2={x + 11} y2={50} />}
        </g>
      ))}
      <circle cx="50" cy="50" r="5" fill="hsl(var(--primary))" stroke="none" />
    </svg>
  );
}

export function ArtReaction() {
  return (
    <svg {...common}>
      <circle cx="50" cy="50" r="6" />
      <circle cx="50" cy="50" r="14" opacity="0.7" />
      <circle cx="50" cy="50" r="22" opacity="0.45" />
      <circle cx="50" cy="50" r="30" opacity="0.22" />
      <circle cx="50" cy="50" r="3" fill="hsl(var(--primary))" stroke="none" />
    </svg>
  );
}

export function ArtCards() {
  return (
    <svg {...common}>
      <rect x="22" y="28" width="34" height="46" rx="3" transform="rotate(-12 39 51)" />
      <rect x="32" y="24" width="34" height="46" rx="3" transform="rotate(-2 49 47)" />
      <rect x="42" y="22" width="34" height="46" rx="3" transform="rotate(10 59 45)" />
      <circle cx="59" cy="45" r="2.4" fill="hsl(var(--primary))" stroke="none" />
    </svg>
  );
}

export function ArtOrbit() {
  return (
    <svg {...common}>
      <ellipse cx="50" cy="50" rx="34" ry="14" />
      <ellipse cx="50" cy="50" rx="34" ry="14" transform="rotate(35 50 50)" opacity="0.6" />
      <ellipse cx="50" cy="50" rx="34" ry="14" transform="rotate(-35 50 50)" opacity="0.4" />
      <circle cx="50" cy="50" r="3" />
      <circle cx="80" cy="58" r="2.4" fill="hsl(var(--primary))" stroke="none" />
    </svg>
  );
}

export const ART: Record<string, () => JSX.Element> = {
  flashmath: ArtFlashMath,
  gauntlet: ArtGauntlet,
  schulte: ArtSchulte,
  nback: ArtNBack,
  reaction: ArtReaction,
  cards: ArtCards,
  orbit: ArtOrbit,
};
