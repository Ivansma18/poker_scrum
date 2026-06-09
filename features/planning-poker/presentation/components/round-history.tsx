import type { PlanningPokerRoom } from "../../domain/planning-poker";
import { formatHistoryDate } from "./format-history-date";

type RoundHistoryProps = {
  room: PlanningPokerRoom;
};

export function RoundHistory({ room }: RoundHistoryProps) {
  return (
    <section className="mt-4 border-t border-white/[0.06] pt-4 sm:mt-5 sm:pt-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
        Round history
      </h2>
      {room.storyHistory.length === 0 ? (
        <p className="mt-3 text-xs text-slate-600 sm:text-sm">
          Revealed rounds will appear here.
        </p>
      ) : (
        <div className="mt-3 flex max-h-[200px] flex-col gap-1.5 overflow-y-auto scrollbar-thin sm:gap-2">
          {room.storyHistory.map((entry, index) => (
            <div
              key={`${entry.storyName}-${index}`}
              className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5"
            >
              <p className="truncate text-sm font-medium text-white">{entry.storyName}</p>
              <p className="mt-0.5 text-xs text-slate-400">{entry.result}</p>
              <p className="mt-1 text-[10px] font-medium text-slate-600">
                {entry.deckName} &middot; {formatHistoryDate(entry.recordedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
