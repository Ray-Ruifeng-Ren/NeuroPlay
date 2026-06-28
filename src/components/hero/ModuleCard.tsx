import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ART } from "./art/ModuleArt";

type Props = {
  id: string;
  index: number;
  name: string;
  tagline: string;
  featured?: boolean;
  rotate: number;
  hovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  shift: number; // px push for "make room" effect
};

export function ModuleCard({
  id, index, name, tagline, featured, rotate, hovered, onHover, onLeave, shift,
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sx: 0 });
  const Art = ART[id] ?? ART.flashmath;

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;   // 0..1
    setTilt({
      ry: (px - 0.5) * 12,   // rotateY
      rx: -(py - 0.5) * 8,   // rotateX
      sx: px * 100,
    });
  };
  const onOut = () => { setTilt({ rx: 0, ry: 0, sx: 0 }); onLeave(); };

  const baseRotate = hovered ? 0 : rotate;
  const lift = hovered ? -16 : 0;
  const scale = hovered ? 1.05 : 1;

  return (
    <Link
      ref={ref}
      to={`/play/${id}`}
      onMouseEnter={onHover}
      onMouseMove={onMove}
      onMouseLeave={onOut}
      className="group relative block aspect-[5/7] w-full"
      style={{
        perspective: 1200,
        zIndex: hovered ? 30 : 10 + index,
        transform: `translateX(${shift}px)`,
        transition: "transform 360ms cubic-bezier(.2,.7,.2,1), z-index 0s",
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden rounded-2xl border bg-card"
        style={{
          borderColor: hovered ? "hsl(220 14% 14%)" : "hsl(40 12% 88%)",
          borderWidth: hovered ? 1.5 : 1,
          boxShadow: hovered
            ? "0 28px 60px -28px rgba(10,10,10,0.35), 0 2px 0 rgba(10,10,10,0.04)"
            : "0 1px 0 rgba(10,10,10,0.03)",
          transform: `translateY(${lift}px) rotate(${baseRotate}deg) scale(${scale}) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 420ms cubic-bezier(.2,.7,.2,1), box-shadow 300ms, border-color 200ms",
        }}
      >
        {/* sweep shine */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.55) ${tilt.sx}%, transparent 65%)`,
            mixBlendMode: "screen",
          }}
        />

        {/* top bar */}
        <div className="flex items-center justify-between px-4 pt-4">
          <span className="font-mono-tabular text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="flex h-7 w-7 items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: hovered ? "hsl(220 14% 14%)" : "hsl(40 12% 86%)",
              background: hovered ? "hsl(220 14% 14%)" : "transparent",
              color: hovered ? "white" : "hsl(220 14% 14%)",
            }}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>

        {/* art */}
        <div className="px-5 py-5">
          <div className="aspect-square w-full text-foreground/85">
            <Art />
          </div>
        </div>

        {/* meta */}
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
          <div className="h-px w-full bg-border" />
          <h3 className="mt-3 font-display text-[20px] leading-tight text-foreground">{name}</h3>
          <p className="mt-1 font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {tagline}
          </p>
        </div>

        {/* featured pick dot */}
        {featured && (
          <span className="absolute right-3 top-3 flex h-2 w-2">
            <span className="absolute inset-0 rounded-full bg-primary" />
            <span className="absolute -inset-1 rounded-full bg-primary/40 animate-ping" style={{ animationDuration: "2.4s" }} />
          </span>
        )}
      </div>
    </Link>
  );
}
