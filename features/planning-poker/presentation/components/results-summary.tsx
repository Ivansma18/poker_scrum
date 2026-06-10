import { motion } from "motion/react";
import type { RevealedVoteSummary } from "../../domain/planning-poker";
import { slideUp, staggerContainer, staggerItem } from "../animation";

type ResultsSummaryProps = {
  voteSummary: RevealedVoteSummary | null;
};

export function ResultsSummary({ voteSummary }: ResultsSummaryProps) {
  if (!voteSummary) {
    return null;
  }

  return (
    <motion.section
      variants={slideUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-cyan-500/10 p-4 backdrop-blur-xl sm:p-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-cyan-50 sm:text-xl">
            Results summary
          </h2>
          <p className="mt-0.5 text-xs text-cyan-200/60 sm:text-sm">
            Based on {voteSummary.voteCount} revealed vote{voteSummary.voteCount !== 1 ? "s" : ""}
          </p>
        </div>
        <span className="w-fit shrink-0 rounded-lg bg-cyan-500/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300 sm:text-xs">
          Revealed
        </span>
      </div>

      {voteSummary.voteCount === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-cyan-500/20 bg-cyan-500/5 px-4 py-6 text-center">
          <p className="text-sm text-cyan-200/60">No votes were submitted before reveal.</p>
        </div>
      ) : (
        <>
          <ResultAlerts voteSummary={voteSummary} />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3"
          >
            <motion.div variants={staggerItem}>
              <SummaryMetric
                label="Majority"
                value={voteSummary.majorityValues.join(", ")}
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <SummaryMetric label="Average" value={voteSummary.average ?? "N/A"} />
            </motion.div>
            <motion.div variants={staggerItem}>
              <SummaryMetric
                label="Dispersion"
                value={voteSummary.dispersion}
                compact
              />
            </motion.div>
          </motion.div>
        </>
      )}

      {voteSummary.nonNumericValues.length > 0 ? (
        <p className="mt-3 text-[10px] text-cyan-200/50 sm:text-xs">
          Non-numeric votes excluded:{" "}
          {voteSummary.nonNumericValues.join(", ")}
        </p>
      ) : null}
    </motion.section>
  );
}

function ResultAlerts({ voteSummary }: { voteSummary: RevealedVoteSummary }) {
  if (!voteSummary.hasMajorityTie && !voteSummary.hasHighDispersion) {
    return null;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="mt-4 grid gap-2 sm:gap-3"
      role="status"
      aria-live="polite"
    >
      {voteSummary.hasMajorityTie ? (
        <motion.div variants={staggerItem} className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-amber-300">Tie detected</p>
          <p className="mt-1 text-xs text-amber-200/70 sm:text-sm">
            Values tied:{" "}
            {voteSummary.majorityValues.join(", ")}. Discuss before deciding.
          </p>
        </motion.div>
      ) : null}
      {voteSummary.hasHighDispersion ? (
        <motion.div variants={staggerItem} className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-rose-300">High dispersion</p>
          <p className="mt-1 text-xs text-rose-200/70 sm:text-sm">
            {voteSummary.highDispersionReason}
          </p>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function SummaryMetric({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string | number;
  compact?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 sm:p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:text-xs">
        {label}
      </p>
      <p className={`mt-1.5 font-bold text-white sm:mt-2 ${compact ? "text-base sm:text-lg" : "text-lg sm:text-2xl"}`}>
        {value}
      </p>
    </div>
  );
}
