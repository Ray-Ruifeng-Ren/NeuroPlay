import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  GAMES,
  getGlobalBest,
  getPlayerCount,
  getPlayerName,
  setPlayerName,
} from "@/lib/leaderboard";
import { Brain, User, ArrowRight, Users, Trophy, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const GAME_ICONS = {
  schulte: Brain,
  reaction: Zap,
  memory: Sparkles,
};

const Index = () => {
  const [name, setName] = useState("");
  useEffect(() => setName(getPlayerName()), []);
  const handleNameChange = (v: string) => {
    setName(v);
    setPlayerName(v);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Glassy header */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-lg">
        <div className="container flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold leading-none tracking-tight">NeuroPlay</h1>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                脑力竞技场
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 rounded-full border bg-card px-3 py-1.5 transition-shadow hover:shadow-md">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="设置昵称"
              className="h-6 w-28 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
              maxLength={12}
            />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-gradient-hero">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        <div className="container relative py-12 text-primary-foreground md:py-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest opacity-90">
            <Sparkles className="h-3.5 w-3.5" />
            脑力竞技广场
          </div>
          <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
            选一个游戏 · 挑战极限
          </h2>
          <p className="mt-3 max-w-xl text-sm opacity-90 md:text-base">
            注意力、反应速度、记忆力 —— 三种经典训练，全球玩家同台竞技。
          </p>
        </div>
      </section>

      {/* Games grid */}
      <main className="container py-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h3 className="text-xl font-bold">所有游戏</h3>
            <p className="text-sm text-muted-foreground">点击进入挑战</p>
          </div>
          <span className="text-xs text-muted-foreground">{Object.keys(GAMES).length} 款游戏</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.values(GAMES).map((g) => {
            const Icon = GAME_ICONS[g.id];
            const best = getGlobalBest(g.id, defaultMode(g.id));
            const players = getPlayerCount(g.id, defaultMode(g.id));
            return (
              <Link
                key={g.id}
                to={`/play/${g.id}`}
                className="group relative overflow-hidden rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={cn(
                  "absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20",
                  `bg-gradient-to-br ${g.accent}`,
                )} />
                <div className="relative">
                  <div className={cn(
                    "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl shadow-md text-white",
                    `bg-gradient-to-br ${g.accent}`,
                  )}>
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {g.tagline}
                  </div>
                  <h4 className="mt-1 text-lg font-bold">{g.name}</h4>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{g.description}</p>

                  <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {players}
                      </span>
                      {best && (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Trophy className="h-3 w-3 text-energy" />
                          <span className="font-mono-tabular font-semibold text-foreground">
                            {g.formatValue(best.value)}
                          </span>
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-2xl border bg-gradient-card p-6 text-center text-sm text-muted-foreground">
          排名当前保存在本机 · 接入 Lovable Cloud 即可解锁全球榜与好友 PK
        </div>
      </main>
    </div>
  );
};

function defaultMode(id: string) {
  if (id === "schulte") return "4x4";
  return "default";
}

export default Index;
