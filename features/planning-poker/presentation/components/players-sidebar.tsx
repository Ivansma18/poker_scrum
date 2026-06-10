import { motion } from "motion/react";
import { getVoteForPlayer, type PlanningPokerRoom } from "../../domain/planning-poker";
import { staggerContainer, staggerItem } from "../animation";
import { RoundHistory } from "./round-history";

type PlayersSidebarProps = {
  room: PlanningPokerRoom;
};

export function PlayersSidebar({ room }: PlayersSidebarProps) {
  const spectators = room.spectators ?? [];

  return (
    <aside className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold sm:text-xl">Players</h2>
        <span className="rounded-lg bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-slate-400">
          {room.players.length}
        </span>
      </div>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mt-3 flex max-h-[300px] flex-col gap-1.5 overflow-y-auto scrollbar-thin sm:mt-4 sm:gap-2 lg:max-h-[calc(100vh-320px)]"
      >
        {room.players.map((player) => {
          const vote = getVoteForPlayer(room, player.id);

          return (
            <motion.div
              key={player.id}
              variants={staggerItem}
              className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 transition-colors hover:bg-white/[0.05] sm:px-4 sm:py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{player.name}</p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                  {vote ? "Voted" : "Waiting"}
                </p>
              </div>
              <div
                className={`ml-2 flex h-9 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold sm:ml-3 sm:h-10 sm:w-10 sm:rounded-xl sm:text-sm ${
                  room.revealed && vote
                    ? "bg-cyan-500/10 text-cyan-400"
                    : vote
                      ? "bg-white/[0.08] text-white"
                      : "bg-white/[0.03] text-slate-600"
                }`}
              >
                {room.revealed ? vote?.value ?? "-" : vote ? "ok" : "-"}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <section className="mt-6 border-t border-white/[0.06] pt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">Spectators</h2>
          <span className="rounded-lg bg-white/[0.06] px-2 py-0.5 text-xs font-medium text-slate-400">
            {spectators.length}
          </span>
        </div>
        {spectators.length === 0 ? (
          <p className="mt-3 rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 text-sm text-slate-400">
            No spectators watching.
          </p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-3 flex flex-col gap-1.5 sm:gap-2"
          >
            {spectators.map((spectator) => (
              <motion.div
                key={spectator.id}
                variants={staggerItem}
                className="rounded-xl border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 sm:px-4 sm:py-3"
              >
                <p className="truncate text-sm font-medium text-white">
                  {spectator.name}
                </p>
                <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                  Watching
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <RoundHistory room={room} />
    </aside>
  );
}
