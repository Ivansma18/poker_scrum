import type { PlanningPokerRoom, Vote, VoteValue } from "../../domain/planning-poker";

type VotingDeckProps = {
  room: PlanningPokerRoom;
  currentVote?: Vote;
  onVote: (value: VoteValue) => void;
};

export function VotingDeck({ room, currentVote, onVote }: VotingDeckProps) {
  return (
    <>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Choose your card</h2>
          <p className="text-sm text-slate-500">
            Your current vote: {currentVote?.value ?? "none"}
          </p>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {room.revealed ? "Revealed" : "Voting"}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {room.deck.values.map((card) => {
          const selected = currentVote?.value === card;

          return (
            <button
              key={card}
              type="button"
              disabled={room.revealed}
              onClick={() => onVote(card)}
              className={`aspect-[3/4] rounded-2xl border text-2xl font-bold transition enabled:hover:-translate-y-1 enabled:hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 ${
                selected
                  ? "border-cyan-400 bg-cyan-100 text-cyan-950 shadow-lg shadow-cyan-200"
                  : "border-slate-200 bg-white text-slate-900 shadow-sm"
              }`}
            >
              {card === "coffee" ? "coffee" : card}
            </button>
          );
        })}
      </div>
    </>
  );
}
