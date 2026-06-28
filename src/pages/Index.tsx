import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { AccountMenu } from "@/components/AccountMenu";
import { LanguageToggle, useI18n } from "@/lib/i18n";
import AnatomicalBrain from "@/components/hero/AnatomicalBrain";
import CardDeck from "@/components/hero/CardDeck";

const Index = () => {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="relative z-30">
        <div className="container flex items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-primary" />
            <span className="font-medium tracking-tight">Super Brain Lab</span>
            <span className="ml-2 hidden font-mono-tabular text-[10px] uppercase tracking-[0.24em] text-muted-foreground md:inline">
              {t.brand_sub}
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <AccountMenu />
            <Link
              to="/play/flashmath"
              className="ml-1 rounded-full bg-foreground px-5 py-2 text-xs font-medium text-background transition-transform hover:scale-[1.03]"
            >
              {t.start}
            </Link>
          </div>
        </div>
        <div className="container px-6"><div className="h-px w-full bg-border/70" /></div>
      </header>

      {/* HERO */}
      <main className="container px-6">
        <section className="flex flex-col items-center pt-10 pb-8 text-center md:pt-14">
          <span className="animate-fade-rise font-mono-tabular text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            {t.lab_tag}
          </span>

          <h1 className="animate-fade-rise-d1 mt-5 max-w-4xl font-display text-5xl leading-[0.98] tracking-[-0.02em] md:text-7xl">
            {t.hero_h1_a}
            <br />
            <em className="italic text-muted-foreground">{t.hero_h1_b}</em>
          </h1>

          <p className="animate-fade-rise-d2 mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
            {t.hero_desc}
          </p>

          {/* Brain */}
          <div className="animate-fade-rise-d2 mt-8">
            <AnatomicalBrain size={300} />
          </div>

          <Link
            to="/play/flashmath"
            className="animate-fade-rise-d3 mt-10 inline-flex items-center gap-2 rounded-full bg-foreground px-10 py-3.5 text-sm font-medium text-background transition-transform hover:scale-[1.03]"
          >
            {t.start} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        {/* MODULES */}
        <section className="relative pb-10 pt-2">
          <div className="mb-5 flex items-center gap-4">
            <span className="font-mono-tabular text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              MODULES · 07
            </span>
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono-tabular text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {t.modules_meta}
            </span>
          </div>
          <CardDeck />
        </section>

        {/* footer line */}
        <footer className="border-t border-border py-5 text-center">
          <p className="font-mono-tabular text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            {t.coauthor_sub}
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
