import { getVoteForPlayer, type PlanningPokerRoom } from "../../domain/planning-poker";
import { RoundHistory } from "./round-history";

type PlayersSidebarProps = {
  room: PlanningPokerRoom;
};

export function PlayersSidebar({ room }: PlayersSidebarProps) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
      <h2 className="text-2xl font-semibold">Players</h2>
      <div className="mt-5 flex flex-col gap-3">
        {room.players.map((player) => {
          const vote = getVoteForPlayer(room, player.id);

          return (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"
            >
              <div>
                <p className="font-semibold">{player.name}</p>
                <p className="text-sm text-slate-300">
                  {vote ? "Voted" : "Waiting"}
                </p>
              </div>
              <div className="flex h-12 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-950">
                {room.revealed ? vote?.value ?? "-" : vote ? "ok" : "-"}
              </div>
            </div>
          );
        })}
      </div>

      <RoundHistory room={room} />
    </aside>
  );
}
