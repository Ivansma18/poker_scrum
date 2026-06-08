import type { RevealedVoteSummary } from "../../domain/planning-poker";

type ResultsSummaryProps = {
  voteSummary: RevealedVoteSummary | null;
};

export function ResultsSummary({ voteSummary }: ResultsSummaryProps) {
  if (!voteSummary) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-cyan-950">
            Results summary
          </h2>
          <p className="mt-1 text-sm text-cyan-900/70">
            Based on {voteSummary.voteCount} revealed votes.
          </p>
        </div>
        <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
          Revealed
        </span>
      </div>

      {voteSummary.voteCount === 0 ? (
        <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
          No votes were submitted before reveal.
        </p>
      ) : (
        <>
          <ResultAlerts voteSummary={voteSummary} />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SummaryMetric
              label="Majority"
              value={voteSummary.majorityValues.join(", ")}
            />
            <SummaryMetric label="Average" value={voteSummary.average ?? "N/A"} />
            <SummaryMetric
              label="Dispersion"
              value={voteSummary.dispersion}
              compact
            />
          </div>
        </>
      )}

      {voteSummary.nonNumericValues.length > 0 ? (
        <p className="mt-3 text-sm text-cyan-900/70">
          Non-numeric votes excluded from average:{" "}
          {voteSummary.nonNumericValues.join(", ")}
        </p>
      ) : null}
    </section>
  );
}

function ResultAlerts({ voteSummary }: { voteSummary: RevealedVoteSummary }) {
  if (!voteSummary.hasMajorityTie && !voteSummary.hasHighDispersion) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-3" role="status" aria-live="polite">
      {voteSummary.hasMajorityTie ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
          <p className="font-semibold">Tie detected</p>
          <p className="mt-1 text-sm">
            Multiple values share the lead:{" "}
            {voteSummary.majorityValues.join(", ")}. Discuss before deciding.
          </p>
        </div>
      ) : null}
      {voteSummary.hasHighDispersion ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-950">
          <p className="font-semibold">High dispersion detected</p>
          <p className="mt-1 text-sm">
            {voteSummary.highDispersionReason} Use this as a prompt for
            discussion.
          </p>
        </div>
      ) : null}
    </div>
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
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`mt-2 font-bold text-slate-950 ${compact ? "text-lg" : "text-2xl"}`}>
        {value}
      </p>
    </div>
  );
}
