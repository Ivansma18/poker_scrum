import { motion } from "motion/react";
import type { VoteValue } from "../../domain/planning-poker";
import { staggerItem } from "../animation";

type VotingCardProps = {
  card: VoteValue;
  selected: boolean;
  disabled: boolean;
  index: number;
  onVote: (value: VoteValue) => void;
};

export function VotingCard({
  card,
  selected,
  disabled,
  onVote,
}: VotingCardProps) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => onVote(card)}
      variants={staggerItem}
      whileHover={disabled ? undefined : { y: -4, transition: { duration: 0.15 } }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      className={`group relative aspect-[3/4] min-h-16 overflow-hidden rounded-xl text-lg font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-20 sm:rounded-2xl sm:text-xl ${
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent"
        />
      )}
    </motion.button>
  );
}
