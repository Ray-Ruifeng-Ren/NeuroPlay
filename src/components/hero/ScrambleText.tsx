import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Hover-to-decode scramble. Locks once revealed until pointer leaves. */
export function ScrambleText({ text, isHovered, className }: { text: string; isHovered: boolean; className?: string }) {
  const [out, setOut] = useState(text);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isHovered) { setOut(text); return; }
    let frame = 0;
    const total = text.length * 4 + 4;
    const tick = () => {
      const next = text.split("").map((ch, i) => {
        if (ch === " ") return " ";
        const start = i * 4;
        if (frame >= start + 4) return ch;
        if (frame < start) return CHARS[Math.floor(Math.random() * CHARS.length)];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      setOut(next);
      frame++;
      if (frame <= total) rafRef.current = window.setTimeout(tick, 25) as unknown as number;
    };
    tick();
    return () => { if (rafRef.current) clearTimeout(rafRef.current); };
  }, [isHovered, text]);

  return <span className={className}>{out}</span>;
}

/** One-shot scramble-in animation triggered by `trigger`. Honors reduced motion. */
export function ScrambleIn({ text, trigger, delay = 0, className }: { text: string; trigger: boolean; delay?: number; className?: string }) {
  const [out, setOut] = useState(() => text.replace(/\S/g, "\u00A0"));

  useEffect(() => {
    if (!trigger) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setOut(text); return; }
    let start = 0;
    let raf = 0;
    const duration = 900;
    const startTime = performance.now() + delay;
    const step = (now: number) => {
      if (now < startTime) { raf = requestAnimationFrame(step); return; }
      if (!start) start = now;
      const p = Math.min(1, (now - startTime) / duration);
      const len = text.length;
      const reveal = Math.floor(p * len);
      const next = text.split("").map((ch, i) => {
        if (ch === " ") return " ";
        if (i < reveal) return ch;
        const localP = (p * len) - i;
        if (localP < 0) return "\u00A0";
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join("");
      setOut(next);
      if (p < 1) raf = requestAnimationFrame(step);
      else setOut(text);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, text, delay]);

  return <span className={className} aria-label={text}>{out}</span>;
}
