import type { PlanningPokerRoom } from "../../domain/planning-poker";
import { FacilitatorPermissionNotice } from "./facilitator-permission";

type CurrentStoryPanelProps = {
  room: PlanningPokerRoom;
  storyDraft: string;
  canApplyStory: boolean;
  canUseFacilitatorActions: boolean;
  onStoryChange: (value: string) => void;
  onApplyStory: () => void;
};

export function CurrentStoryPanel({
  room,
  storyDraft,
  canApplyStory,
  canUseFacilitatorActions,
  onStoryChange,
  onApplyStory,
}: CurrentStoryPanelProps) {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold sm:text-xl">Current story</h2>
          <p className="mt-0.5 truncate text-xs text-slate-400 sm:text-sm">
            {room.currentStory || (
              <span className="italic text-slate-600">No story selected</span>
            )}
          </p>
        </div>
        <span
          className={`w-fit shrink-0 rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:px-2.5 sm:text-xs ${
            room.currentStory
              ? "bg-cyan-500/10 text-cyan-400"
              : "bg-white/[0.06] text-slate-500"
          }`}
        >
          {room.currentStory ? "Estimating" : "Empty"}
        </span>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400" htmlFor="current-story">
            Story name or ID
          </label>
          <input
            id="current-story"
            disabled={!canUseFacilitatorActions}
            type="text"
            value={storyDraft}
            onChange={(event) => onStoryChange(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-500 input-focus disabled:opacity-50 sm:px-4 sm:py-3 sm:text-base"
            placeholder="PROJ-123 Login flow"
          />
          <p className="mt-1.5 text-[10px] text-slate-500 sm:text-xs">
            Changing story clears current votes.
          </p>
        </div>
        <button
          type="button"
          disabled={!canApplyStory || !canUseFacilitatorActions}
          onClick={onApplyStory}
          className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-5 sm:py-3 touch-target"
        >
          Apply story
        </button>
      </div>
      <FacilitatorPermissionNotice
        canUseFacilitatorActions={canUseFacilitatorActions}
      />
    </section>
  );
}
