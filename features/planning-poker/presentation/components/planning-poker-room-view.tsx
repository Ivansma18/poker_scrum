import type { PlanningPokerConnectionStatus } from "../../application/planning-poker-room-repository";
import type {
  PlanningPokerRole,
  PlanningPokerRoom,
  RevealedVoteSummary,
  Vote,
  VoteValue,
} from "../../domain/planning-poker";
import { CurrentStoryPanel } from "./current-story-panel";
import { DeckSelector } from "./deck-selector";
import { FacilitatorActions } from "./facilitator-actions";
import { PendingStoriesPanel } from "./pending-stories-panel";
import { PlayersSidebar } from "./players-sidebar";
import { ResultsSummary } from "./results-summary";
import { RoomHeader } from "./room-header";
import { VotingDeck } from "./voting-deck";

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
