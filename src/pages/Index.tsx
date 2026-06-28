import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { GAMES, type GameId } from "@/lib/leaderboard";
import { AccountMenu } from "@/components/AccountMenu";
import { LanguageToggle, useI18n } from "@/lib/i18n";
import { ArrowRight, Sparkles } from "lucide-react";
import BrainField from "@/components/hero/BrainField";
import { ScrambleText, ScrambleIn } from "@/components/hero/ScrambleText";

const MODULES: GameId[] = ["flashmath", "gauntlet", "schulte", "nback", "reaction", "cards", "orbit"];
const FEATURED: GameId = "flashmath";

const Index = () => {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [announceHover, setAnnounceHover] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-foreground text-background">
      {/* ambient atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 35%, hsl(var(--primary) / 0.18) 0%, transparent 60%), radial-gradient(50% 45% at 20% 80%, hsl(var(--primary) / 0.10) 0%, transparent 70%), linear-gradient(180deg, hsl(160 30% 4%) 0%, hsl(160 24% 6%) 100%)",
        }}
      />
      {/* faint topographic noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.04] mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, hsl(var(--background)) 0.5px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      {/* Announcement bar */}
      <div className="relative z-30 border-b border-background/10 bg-background/[0.02] backdrop-blur-sm">
        <div
          className="container flex items-center justify-center gap-3 py-2 text-center text-[11px] tracking-wide md:text-xs"
          onMouseEnter={() => setAnnounceHover(true)}
          onMouseLeave={() => setAnnounceHover(false)}
        >
          <span className="relative hidden h-1.5 w-1.5 md:inline-block">
            <span className="absolute inset-0 rounded-full bg-primary" />
            <span className="absolute -inset-1 rounded-full bg-primary/40 animate-ping" style={{ animationDuration: "2.4s" }} />
          </span>
          <ScrambleText text={t.coauthor} isHovered={announceHover} className="font-medium text-background/85" />
          <span className="hidden text-background/40 md:inline">·</span>
          <span className="hidden font-mono-tabular uppercase tracking-[0.22em] text-background/55 md:inline">
            {t.coauthor_sub}
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="relative z-30">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-sm font-semibold">S</div>
            <div>
              <div className="text-sm font-semibold leading-none">Super Brain Lab</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-background/55">{t.brand_sub}</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <AccountMenu />
          </div>
        </div>
      </header>

      {/* HERO + MODULES single screen */}
      <main className="relative z-10">
        <section className="container relative grid items-center gap-10 pt-10 pb-6 md:grid-cols-[1.05fr_1fr] md:pt-14">
          {/* Left: hero text */}
          <div className="relative z-10">
            <div
              className={`mb-5 inline-flex items-center gap-2 rounded-full border border-background/15 bg-background/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-background/70 backdrop-blur transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
            >
              <Sparkles className="h-3 w-3 text-primary" /> {t.lab_tag}
            </div>
            <h1 className="font-display leading-[0.96] tracking-tight text-5xl md:text-[5.2rem]">
              <ScrambleIn text={t.hero_h1_a} trigger={mounted} className="block" />
              <em className="not-italic">
                <ScrambleIn text={t.hero_h1_b} trigger={mounted} delay={350} className="block text-primary" />
              </em>
            </h1>
            <p
              className={`mt-6 max-w-prose text-[15px] leading-relaxed text-background/65 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
              style={{ transitionDelay: "700ms" }}
            >
              {t.hero_desc}
            </p>
          </div>

          {/* Right: brain — absolutely positioned to overflow nicely on desktop */}
          <div className="relative h-[360px] md:h-[460px]">
            <div className="absolute -inset-y-12 -right-10 left-0 md:-right-20">
              <BrainField className="h-full w-full" />
            </div>
            {/* hemisphere caption ticks */}
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-between font-mono-tabular text-[10px] uppercase tracking-[0.25em] text-background/40">
              <span>L · 50.3%</span>
              <span>R · 49.7%</span>
            </div>
          </div>
        </section>

        {/* MODULES — 7 in one row on lg, single screen */}
        <section className="container relative pb-10">
          <div className="mb-3 flex items-center gap-4">
            <span className="font-mono-tabular text-[10px] uppercase tracking-[0.28em] text-background/60">
              MODULES · 07
            </span>
            <div className="h-px flex-1 bg-background/15" />
            <span className="font-mono-tabular text-[10px] uppercase tracking-[0.28em] text-background/45">
              {t.modules_meta}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
            {MODULES.map((id, i) => {
              const g = GAMES[id];
              const gT = t.games[id];
              const isFeatured = id === FEATURED;
              return (
                <Link
                  key={id}
                  to={`/play/${id}`}
                  className={`group relative flex h-[180px] flex-col justify-between rounded-lg border p-3.5 transition-all duration-300
                    ${isFeatured
                      ? "border-primary/50 bg-primary/[0.06] shadow-[0_0_40px_-12px_hsl(var(--primary)/0.55)]"
                      : "border-background/12 bg-background/[0.03] hover:border-primary/35 hover:bg-background/[0.06]"}
                  `}
                  style={{
                    animation: mounted ? `fade-in 0.6s ease-out ${i * 70 + 500}ms both` : undefined,
                  }}
                >
                  {/* top: index + arrow */}
                  <div className="flex items-start justify-between">
                    <span className="font-mono-tabular text-[10px] uppercase tracking-[0.22em] text-background/55">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-background/40 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>

                  {/* middle: name */}
                  <div>
                    <h3 className="font-display text-[15px] leading-tight text-background">{gT.name}</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-background/45">{g.tagline}</p>
                  </div>

                  {/* bottom: hover progress line */}
                  <div className="relative h-px w-full overflow-hidden bg-background/10">
                    <span className="absolute inset-y-0 left-0 w-0 bg-primary transition-all duration-500 group-hover:w-full" />
                  </div>

                  {isFeatured && (
                    <span className="absolute -top-1.5 right-3 rounded-sm bg-primary px-1.5 py-0.5 font-mono-tabular text-[8px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
                      {t.today_pick}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* footer line */}
          <div className="mt-8 flex items-center justify-between border-t border-background/10 pt-4 font-mono-tabular text-[10px] uppercase tracking-[0.22em] text-background/45">
            <span>{t.footer}</span>
            <span>SBL · v2026.06</span>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
