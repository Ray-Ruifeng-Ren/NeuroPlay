import { useState } from "react";
import { GAMES, type GameId } from "@/lib/leaderboard";
import { useI18n } from "@/lib/i18n";
import { ModuleCard } from "./ModuleCard";

const MODULES: GameId[] = ["flashmath", "gauntlet", "schulte", "nback", "reaction", "cards", "orbit"];
const FEATURED: GameId = "flashmath";

export default function CardDeck() {
  const { t } = useI18n();
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 lg:gap-2">
      {MODULES.map((id, i) => {
        const g = GAMES[id];
        const gT = t.games[id];
        // fan rotation alternates around center index 3
        const rot = (i - 3) * 1.2;
        const hovered = hover === i;
        // neighbors shift away from hovered card
        let shift = 0;
        if (hover !== null && !hovered) shift = (i < hover ? -10 : 10);
        return (
          <ModuleCard
            key={id}
            id={id}
            index={i}
            name={gT.name}
            tagline={g.tagline}
            featured={id === FEATURED}
            rotate={rot}
            hovered={hovered}
            shift={shift}
            onHover={() => setHover(i)}
            onLeave={() => setHover((h) => (h === i ? null : h))}
          />
        );
      })}
    </div>
  );
}
