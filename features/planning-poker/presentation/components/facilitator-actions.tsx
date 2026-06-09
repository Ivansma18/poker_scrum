import {
  FacilitatorPermissionNotice,
  facilitatorPermissionMessage,
} from "./facilitator-permission";

type FacilitatorActionsProps = {
  canUseFacilitatorActions: boolean;
  onRevealVotes: () => void;
  onResetRound: () => void;
};

export function FacilitatorActions({
  canUseFacilitatorActions,
  onRevealVotes,
  onResetRound,
}: FacilitatorActionsProps) {
  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
        <button
          type="button"
          onClick={onRevealVotes}
          disabled={!canUseFacilitatorActions}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-5 py-3 font-semibold text-cyan-950 transition-all hover:from-cyan-300 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none sm:w-auto sm:px-6 touch-target"
          title={canUseFacilitatorActions ? undefined : facilitatorPermissionMessage}
        >
          Reveal votes
        </button>
        <button
          type="button"
          onClick={onResetRound}
          disabled={!canUseFacilitatorActions}
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-3 font-semibold text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-6 touch-target"
          title={canUseFacilitatorActions ? undefined : facilitatorPermissionMessage}
        >
          Reset round
        </button>
      </div>
      <FacilitatorPermissionNotice
        canUseFacilitatorActions={canUseFacilitatorActions}
      />
    </>
  );
}
