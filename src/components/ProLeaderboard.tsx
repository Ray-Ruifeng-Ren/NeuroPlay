import { useEffect, useMemo, useState } from "react";
import {
  GAMES,
  type GameId,
  type Period,
  formatRelative,
  getLeaderboard,
  getMyBest,
  getMyHistory,
  getPlayerName,
} from "@/lib/leaderboard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Crown, Medal, Trophy, TrendingUp, TrendingDown, Sparkles, History } from "lucide-react";

type Props = {
  game: GameId;
  mode: string;
  refreshKey: number;
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-gold shadow-md">
        <Crown className="h-4 w-4 text-white" strokeWidth={2.5} />
      </div>
    );
  if (rank === 2)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 shadow-sm">
        <Medal className="h-4 w-4 text-white" strokeWidth={2.5} />
      </div>
    );
  if (rank === 3)
    return (
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-600 shadow-sm">
        <Trophy className="h-4 w-4 text-white" strokeWidth={2.5} />
      </div>
    );
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-secondary text-xs font-bold text-muted-foreground font-mono-tabular">
      {rank}
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  // hash to color
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return (
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
      style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 55%), hsl(${(hue + 40) % 360} 70% 50%))` }}
    >
      {initial}
    </div>
  );
}

export function ProLeaderboard({ game, mode, refreshKey }: Props) {
  const meta = GAMES[game];
  const [period, setPeriod] = useState<Period>("all");
  const playerName = getPlayerName();

  const board = useMemo(
    () => getLeaderboard(game, mode, period, 20),
    [game, mode, period, refreshKey],
  );
  const myBestAll = useMemo(() => getMyBest(game, mode, "all"), [game, mode, refreshKey]);
  const myBestWeek = useMemo(() => getMyBest(game, mode, "weekly"), [game, mode, refreshKey]);
  const myHistory = useMemo(() => getMyHistory(game, mode, 5), [game, mode, refreshKey]);

  const myRankInBoard = playerName
    ? board.find((s) => s.name === playerName)?.rank ?? null
    : null;

  return (
    <div className="space-y-4">
      {/* My Best Card */}
      <div className="overflow-hidden rounded-2xl border bg-gradient-card shadow-md">
        <div className="bg-gradient-primary px-5 py-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground/90">
            <Sparkles className="h-3 w-3" />
            我的最佳
          </div>
        </div>
        <div className="p-5">
          {myBestAll ? (
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground">{meta.valueLabel}</div>
                <div className="font-mono-tabular text-3xl font-bold leading-tight text-gradient">
                  {meta.formatValue(myBestAll.value)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {formatRelative(myBestAll.date)}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                {myRankInBoard && (
                  <div className="flex items-center gap-1 rounded-full bg-energy/15 px-2.5 py-1 text-xs font-bold text-foreground">
                    <Crown className="h-3 w-3 text-energy" />
                    榜单 #{myRankInBoard}
                  </div>
                )}
                {myBestWeek && myBestAll && (
                  <WeekDelta
                    direction={meta.direction}
                    weekValue={myBestWeek.value}
                    allValue={myBestAll.value}
                    format={meta.formatValue}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-sm text-muted-foreground">
              {playerName ? "完成一局即可创建你的最佳记录" : "在右上角设置昵称后开始记录"}
            </div>
          )}

          {myHistory.length > 1 && (
            <details className="mt-4 border-t pt-3 group">
              <summary className="flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
                <History className="h-3 w-3" />
                最近 {myHistory.length} 局
                <span className="ml-auto opacity-60 group-open:rotate-180 transition-transform">⌄</span>
              </summary>
              <ul className="mt-2 space-y-1">
                {myHistory.map((h) => (
                  <li key={h.id} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{formatRelative(h.date)}</span>
                    <span className="font-mono-tabular font-semibold">
                      {meta.formatValue(h.value)}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="overflow-hidden rounded-2xl border bg-card shadow-md">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-energy" />
            <h3 className="font-bold">排行榜</h3>
          </div>
          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {mode}
          </span>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
          <div className="px-5 pt-3">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">总榜</TabsTrigger>
              <TabsTrigger value="weekly">本周</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value={period} className="m-0 p-2">
            {board.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Trophy className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {period === "weekly" ? "本周还没有记录" : "暂无排名"}
                </p>
                <p className="text-xs text-muted-foreground/70">第一名虚位以待 🚀</p>
              </div>
            ) : (
              <ol className="space-y-0.5">
                {board.map((s) => {
                  const isMe = s.name === playerName;
                  return (
                    <li
                      key={s.id}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2 transition-all",
                        isMe
                          ? "bg-primary/10 ring-1 ring-primary/30"
                          : "hover:bg-secondary/60",
                      )}
                    >
                      <RankBadge rank={s.rank} />
                      <Avatar name={s.name} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-semibold">{s.name}</span>
                          {isMe && (
                            <span className="rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">
                              你
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {formatRelative(s.date)}
                        </div>
                      </div>
                      <div className="font-mono-tabular text-sm font-bold tabular-nums">
                        {meta.formatValue(s.value)}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function WeekDelta({
  direction,
  weekValue,
  allValue,
  format,
}: {
  direction: "lower" | "higher";
  weekValue: number;
  allValue: number;
  format: (v: number) => string;
}) {
  // Compare weekly best vs all-time best
  const isImprovement = direction === "lower" ? weekValue <= allValue : weekValue >= allValue;
  const diff = Math.abs(weekValue - allValue);
  if (diff === 0) {
    return (
      <div className="text-[10px] text-muted-foreground">本周已达个人最佳</div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center gap-1 text-[10px] font-semibold",
        isImprovement ? "text-success" : "text-muted-foreground",
      )}
    >
      {isImprovement ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
      本周 {format(weekValue)}
    </div>
  );
}
