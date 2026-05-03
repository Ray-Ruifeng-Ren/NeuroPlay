import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { addScore, getPlayerName } from "@/lib/leaderboard";
import { Brain, Eye, Keyboard, RotateCcw } from "lucide-react";

type Phase = "idle" | "show" | "input" | "won" | "lost";

function genDigits(level: number) {
  const len = level + 2; // start at 3 digits
  let s = "";
  for (let i = 0; i < len; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export function MemoryGame({ onFinished }: { onFinished?: () => void }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [digits, setDigits] = useState("");
  const [input, setInput] = useState("");

  const start = (l = 1) => {
    setLevel(l);
    const d = genDigits(l);
    setDigits(d);
    setInput("");
    setPhase("show");
    const showMs = 1200 + l * 400;
    setTimeout(() => setPhase("input"), showMs);
  };

  const submit = () => {
    if (input === digits) {
      setPhase("won");
      setTimeout(() => start(level + 1), 900);
    } else {
      setPhase("lost");
      const name = getPlayerName() || "玩家";
      addScore({ game: "memory", mode: "default", name, value: level });
      onFinished?.();
    }
  };

  const reset = () => {
    setPhase("idle");
    setLevel(1);
    setDigits("");
    setInput("");
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between rounded-xl border bg-card p-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">当前等级</div>
          <div className="font-mono-tabular text-3xl font-bold text-gradient">Lv. {level}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">数字长度</div>
          <div className="font-mono-tabular text-3xl font-bold">{level + 2}</div>
        </div>
      </div>

      <div className="relative flex h-[280px] w-full items-center justify-center rounded-2xl border bg-gradient-card overflow-hidden">
        {phase === "idle" && (
          <div className="text-center animate-fade-in">
            <Brain className="mx-auto mb-3 h-12 w-12 text-primary" />
            <div className="text-xl font-bold">数字记忆挑战</div>
            <div className="mt-1 text-sm text-muted-foreground max-w-xs">
              记住屏幕上的数字，原样输入即可进入下一关
            </div>
            <Button onClick={() => start(1)} className="mt-4 bg-gradient-primary hover:opacity-90">
              开始挑战
            </Button>
          </div>
        )}
        {phase === "show" && (
          <div className="text-center animate-pop-in">
            <Eye className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
            <div className="font-mono-tabular text-6xl font-bold tracking-[0.15em] text-gradient">
              {digits}
            </div>
          </div>
        )}
        {phase === "input" && (
          <div className="w-full max-w-xs px-6 text-center animate-fade-in">
            <Keyboard className="mx-auto mb-3 h-5 w-5 text-muted-foreground" />
            <div className="text-sm text-muted-foreground mb-3">输入你刚才看到的数字</div>
            <Input
              autoFocus
              inputMode="numeric"
              value={input}
              onChange={(e) => setInput(e.target.value.replace(/\D/g, ""))}
              onKeyDown={(e) => e.key === "Enter" && input.length > 0 && submit()}
              className="text-center font-mono-tabular text-2xl h-14"
              maxLength={digits.length}
            />
            <Button
              onClick={submit}
              disabled={input.length === 0}
              className="mt-3 w-full bg-gradient-primary"
            >
              确认
            </Button>
          </div>
        )}
        {phase === "won" && (
          <div className="text-center animate-pop-in text-success">
            <div className="text-5xl">✓</div>
            <div className="mt-2 text-xl font-bold">通过！</div>
          </div>
        )}
        {phase === "lost" && (
          <div className="text-center animate-pop-in">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">挑战结束</div>
            <div className="my-1 font-mono-tabular text-5xl font-bold text-gradient">Lv. {level}</div>
            <div className="text-sm text-muted-foreground">正确答案: <span className="font-mono-tabular font-bold text-foreground">{digits}</span></div>
            <div className="mt-2 text-xs text-muted-foreground">你的输入: {input || "(无)"}</div>
            <Button onClick={reset} className="mt-3 bg-gradient-primary">
              <RotateCcw className="mr-2 h-4 w-4" /> 再挑战一次
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
