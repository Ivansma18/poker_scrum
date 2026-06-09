"use client";

import { useState } from "react";
import type { PlanningPokerConnectionStatus } from "../../application/planning-poker-room-repository";
import type {
  PlanningPokerRole,
  PlanningPokerRoom,
  RevealedVoteSummary,
  Vote,
  VoteValue,
} from "../../domain/planning-poker";
import { CurrentStoryPanel } from "./current-story-panel";
import { ConfirmationDialog } from "./confirmation-dialog";
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
  isSpectator: boolean;
  connectionStatus: PlanningPokerConnectionStatus;
  inviteCopied: boolean;
  isLeaveRoomDialogOpen: boolean;
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
  onRequestLeaveRoom: () => void;
  onCancelLeaveRoom: () => void;
  onConfirmLeaveRoom: () => void;
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
  isSpectator,
  connectionStatus,
  inviteCopied,
  isLeaveRoomDialogOpen,
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
  onRequestLeaveRoom,
  onCancelLeaveRoom,
  onConfirmLeaveRoom,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="relative min-h-[100dvh] bg-[#0b1120] px-4 py-4 text-white sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 noise-overlay" />

      <section className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 sm:gap-5 lg:gap-6">
        <RoomHeader
          room={room}
          currentUserRole={currentUserRole}
          connectionStatus={connectionStatus}
          inviteCopied={inviteCopied}
          onCopyInviteLink={onCopyInviteLink}
          onRequestLeaveRoom={onRequestLeaveRoom}
        />

        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/[0.06] hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>
              {room.players.length} {room.players.length === 1 ? "player" : "players"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${isSidebarOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          {isSidebarOpen && (
            <div className="mt-3">
              <PlayersSidebar room={room} />
            </div>
          )}
        </div>

        <section className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_340px] lg:gap-6 xl:grid-cols-[1fr_380px]">
          <div className="space-y-4 sm:space-y-5">
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
            <VotingDeck
              room={room}
              currentVote={currentVote}
              isSpectator={isSpectator}
              onVote={onVote}
            />
            <ResultsSummary voteSummary={voteSummary} />
            <FacilitatorActions
              canUseFacilitatorActions={canUseFacilitatorActions}
              onRevealVotes={onRevealVotes}
              onResetRound={onResetRound}
            />
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-6">
              <PlayersSidebar room={room} />
            </div>
          </div>
        </section>
      </section>
      <ConfirmationDialog
        open={isLeaveRoomDialogOpen}
        title="Leave room?"
        description="You will be removed from the active players list and your current vote will be cleared for this room."
        confirmLabel="Leave room"
        onCancel={onCancelLeaveRoom}
        onConfirm={onConfirmLeaveRoom}
      />
    </main>
  );
}
