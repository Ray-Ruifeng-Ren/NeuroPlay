import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addScore, getPlayerName } from "@/lib/leaderboard";
import { Zap, RotateCcw, MousePointerClick } from "lucide-react";

type Phase = "idle" | "waiting" | "ready" | "result" | "tooSoon";

export function ReactionGame({ onFinished }: { onFinished?: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ms, setMs] = useState(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const startRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const cancel = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => () => cancel(), []);

  const start = () => {
    cancel();
    setPhase("waiting");
    const delay = 1200 + Math.random() * 2800;
    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      setPhase("ready");
    }, delay);
  };

  const handleClick = () => {
    if (phase === "idle" || phase === "result" || phase === "tooSoon") {
      start();
      return;
    }
    if (phase === "waiting") {
      cancel();
      setPhase("tooSoon");
      return;
    }
    if (phase === "ready") {
      const reaction = performance.now() - startRef.current;
      setMs(reaction);
      setAttempts((a) => [...a, reaction].slice(-5));
      setPhase("result");
      const name = getPlayerName() || "玩家";
      addScore({ game: "reaction", mode: "default", name, value: reaction });
      onFinished?.();
    }
  };

  const bg =
    phase === "ready"
      ? "bg-gradient-to-br from-emerald-400 to-cyan-500"
      : phase === "tooSoon"
        ? "bg-gradient-to-br from-rose-500 to-orange-500"
        : phase === "waiting"
          ? "bg-gradient-to-br from-amber-400 to-orange-500"
          : "bg-gradient-to-br from-slate-700 to-slate-900";

  const avg = attempts.length ? attempts.reduce((a, b) => a + b, 0) / attempts.length : 0;

  return (
    <div className="flex flex-col gap-5">
      <button
        onClick={handleClick}
        className={cn(
          "relative flex h-[420px] w-full flex-col items-center justify-center rounded-2xl text-white transition-colors duration-150 select-none overflow-hidden",
          bg,
        )}
      >
        {phase === "idle" && (
          <div className="text-center animate-fade-in">
            <MousePointerClick className="mx-auto mb-3 h-12 w-12 opacity-90" />
            <div className="text-2xl font-bold">点击开始</div>
            <div className="mt-1 text-sm opacity-80">屏幕变绿后立刻点击</div>
          </div>
        )}
        {phase === "waiting" && (
          <div className="text-center animate-fade-in">
            <div className="text-2xl font-bold">等待...</div>
            <div className="mt-1 text-sm opacity-80">不要抢跑</div>
          </div>
        )}
        {phase === "ready" && (
          <div className="text-center animate-pop-in">
            <Zap className="mx-auto mb-2 h-16 w-16" strokeWidth={2.5} />
            <div className="text-3xl font-bold">现在！</div>
          </div>
        )}
        {phase === "result" && (
          <div className="text-center animate-pop-in">
            <div className="text-xs uppercase tracking-widest opacity-80">反应时间</div>
            <div className="font-mono-tabular text-7xl font-bold leading-none my-2">
              {Math.round(ms)}
              <span className="text-2xl opacity-70"> ms</span>
            </div>
            <div className="mt-2 text-sm opacity-90">点击再玩一次</div>
          </div>
        )}
        {phase === "tooSoon" && (
          <div className="text-center animate-pop-in">
            <div className="text-2xl font-bold">抢跑了 😅</div>
            <div className="mt-1 text-sm opacity-90">点击重新开始</div>
          </div>
        )}
      </button>

      {attempts.length > 0 && (
        <div className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">最近 5 次</span>
            <span className="text-xs text-muted-foreground">
              平均 <span className="font-mono-tabular font-bold text-foreground">{Math.round(avg)} ms</span>
            </span>
          </div>
          <div className="flex gap-1.5">
            {attempts.map((a, i) => (
              <div
                key={i}
                className="flex-1 rounded-md bg-secondary py-2 text-center font-mono-tabular text-sm font-semibold"
              >
                {Math.round(a)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground">
        优秀: &lt; 200ms · 顶尖: &lt; 150ms
      </div>
    </div>
  );
}
