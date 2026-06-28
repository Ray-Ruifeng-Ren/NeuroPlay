import { Link } from "react-router-dom";
import { GAMES, type GameId } from "@/lib/leaderboard";
import { AccountMenu } from "@/components/AccountMenu";
import { LanguageToggle, useI18n } from "@/lib/i18n";
import { ArrowRight, Mic, Trophy, Sparkles } from "lucide-react";
import { CinematicAbacus } from "@/components/CinematicAbacus";

const FEATURED: GameId = "flashmath";
const SECONDARY: GameId[] = ["gauntlet", "schulte", "reaction", "nback", "cards", "orbit"];

const Index = () => {
  const { t } = useI18n();
  const featured = GAMES[FEATURED];
  const fT = t.games[FEATURED];

  return (
    <div className="min-h-screen bg-background">
      {/* ============== CINEMATIC HERO ============== */}
      <section className="relative isolate overflow-hidden bg-[#0c0703] text-[#f4ead8]">
        {/* Warm chiaroscuro wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hero-glow"
          style={{
            background:
              "radial-gradient(60% 70% at 75% 40%, hsl(38 80% 50% / 0.28) 0%, transparent 65%), radial-gradient(50% 60% at 10% 90%, hsl(160 60% 35% / 0.18) 0%, transparent 70%)",
          }}
        />
        {/* Faint film grain via SVG noise */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
          }}
        />

        {/* Announcement strip */}
        <div className="relative border-b border-[#f5c66b]/15">
          <div className="container flex items-center justify-center gap-3 py-2 text-center text-[11px] tracking-wide md:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5c66b] animate-pulse" />
            <span className="font-medium text-[#f4ead8]/90">{t.coauthor}</span>
            <span className="hidden text-[#f4ead8]/30 md:inline">·</span>
            <span className="hidden font-mono-tabular uppercase tracking-[0.2em] text-[#f4ead8]/45 md:inline">
              {t.coauthor_sub}
            </span>
          </div>
        </div>

        {/* Top bar */}
        <header className="relative">
          <div className="container flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5c66b] text-[#1c0f06] font-display text-sm font-semibold">
                N
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">NeuroPlay</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-[#f4ead8]/55">{t.brand_sub}</div>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <AccountMenu />
            </div>
          </div>
        </header>

        {/* Hero body */}
        <div className="container relative grid items-center gap-10 pb-20 pt-10 md:grid-cols-[1fr_1.05fr] md:gap-6 md:pb-28 md:pt-16">
          <div className="hero-rise">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#f5c66b]/25 bg-[#f5c66b]/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f5c66b]">
              <Sparkles className="h-3 w-3" /> {t.today_pick}
            </div>
            <h1 className="font-display leading-[0.95] tracking-tight text-5xl md:text-7xl">
              {t.hero_h1_a}
              <br />
              <em className="not-italic text-[#f5c66b]">{t.hero_h1_b}</em>
            </h1>
            <p className="mt-6 max-w-md text-sm text-[#f4ead8]/65 md:text-base">
              {t.hero_desc}
            </p>
            <div className="mt-8 flex items-center gap-5">
              <Link
                to={`/play/${featured.id}`}
                className="group inline-flex items-center gap-2 rounded-md bg-[#f5c66b] px-5 py-2.5 text-sm font-semibold text-[#1c0f06] shadow-[0_10px_30px_-10px_rgba(245,198,107,0.6)] transition-transform hover:-translate-y-0.5"
              >
                {t.start} {fT.name}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to={`/play/nback`}
                className="text-sm font-medium text-[#f4ead8]/70 transition-colors hover:text-[#f5c66b]"
              >
                {t.browse_all}
              </Link>
            </div>
          </div>

          {/* Animated abacus */}
          <div className="hero-rise relative mx-auto w-full max-w-[560px]" style={{ animationDelay: ".15s" }}>
            <CinematicAbacus className="h-[320px] w-full md:h-[420px]" />
          </div>
        </div>

        {/* Bottom soft fade into light background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
          style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--background)))" }}
        />
      </section>

      <main className="container max-w-5xl py-12 md:py-16">
        {/* Modules */}
        <section>
          <div className="mb-5 flex items-baseline justify-between border-b border-border pb-2.5">
            <h3 className="font-display text-xl">{t.matrix}</h3>
            <span className="font-mono-tabular text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              {SECONDARY.length + 1} {t.modules}
            </span>
          </div>

          {/* Featured tile */}
          <Link
            to={`/play/${featured.id}`}
            className="group mb-3 block rounded-md border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
          >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              <span>{featured.tagline}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <h2 className="mt-2 font-display text-2xl">{fT.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{fT.desc}</p>
            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
              <Tag><Mic className="h-2.5 w-2.5" /> {t.tag_voice}</Tag>
              <Tag>{t.tag_digits}</Tag>
              <Tag>{t.tag_speed}</Tag>
              <Tag>{t.tag_pro}</Tag>
            </div>
          </Link>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SECONDARY.map((id) => {
              const g = GAMES[id];
              const gT = t.games[id];
              return (
                <Link
                  key={id}
                  to={`/play/${id}`}
                  className="group rounded-md border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-accent font-mono-tabular text-xs font-semibold text-primary">
                      {g.initial}
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                  </div>
                  <h4 className="mt-3 font-display text-lg">{gT.name}</h4>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{g.tagline}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{gT.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Values */}
        <section className="mt-16 grid gap-6 border-t border-border pt-10 md:grid-cols-3">
          <Value title={t.cloud_lb} body={t.cloud_lb_d} icon={<Trophy className="h-3.5 w-3.5 text-primary" />} />
          <Value title={t.voice} body={t.voice_d} icon={<Mic className="h-3.5 w-3.5 text-primary" />} />
          <Value title={t.sci} body={t.sci_d} icon={<Sparkles className="h-3.5 w-3.5 text-primary" />} />
        </section>

        <footer className="mt-16 border-t border-border pt-6 text-center text-[11px] text-muted-foreground">
          {t.footer}
        </footer>
      </main>
    </div>
  );
};

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-sm border border-border bg-background px-1.5 py-0.5 font-medium text-muted-foreground">
      {children}
    </span>
  );
}
function Value({ title, body, icon }: { title: string; body: string; icon: React.ReactNode }) {
  return (
    <div>
      <div className="flex h-7 w-7 items-center justify-center rounded-sm border border-border bg-card">{icon}</div>
      <h4 className="mt-3 font-display text-base">{title}</h4>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

export default Index;
