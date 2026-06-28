import { useEffect, useRef, useState } from "react";

/**
 * Anatomical brain — SVG side-view silhouette with breathing scale and a
 * Canvas2D overlay rendering ~60 emerald synapse particles that wander
 * inside the brain mask. Particles run an "Aethera-style" 8s fade cycle.
 */
export default function AnatomicalBrain({ size = 360 }: { size?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cvsRef = useRef<HTMLCanvasElement>(null);
  const [hemi, setHemi] = useState<"L" | "R" | null>(null);

  useEffect(() => {
    const cvs = cvsRef.current;
    const wrap = wrapRef.current;
    if (!cvs || !wrap) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = size, H = size;
    cvs.width = W * dpr; cvs.height = H * dpr;
    cvs.style.width = `${W}px`; cvs.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    // Approximate brain mask via ellipse with notch (matches the SVG silhouette)
    const cx = W / 2, cy = H / 2 - 6;
    const rx = W * 0.36, ry = H * 0.30;
    const insideMask = (x: number, y: number) => {
      const nx = (x - cx) / rx;
      const ny = (y - cy) / ry;
      return nx * nx + ny * ny < 1;
    };

    type P = { x: number; y: number; vx: number; vy: number; life: number };
    const N = 60;
    const ps: P[] = [];
    const spawn = (): P => {
      while (true) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        if (insideMask(x, y)) {
          return {
            x, y,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            life: Math.random(),
          };
        }
      }
    };
    for (let i = 0; i < N; i++) ps.push(spawn());

    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);

      // global fade cycle (8s loop: 0.5s in, hold, 0.5s out)
      const phase = (t % 8) / 8;
      let global = 1;
      if (phase < 0.0625) global = phase / 0.0625;          // 0–0.5s in
      else if (phase > 0.9375) global = (1 - phase) / 0.0625; // last 0.5s out

      // synapse links — pick a few random pairs each frame
      ctx.strokeStyle = `rgba(4, 120, 87, ${0.18 * global})`;
      ctx.lineWidth = 0.7;
      for (let k = 0; k < 8; k++) {
        const a = ps[(Math.floor(t * 6) + k * 7) % N];
        const b = ps[(Math.floor(t * 6) + k * 13 + 3) % N];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < 70) {
          ctx.globalAlpha = (1 - d / 70) * global * 0.9;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      for (const p of ps) {
        // tiny wander
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;
        const sp = Math.hypot(p.vx, p.vy);
        if (sp > 0.5) { p.vx = p.vx / sp * 0.5; p.vy = p.vy / sp * 0.5; }
        p.x += p.vx; p.y += p.vy;
        // bounce inside the mask
        if (!insideMask(p.x, p.y)) {
          // reflect toward center
          const dx = cx - p.x, dy = cy - p.y;
          const n = Math.hypot(dx, dy);
          p.vx = (dx / n) * 0.4;
          p.vy = (dy / n) * 0.4;
          p.x += p.vx * 2;
          p.y += p.vy * 2;
        }
        p.life += 0.01;
        const twinkle = 0.5 + 0.5 * Math.sin(p.life * 6 + p.x * 0.1);
        const alpha = twinkle * global;

        // glow
        const r = 1.6;
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 5);
        grd.addColorStop(0, `rgba(16, 185, 129, ${0.95 * alpha})`);
        grd.addColorStop(1, `rgba(16, 185, 129, 0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 0.9, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(tick);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [size]);

  const handleMove = (e: React.MouseEvent) => {
    const r = wrapRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = e.clientX - r.left - r.width / 2;
    setHemi(x < 0 ? "L" : "R");
  };

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto"
      style={{ width: size, height: size }}
      onMouseMove={handleMove}
      onMouseLeave={() => setHemi(null)}
    >
      {/* outer soft halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, hsl(160 70% 45% / 0.10), transparent 70%)",
        }}
      />
      {/* breathing brain SVG */}
      <div className="absolute inset-0 animate-brain-breath">
        <BrainSVG />
      </div>
      {/* particle overlay */}
      <canvas ref={cvsRef} className="absolute inset-0 pointer-events-none" aria-hidden />
      {/* hemisphere tokens */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-4 flex items-center justify-between px-6 font-mono-tabular text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
        <span className={`transition-opacity duration-300 ${hemi === "L" ? "opacity-100 text-primary" : "opacity-60"}`}>L · Logic</span>
        <span className={`transition-opacity duration-300 ${hemi === "R" ? "opacity-100 text-primary" : "opacity-60"}`}>R · Pattern</span>
      </div>
    </div>
  );
}

/**
 * Anatomical side-view brain silhouette. Stroked paths only. The shape
 * intentionally reads as a brain at small sizes via:
 *   - rounded cerebral outline with frontal/parietal lobes
 *   - central + lateral sulci as inner curves
 *   - cerebellum lobe + brainstem at the lower back
 */
function BrainSVG() {
  return (
    <svg viewBox="0 0 360 360" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="sbl-brain-fill" cx="50%" cy="48%" r="55%">
          <stop offset="0%" stopColor="hsl(40, 30%, 99%)" />
          <stop offset="70%" stopColor="hsl(40, 28%, 95%)" />
          <stop offset="100%" stopColor="hsl(40, 25%, 92%)" />
        </radialGradient>
      </defs>
      {/* cerebral outline */}
      <path
        d="M70,180
           C70,118 110,72 178,68
           C242,64 290,108 296,168
           C300,210 282,238 264,254
           C258,260 256,266 258,272
           L262,286
           C264,294 258,300 250,300
           L228,300
           C218,300 212,294 210,286
           C206,272 192,266 178,270
           C162,274 148,272 138,266
           L120,276
           C112,282 100,282 92,274
           L78,260
           C72,254 70,246 70,238 Z"
        fill="url(#sbl-brain-fill)"
        stroke="hsl(220 14% 14% / 0.85)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      {/* central sulcus (Rolandic fissure) */}
      <path
        d="M188,80 C194,120 200,160 196,210"
        fill="none"
        stroke="hsl(220 14% 14% / 0.45)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* lateral sulcus (Sylvian fissure) */}
      <path
        d="M118,194 C160,184 210,194 256,188"
        fill="none"
        stroke="hsl(220 14% 14% / 0.45)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* secondary sulci — gentle curves to suggest gyri */}
      <path d="M100,150 C140,134 180,140 214,128" fill="none" stroke="hsl(220 14% 14% / 0.28)" strokeWidth="0.8" />
      <path d="M120,116 C160,108 198,110 236,118" fill="none" stroke="hsl(220 14% 14% / 0.28)" strokeWidth="0.8" />
      <path d="M226,98  C250,104 270,124 282,150" fill="none" stroke="hsl(220 14% 14% / 0.28)" strokeWidth="0.8" />
      <path d="M132,230 C170,220 210,224 250,218" fill="none" stroke="hsl(220 14% 14% / 0.28)" strokeWidth="0.8" />
      <path d="M156,250 C188,244 220,246 244,238" fill="none" stroke="hsl(220 14% 14% / 0.28)" strokeWidth="0.8" />
      {/* cerebellum */}
      <path
        d="M240,254
           C260,254 274,266 272,282
           C270,294 256,300 244,298
           C234,296 228,288 230,278
           Z"
        fill="hsl(40 25% 94%)"
        stroke="hsl(220 14% 14% / 0.7)"
        strokeWidth="1.1"
      />
      <path d="M244,262 C252,268 256,276 254,286" fill="none" stroke="hsl(220 14% 14% / 0.4)" strokeWidth="0.8" />
      {/* brainstem */}
      <path
        d="M236,294
           C236,304 240,314 246,320
           C250,324 252,328 250,332
           L246,338
           C244,342 240,342 238,338
           L234,330
           C232,322 230,310 232,300 Z"
        fill="hsl(40 25% 94%)"
        stroke="hsl(220 14% 14% / 0.7)"
        strokeWidth="1.1"
      />
    </svg>
  );
}
