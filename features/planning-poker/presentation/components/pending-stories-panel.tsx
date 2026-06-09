import { FacilitatorPermissionNotice } from "./facilitator-permission";

type PendingStoriesPanelProps = {
  pendingStories: string[];
  pendingStoriesInput: string;
  canLoadPendingStories: boolean;
  canUseFacilitatorActions: boolean;
  onPendingStoriesChange: (value: string) => void;
  onLoadPendingStories: () => void;
  onSelectPendingStory: (storyName: string) => void;
  onAdvanceToNextPendingStory: () => void;
};

export function PendingStoriesPanel({
  pendingStories,
  pendingStoriesInput,
  canLoadPendingStories,
  canUseFacilitatorActions,
  onPendingStoriesChange,
  onLoadPendingStories,
  onSelectPendingStory,
  onAdvanceToNextPendingStory,
}: PendingStoriesPanelProps) {
  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Pending stories</h2>
          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            {pendingStories.length > 0 ? (
              <span>
                <span className="font-medium text-cyan-400">{pendingStories.length}</span> stories in queue
              </span>
            ) : (
              "Load stories, then estimate them one by one."
            )}
          </p>
        </div>
        <button
          type="button"
          disabled={pendingStories.length === 0 || !canUseFacilitatorActions}
          onClick={onAdvanceToNextPendingStory}
          className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-5 touch-target"
        >
          Next story
        </button>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-400" htmlFor="pending-stories">
            Add stories
          </label>
          <textarea
            id="pending-stories"
            disabled={!canUseFacilitatorActions}
            value={pendingStoriesInput}
            onChange={(event) => onPendingStoriesChange(event.target.value)}
            className="mt-2 min-h-20 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-500 input-focus disabled:opacity-50 sm:min-h-24 sm:px-4 sm:py-3 sm:text-base"
            placeholder={"PROJ-123 Login flow\nPROJ-124 Checkout"}
          />
          <p className="mt-1.5 text-[10px] text-slate-500 sm:text-xs">
            One story per line. Duplicates ignored.
          </p>
        </div>
        <button
          type="button"
          disabled={!canLoadPendingStories || !canUseFacilitatorActions}
          onClick={onLoadPendingStories}
          className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-cyan-950 transition-all hover:from-cyan-300 hover:to-cyan-400 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 sm:w-auto sm:px-5 sm:py-3 touch-target"
        >
          Load stories
        </button>
      </div>

      {pendingStories.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-white/[0.06] bg-white/[0.01] px-4 py-6 text-center">
          <p className="text-xs text-slate-500 sm:text-sm">No pending stories loaded.</p>
        </div>
      ) : (
        <div className="mt-3 flex max-h-[200px] flex-col gap-1 overflow-y-auto scrollbar-thin sm:mt-4 sm:gap-1.5">
          {pendingStories.map((story) => (
            <button
              key={story}
              type="button"
              disabled={!canUseFacilitatorActions}
              onClick={() => onSelectPendingStory(story)}
              className="rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition-all hover:bg-white/[0.06] hover:text-white disabled:opacity-40 sm:rounded-xl sm:px-4 sm:py-3 sm:text-sm touch-target"
            >
              {story}
            </button>
          ))}
        </div>
      )}

      <FacilitatorPermissionNotice
        canUseFacilitatorActions={canUseFacilitatorActions}
      />
    </section>
  );
}
