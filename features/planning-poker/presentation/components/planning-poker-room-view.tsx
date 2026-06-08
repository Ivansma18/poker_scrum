import { getVoteForPlayer, type PlanningPokerRole, type PlanningPokerRoom, type RevealedVoteSummary, type Vote, type VoteValue } from "../../domain/planning-poker";
import type { PlanningPokerConnectionStatus } from "../../application/planning-poker-room-repository";

const facilitatorPermissionMessage = "Only facilitators can use this control.";

type PlanningPokerRoomViewProps = {
  room: PlanningPokerRoom;
  currentUserRole: PlanningPokerRole;
  connectionStatus: PlanningPokerConnectionStatus;
  inviteCopied: boolean;
  canUseFacilitatorActions: boolean;
  currentVote?: Vote;
  voteSummary: RevealedVoteSummary | null;
  customDeckDraft: string;
  canApplyCustomDeck: boolean;
  storyDraft: string;
  canApplyStory: boolean;
  pendingStoriesInput: string;
  canLoadPendingStories: boolean;
  pendingStories: string[];
  onCustomDeckChange: (value: string) => void;
  onStoryChange: (value: string) => void;
  onPendingStoriesChange: (value: string) => void;
  onCopyInviteLink: () => void;
  onVote: (value: VoteValue) => void;
  onSelectPresetDeck: (kind: "fibonacci" | "t-shirt") => void;
  onApplyCustomDeck: () => void;
  onApplyStory: () => void;
  onLoadPendingStories: () => void;
  onSelectPendingStory: (storyName: string) => void;
  onAdvanceToNextPendingStory: () => void;
  onRevealVotes: () => void;
  onResetRound: () => void;
};

export function PlanningPokerRoomView({
  room,
  currentUserRole,
  connectionStatus,
  inviteCopied,
  canUseFacilitatorActions,
  currentVote,
  voteSummary,
  customDeckDraft,
  canApplyCustomDeck,
  storyDraft,
  canApplyStory,
  pendingStoriesInput,
  canLoadPendingStories,
  pendingStories,
  onCustomDeckChange,
  onStoryChange,
  onPendingStoriesChange,
  onCopyInviteLink,
  onVote,
  onSelectPresetDeck,
  onApplyCustomDeck,
  onApplyStory,
  onLoadPendingStories,
  onSelectPendingStory,
  onAdvanceToNextPendingStory,
  onRevealVotes,
  onResetRound,
}: PlanningPokerRoomViewProps) {
  return (
    <main className="min-h-screen bg-[#0f172a] px-6 py-8 text-white sm:px-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <RoomHeader
          room={room}
          currentUserRole={currentUserRole}
          connectionStatus={connectionStatus}
          inviteCopied={inviteCopied}
          onCopyInviteLink={onCopyInviteLink}
        />

        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-black/20 sm:p-6">
            <DeckSelector
              room={room}
              customDeckDraft={customDeckDraft}
              canApplyCustomDeck={canApplyCustomDeck}
              canUseFacilitatorActions={canUseFacilitatorActions}
              onCustomDeckChange={onCustomDeckChange}
              onSelectPresetDeck={onSelectPresetDeck}
              onApplyCustomDeck={onApplyCustomDeck}
            />
            <CurrentStoryPanel
              room={room}
              storyDraft={storyDraft}
              canApplyStory={canApplyStory}
              canUseFacilitatorActions={canUseFacilitatorActions}
              onStoryChange={onStoryChange}
              onApplyStory={onApplyStory}
            />
            <PendingStoriesPanel
              pendingStories={pendingStories}
              pendingStoriesInput={pendingStoriesInput}
              canLoadPendingStories={canLoadPendingStories}
              canUseFacilitatorActions={canUseFacilitatorActions}
              onPendingStoriesChange={onPendingStoriesChange}
              onLoadPendingStories={onLoadPendingStories}
              onSelectPendingStory={onSelectPendingStory}
              onAdvanceToNextPendingStory={onAdvanceToNextPendingStory}
            />
            <VotingDeck room={room} currentVote={currentVote} onVote={onVote} />
            <ResultsSummary voteSummary={voteSummary} />
            <FacilitatorActions
              canUseFacilitatorActions={canUseFacilitatorActions}
              onRevealVotes={onRevealVotes}
              onResetRound={onResetRound}
            />
          </div>

          <PlayersSidebar room={room} />
        </section>
      </section>
    </main>
  );
}

