import type { PlanningPokerRoom, Vote, VoteValue } from "../../domain/planning-poker";

type VotingDeckProps = {
  room: PlanningPokerRoom;
  currentVote?: Vote;
  isSpectator: boolean;
  onVote: (value: VoteValue) => void;
};

export function VotingDeck({
  room,
  currentVote,
  isSpectator,
  onVote,
}: VotingDeckProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3 backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Choose your card</h2>
          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            {isSpectator ? "Spectator mode:" : "Your vote:"}{" "}
            <span className="font-medium text-cyan-400">
              {isSpectator ? "watching only" : currentVote?.value ?? "none"}
            </span>
          </p>
        </div>
        <span
          className={`w-fit rounded-lg px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider sm:px-3 sm:text-xs ${
            room.revealed
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-cyan-500/10 text-cyan-400"
          }`}
        >
          {room.revealed ? "Revealed" : "Voting"}
        </span>
      </div>

      {isSpectator ? (
        <p className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
          You are observing this session and cannot submit votes.
        </p>
      ) : null}

      <div className="mt-4 grid grid-cols-4 gap-2 min-[430px]:grid-cols-5 sm:grid-cols-5 sm:gap-2.5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6">
        {room.deck.values.map((card) => {
          const selected = currentVote?.value === card;

          return (
            <button
              key={card}
              type="button"
              disabled={room.revealed || isSpectator}
              onClick={() => onVote(card)}
              className={`group relative aspect-[3/4] min-h-16 overflow-hidden rounded-xl text-lg font-bold transition-all enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-20 sm:rounded-2xl sm:text-xl ${
                selected
                  ? "border-2 border-cyan-400 bg-gradient-to-b from-cyan-50 to-cyan-100 text-cyan-900 shadow-md shadow-cyan-500/20"
                  : "border border-white/[0.08] bg-white/[0.04] text-white shadow-sm hover:border-white/[0.15] hover:bg-white/[0.08]"
              }`}
            >
              <span className="relative z-10 flex items-center justify-center">
                {card === "coffee" ? (
                  <span className="text-base sm:text-lg">☕</span>
                ) : (
                  card
                )}
              </span>
              {selected && (
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
