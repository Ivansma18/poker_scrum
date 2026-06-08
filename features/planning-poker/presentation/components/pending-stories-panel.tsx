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
    <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pending stories</h2>
          <p className="mt-1 text-sm text-slate-500">
            Load stories, then estimate them one by one.
          </p>
        </div>
        <button
          type="button"
          disabled={pendingStories.length === 0 || !canUseFacilitatorActions}
          onClick={onAdvanceToNextPendingStory}
          className="rounded-full bg-slate-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          Next story
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="block text-sm font-semibold" htmlFor="pending-stories">
            Add stories
          </label>
          <textarea
            id="pending-stories"
            disabled={!canUseFacilitatorActions}
            value={pendingStoriesInput}
            onChange={(event) => onPendingStoriesChange(event.target.value)}
            className="mt-2 min-h-24 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder={"PROJ-123 Login flow\nPROJ-124 Checkout"}
          />
          <p className="mt-1 text-xs text-slate-500">
            One story per line. Exact duplicates are ignored.
          </p>
        </div>
        <button
          type="button"
          disabled={!canLoadPendingStories || !canUseFacilitatorActions}
          onClick={onLoadPendingStories}
          className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          Load stories
        </button>
      </div>

      {pendingStories.length === 0 ? (
        <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-500">
          No pending stories loaded.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {pendingStories.map((story) => (
            <button
              key={story}
              type="button"
              disabled={!canUseFacilitatorActions}
              onClick={() => onSelectPendingStory(story)}
              className="rounded-2xl bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
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