function RoomHeader({
  room,
  currentUserRole,
  connectionStatus,
  inviteCopied,
  onCopyInviteLink,
}: {
  room: PlanningPokerRoom;
  currentUserRole: PlanningPokerRole;
  connectionStatus: PlanningPokerConnectionStatus;
  inviteCopied: boolean;
  onCopyInviteLink: () => void;
}) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-200">
          Planning poker
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">{room.name}</h1>
        <p className="mt-3 max-w-2xl text-base text-slate-300">
          Vote privately, reveal estimates together, then reset the round for the next story.
        </p>
        <p className="mt-2 text-sm font-medium text-cyan-200">Room code: {room.id}</p>
        <p className="mt-1 text-sm font-medium text-slate-300">Your role: {currentUserRole}</p>
        <p className="mt-1 text-sm font-medium text-slate-300">Connection: {connectionStatus}</p>
      </div>
      <div className="flex flex-col gap-3 sm:items-end">
        <div className="rounded-2xl bg-black/30 px-5 py-4 text-sm text-slate-200">
          <span className="block text-2xl font-semibold text-white">
            {room.votes.length}/{room.players.length}
          </span>
          votes submitted
        </div>
        <button
          type="button"
          onClick={onCopyInviteLink}
          className="rounded-full border border-cyan-200/50 px-5 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-200 hover:text-cyan-950"
        >
          {inviteCopied ? "Invite link copied" : "Copy invite link"}
        </button>
      </div>
    </header>
  );
}

function DeckSelector({
  room,
  customDeckDraft,
  canApplyCustomDeck,
  canUseFacilitatorActions,
  onCustomDeckChange,
  onSelectPresetDeck,
  onApplyCustomDeck,
}: {
  room: PlanningPokerRoom;
  customDeckDraft: string;
  canApplyCustomDeck: boolean;
  canUseFacilitatorActions: boolean;
  onCustomDeckChange: (value: string) => void;
  onSelectPresetDeck: (kind: "fibonacci" | "t-shirt") => void;
  onApplyCustomDeck: () => void;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Estimation deck</h2>
          <p className="mt-1 text-sm text-slate-500">
            Active deck: {room.deck.name}. Changing decks resets the round.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PresetDeckButton
            label="Fibonacci"
            active={room.deck.kind === "fibonacci"}
            disabled={!canUseFacilitatorActions}
            onClick={() => onSelectPresetDeck("fibonacci")}
          />
          <PresetDeckButton
            label="T-shirt sizes"
            active={room.deck.kind === "t-shirt"}
            disabled={!canUseFacilitatorActions}
            onClick={() => onSelectPresetDeck("t-shirt")}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="block text-sm font-semibold" htmlFor="custom-deck">
            Custom deck
          </label>
          <textarea
            id="custom-deck"
            disabled={!canUseFacilitatorActions}
            value={customDeckDraft}
            onChange={(event) => onCustomDeckChange(event.target.value)}
            className="mt-2 min-h-20 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="Example: 0, 1, 2, 3, 5, 8, ?"
          />
          <p className="mt-1 text-xs text-slate-500">
            Use commas or line breaks. Duplicates are removed; up to 12 cards are kept.
          </p>
        </div>
        <button
          type="button"
          disabled={!canApplyCustomDeck || !canUseFacilitatorActions}
          onClick={onApplyCustomDeck}
          className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          Apply custom
        </button>
      </div>
      <FacilitatorPermissionNotice canUseFacilitatorActions={canUseFacilitatorActions} />
    </section>
  );
}

function PresetDeckButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white"
          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
      }`}
      title={disabled ? facilitatorPermissionMessage : undefined}
    >
      {label}
    </button>
  );
}

function CurrentStoryPanel({
  room,
  storyDraft,
  canApplyStory,
  canUseFacilitatorActions,
  onStoryChange,
  onApplyStory,
}: {
  room: PlanningPokerRoom;
  storyDraft: string;
  canApplyStory: boolean;
  canUseFacilitatorActions: boolean;
  onStoryChange: (value: string) => void;
  onApplyStory: () => void;
}) {
  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Current story</h2>
          <p className="mt-1 text-sm text-slate-500">{room.currentStory || "No story selected"}</p>
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
      <FacilitatorPermissionNotice canUseFacilitatorActions={canUseFacilitatorActions} />
    </section>
  );
}

function PendingStoriesPanel({
  pendingStories,
  pendingStoriesInput,
  canLoadPendingStories,
  canUseFacilitatorActions,
  onPendingStoriesChange,
  onLoadPendingStories,
  onSelectPendingStory,
  onAdvanceToNextPendingStory,
}: {
  pendingStories: string[];
  pendingStoriesInput: string;
  canLoadPendingStories: boolean;
  canUseFacilitatorActions: boolean;
  onPendingStoriesChange: (value: string) => void;
  onLoadPendingStories: () => void;
  onSelectPendingStory: (storyName: string) => void;
  onAdvanceToNextPendingStory: () => void;
}) {
  return (
    <section className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Pending stories</h2>
          <p className="mt-1 text-sm text-slate-500">Load stories, then estimate them one by one.</p>
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
          <p className="mt-1 text-xs text-slate-500">One story per line. Exact duplicates are ignored.</p>
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

      <FacilitatorPermissionNotice canUseFacilitatorActions={canUseFacilitatorActions} />
    </section>
  );
}

function VotingDeck({
  room,
  currentVote,
  onVote,
}: {
  room: PlanningPokerRoom;
  currentVote?: Vote;
  onVote: (value: VoteValue) => void;
}) {
  return (
    <>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Choose your card</h2>
          <p className="text-sm text-slate-500">Your current vote: {currentVote?.value ?? "none"}</p>
        </div>
        <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {room.revealed ? "Revealed" : "Voting"}
        </span>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {room.deck.values.map((card) => {
          const selected = currentVote?.value === card;

          return (
            <button
              key={card}
              type="button"
              disabled={room.revealed}
              onClick={() => onVote(card)}
              className={`aspect-[3/4] rounded-2xl border text-2xl font-bold transition enabled:hover:-translate-y-1 enabled:hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 ${
                selected
                  ? "border-cyan-400 bg-cyan-100 text-cyan-950 shadow-lg shadow-cyan-200"
                  : "border-slate-200 bg-white text-slate-900 shadow-sm"
              }`}
            >
              {card === "coffee" ? "coffee" : card}
            </button>
          );
        })}
      </div>
    </>
  );
}

function ResultsSummary({ voteSummary }: { voteSummary: RevealedVoteSummary | null }) {
  if (!voteSummary) {
    return null;
  }

  return (
    <section className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-cyan-950">Results summary</h2>
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
          {voteSummary.hasMajorityTie || voteSummary.hasHighDispersion ? (
            <div className="mt-4 grid gap-3" role="status" aria-live="polite">
              {voteSummary.hasMajorityTie ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
                  <p className="font-semibold">Tie detected</p>
                  <p className="mt-1 text-sm">
                    Multiple values share the lead: {voteSummary.majorityValues.join(", ")}. Discuss before deciding.
                  </p>
                </div>
              ) : null}
              {voteSummary.hasHighDispersion ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-950">
                  <p className="font-semibold">High dispersion detected</p>
                  <p className="mt-1 text-sm">
                    {voteSummary.highDispersionReason} Use this as a prompt for discussion.
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <SummaryMetric label="Majority" value={voteSummary.majorityValues.join(", ")} />
            <SummaryMetric label="Average" value={voteSummary.average ?? "N/A"} />
            <SummaryMetric label="Dispersion" value={voteSummary.dispersion} compact />
          </div>
        </>
      )}

      {voteSummary.nonNumericValues.length > 0 ? (
        <p className="mt-3 text-sm text-cyan-900/70">
          Non-numeric votes excluded from average: {voteSummary.nonNumericValues.join(", ")}
        </p>
      ) : null}
    </section>
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
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-2 font-bold text-slate-950 ${compact ? "text-lg" : "text-2xl"}`}>{value}</p>
    </div>
  );
}

function FacilitatorActions({
  canUseFacilitatorActions,
  onRevealVotes,
  onResetRound,
}: {
  canUseFacilitatorActions: boolean;
  onRevealVotes: () => void;
  onResetRound: () => void;
}) {
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
      <FacilitatorPermissionNotice canUseFacilitatorActions={canUseFacilitatorActions} />
    </>
  );
}

function PlayersSidebar({ room }: { room: PlanningPokerRoom }) {
  return (
    <aside className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
      <h2 className="text-2xl font-semibold">Players</h2>
      <div className="mt-5 flex flex-col gap-3">
        {room.players.map((player) => {
          const vote = getVoteForPlayer(room, player.id);

          return (
            <div key={player.id} className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
              <div>
                <p className="font-semibold">{player.name}</p>
                <p className="text-sm text-slate-300">{vote ? "Voted" : "Waiting"}</p>
              </div>
              <div className="flex h-12 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-950">
                {room.revealed ? vote?.value ?? "-" : vote ? "ok" : "-"}
              </div>
            </div>
          );
        })}
      </div>

      <RoundHistory room={room} />
    </aside>
  );
}

function RoundHistory({ room }: { room: PlanningPokerRoom }) {
  return (
    <section className="mt-8 border-t border-white/10 pt-6">
      <h2 className="text-2xl font-semibold">Round history</h2>
      {room.storyHistory.length === 0 ? (
        <p className="mt-3 text-sm text-slate-300">
          Revealed rounds will appear here after you replace the story or reset.
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-3">
          {room.storyHistory.map((entry, index) => (
            <div key={`${entry.storyName}-${index}`} className="rounded-2xl bg-white/10 px-4 py-3">
              <p className="font-semibold">{entry.storyName}</p>
              <p className="mt-1 text-sm text-slate-300">{entry.result}</p>
              <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                {entry.deckName} - {formatHistoryDate(entry.recordedAt)}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FacilitatorPermissionNotice({
  canUseFacilitatorActions,
}: {
  canUseFacilitatorActions: boolean;
}) {
  return canUseFacilitatorActions ? null : (
    <p className="mt-3 text-sm font-medium text-slate-500">{facilitatorPermissionMessage}</p>
  );
}

function formatHistoryDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString();
}
