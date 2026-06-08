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
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRevealVotes}
          disabled={!canUseFacilitatorActions}
          className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          title={canUseFacilitatorActions ? undefined : facilitatorPermissionMessage}
        >
          Reveal votes
        </button>
        <button
          type="button"
          onClick={onResetRound}
          disabled={!canUseFacilitatorActions}
          className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
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
