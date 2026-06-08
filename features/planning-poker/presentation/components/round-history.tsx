import type { PlanningPokerRoom } from "../../domain/planning-poker";
import { formatHistoryDate } from "./format-history-date";

type RoundHistoryProps = {
  room: PlanningPokerRoom;
};

export function RoundHistory({ room }: RoundHistoryProps) {
  return (
    <section className="mt-8 border-t border-white/10 pt-6">
      <h2 className="text-2xl font-semibold">Round history</h2>
      {room.storyHistory.length === 0 ? (
        <p className="mt-3 text-sm text-slate-300">
          Revealed rounds will appear here after you replace the story or reset.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {room.storyHistory.map((entry, index) => (
            <div
              key={`${entry.storyName}-${index}`}
              className="rounded-2xl bg-white/10 px-4 py-3"
            >
              <p className="font-semibold">{entry.storyName}</p>
              <p className="mt-1 text-sm text-slate-300">{entry.result}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                {entry.deckName} - {formatHistoryDate(entry.recordedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
