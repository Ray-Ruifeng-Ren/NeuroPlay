// Animated SVG abacus — chiaroscuro editorial style.
// Beads drift along their rods, faint digits float across the frame.
// Pure CSS keyframes, no runtime cost.

const ROWS = 7;
const BEADS_TOP = 2;    // 上珠（每颗代表 5）
const BEADS_BOT = 5;    // 下珠（每颗代表 1）

export function CinematicAbacus({ className = "" }: { className?: string }) {
  const W = 560;
  const H = 420;
  const padX = 40;
  const beamY = H * 0.34;
  const colGap = (W - padX * 2) / (ROWS - 1);
  const beadR = 13;

  return (
    <div className={`relative ${className}`} aria-hidden>
      {/* Warm rim glow */}
      <div
        className="pointer-events-none absolute -inset-10 -z-10 blur-3xl"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 45%, hsl(38 90% 55% / 0.22), transparent 70%)",
        }}
      />
      {/* Floating digits */}
      <FloatingDigits />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="relative h-full w-full"
        style={{ filter: "drop-shadow(0 30px 60px rgb(0 0 0 / 0.55))" }}
      >
        <defs>
          <linearGradient id="frame" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#3a2412" />
            <stop offset="0.5" stopColor="#1c0f06" />
            <stop offset="1" stopColor="#0c0703" />
          </linearGradient>
          <linearGradient id="bead" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f5c66b" />
            <stop offset="0.55" stopColor="#c98a2a" />
            <stop offset="1" stopColor="#5a3a10" />
          </linearGradient>
          <radialGradient id="beadHi" cx="0.3" cy="0.3" r="0.6">
            <stop offset="0" stopColor="#fff5d6" stopOpacity="0.9" />
            <stop offset="0.5" stopColor="#fff5d6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="rod" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#6b5436" />
            <stop offset="1" stopColor="#2a2014" />
          </linearGradient>
        </defs>

        {/* Outer wood frame */}
        <rect x="6" y="6" width={W - 12} height={H - 12} rx="14" fill="url(#frame)" />
        <rect
          x="6"
          y="6"
          width={W - 12}
          height={H - 12}
          rx="14"
          fill="none"
          stroke="#f5c66b"
          strokeOpacity="0.18"
          strokeWidth="1"
        />

        {/* Beam (divider) */}
        <rect x="20" y={beamY - 5} width={W - 40} height="10" rx="2" fill="#2a1a0a" />
        <rect x="20" y={beamY - 5} width={W - 40} height="2" fill="#f5c66b" fillOpacity="0.25" />

        {/* Rods + beads */}
        {Array.from({ length: ROWS }).map((_, i) => {
          const x = padX + i * colGap;
          return (
            <g key={i}>
              {/* rod */}
              <rect
                x={x - 1.5}
                y={28}
                width="3"
                height={H - 56}
                fill="url(#rod)"
              />

              {/* Top section: 2 beads */}
              {Array.from({ length: BEADS_TOP }).map((_, b) => (
                <Bead
                  key={`t${i}-${b}`}
                  cx={x}
                  baseY={50 + b * (beadR * 2 + 2)}
                  travel={beamY - 28 - BEADS_TOP * (beadR * 2 + 2)}
                  r={beadR}
                  delay={(i * 0.4 + b * 0.15) % 5}
                  duration={3.6 + (i % 3) * 0.7}
                  direction="down"
                />
              ))}

              {/* Bottom section: 5 beads */}
              {Array.from({ length: BEADS_BOT }).map((_, b) => (
                <Bead
                  key={`b${i}-${b}`}
                  cx={x}
                  baseY={H - 50 - b * (beadR * 2 + 2)}
                  travel={-(H - beamY - 28 - BEADS_BOT * (beadR * 2 + 2))}
                  r={beadR}
                  delay={(i * 0.55 + b * 0.2 + 1.2) % 5}
                  duration={4 + (i % 4) * 0.6}
                  direction="up"
                />
              ))}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Bead({
  cx,
  baseY,
  travel,
  r,
  delay,
  duration,
}: {
  cx: number;
  baseY: number;
  travel: number;
  r: number;
  delay: number;
  duration: number;
  direction: "up" | "down";
}) {
  return (
    <g
      style={{
        transformOrigin: `${cx}px ${baseY}px`,
        animation: `abacusBead ${duration}s cubic-bezier(.65,.05,.36,1) ${delay}s infinite`,
        // CSS var consumed by the keyframes
        ["--travel" as never]: `${travel}px`,
      }}
    >
      <ellipse cx={cx} cy={baseY} rx={r} ry={r * 0.78} fill="url(#bead)" />
      <ellipse cx={cx - r * 0.25} cy={baseY - r * 0.2} rx={r * 0.55} ry={r * 0.32} fill="url(#beadHi)" />
      <ellipse cx={cx} cy={baseY} rx={r} ry={r * 0.78} fill="none" stroke="#1a0e04" strokeOpacity="0.55" />
    </g>
  );
}

function FloatingDigits() {
  const digits = ["7", "3", "9", "1", "8", "5", "2", "6", "4"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {digits.map((d, i) => (
        <span
          key={i}
          className="absolute font-mono-tabular text-[#f5c66b]/15 select-none"
          style={{
            left: `${(i * 11 + 7) % 90}%`,
            top: `${(i * 17 + 5) % 85}%`,
            fontSize: `${18 + ((i * 7) % 28)}px`,
            animation: `digitDrift ${10 + (i % 5) * 2}s ease-in-out ${i * 0.6}s infinite`,
          }}
        >
          {d}
        </span>
      ))}
    </div>
  );
}
