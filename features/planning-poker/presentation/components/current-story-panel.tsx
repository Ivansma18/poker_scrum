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
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Current story</h2>
          <p className="mt-1 text-sm text-slate-500">
            {room.currentStory || "No story selected"}
          </p>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          {room.currentStory ? "Estimating" : "Empty"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="block text-sm font-semibold" htmlFor="current-story">
            Story name or ID
          </label>
          <input
            id="current-story"
            disabled={!canUseFacilitatorActions}
            type="text"
            value={storyDraft}
            onChange={(event) => onStoryChange(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="Example: PROJ-123 Login flow"
          />
          <p className="mt-1 text-xs text-slate-500">
            Applying a different story clears the current votes.
          </p>
        </div>
        <button
          type="button"
          disabled={!canApplyStory || !canUseFacilitatorActions}
          onClick={onApplyStory}
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
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
