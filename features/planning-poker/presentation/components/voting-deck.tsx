import { AnimatePresence } from "motion/react";
import type { PlanningPokerRoom, Vote, VoteValue } from "../../domain/planning-poker";
import { FeedbackMessage } from "./feedback-message";
import { VotingCard } from "./voting-card";

type VotingDeckProps = {
  room: PlanningPokerRoom;
  currentVote?: Vote;
  voteConfirmation: { value: string } | null;
  isSpectator: boolean;
  onVote: (value: VoteValue) => void;
};

export function VotingDeck({
  room,
  currentVote,
  voteConfirmation,
  isSpectator,
  onVote,
}: VotingDeckProps) {
  const votingBlockedMessage = getVotingBlockedMessage(room, isSpectator);

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

      <AnimatePresence>
        {votingBlockedMessage ? (
          <div className="mt-4">
            <FeedbackMessage tone="info" message={votingBlockedMessage} />
          </div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {!votingBlockedMessage && voteConfirmation && !room.revealed ? (
          <div className="mt-4">
            <FeedbackMessage
              tone="info"
              message={`Vote recorded: ${voteConfirmation.value}`}
            />
          </div>
        ) : null}
      </AnimatePresence>

      <div className="mt-4 grid grid-cols-4 gap-2 min-[430px]:grid-cols-5 sm:grid-cols-5 sm:gap-2.5 md:grid-cols-6 lg:grid-cols-5 xl:grid-cols-6">
        {room.deck.values.map((card, index) => {
          const selected = currentVote?.value === card;

          return (
            <VotingCard
              key={card}
              card={card}
              selected={selected}
              disabled={room.revealed || isSpectator}
              index={index}
              onVote={onVote}
            />
          );
        })}
      </div>
    </div>
  );
}

function getVotingBlockedMessage(
  room: PlanningPokerRoom,
  isSpectator: boolean,
): string | null {
  if (isSpectator) {
    return "Spectators can watch the session but cannot submit votes.";
  }

  if (room.revealed) {
    return "Voting is closed because this round has already been revealed. Reset the round to vote again.";
  }

  return null;
}
