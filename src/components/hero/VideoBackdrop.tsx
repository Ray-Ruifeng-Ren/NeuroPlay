import { useEffect, useRef } from "react";
import videoAsset from "@/assets/hero-bg.mp4.asset.json";

/**
 * Cinematic looping background video.
 * - Starts visible immediately, gentle fade at the loop seam.
 */
export default function VideoBackdrop() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    let raf = 0;
    const FADE = 0.5;

    const tick = () => {
      if (v.duration && !isNaN(v.duration)) {
        const t = v.currentTime;
        const d = v.duration;
        let o = 1;
        if (t < FADE) o = Math.max(0.2, t / FADE);
        else if (t > d - FADE) o = Math.max(0.2, (d - t) / FADE);
        v.style.opacity = String(o);
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnded = () => {
      setTimeout(() => {
        v.currentTime = 0;
        void v.play().catch(() => {});
      }, 80);
    };

    v.addEventListener("ended", onEnded);
    void v.play().catch(() => {});
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("ended", onEnded);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        ref={ref}
        src={videoAsset.url}
        muted
        playsInline
        autoPlay
        loop
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 1, transition: "opacity 160ms linear" }}
      />
      {/* Very subtle warm wash — keep footage visible, lift legibility only at edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(40,30,15,0.10) 0%, rgba(20,15,8,0.05) 40%, rgba(20,15,8,0.35) 100%)",
        }}
      />
    </div>
  );
}
