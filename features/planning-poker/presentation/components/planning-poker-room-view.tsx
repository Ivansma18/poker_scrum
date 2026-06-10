"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { PlanningPokerConnectionStatus } from "../../application/planning-poker-room-repository";
import type {
  PlanningPokerRole,
  PlanningPokerRoom,
  RevealedVoteSummary,
  Vote,
  VoteValue,
} from "../../domain/planning-poker";
import type { ThemePreference } from "../hooks/use-theme-preference";
import { slideDown } from "../animation";
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
  theme: ThemePreference;
  connectionStatus: PlanningPokerConnectionStatus;
  inviteCopied: boolean;
  isLeaveRoomDialogOpen: boolean;
  canUseFacilitatorActions: boolean;
  currentVote?: Vote;
  voteConfirmation: { value: string } | null;
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
  onToggleTheme: () => void;
};

export function PlanningPokerRoomView({
  room,
  currentUserRole,
  isSpectator,
  theme,
  connectionStatus,
  inviteCopied,
  isLeaveRoomDialogOpen,
  canUseFacilitatorActions,
  currentVote,
  voteConfirmation,
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
  onToggleTheme,
}: PlanningPokerRoomViewProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="app-shell relative min-h-[100dvh] overflow-x-hidden px-3 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
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
          theme={theme}
          onToggleTheme={onToggleTheme}
        />

        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="touch-target flex w-full items-center justify-center gap-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-white/[0.06] hover:text-white"
            aria-expanded={isSidebarOpen}
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
              {(room.spectators ?? []).length > 0
                ? ` · ${(room.spectators ?? []).length} watching`
                : ""}
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
          <AnimatePresence>
            {isSidebarOpen ? (
              <motion.div
                key="mobile-sidebar"
                variants={slideDown}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="mt-3"
              >
                <PlayersSidebar room={room} />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <section className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_340px] lg:gap-6 xl:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="order-2 lg:order-1">
              <DeckSelector
                room={room}
                customDeckDraft={customDeckDraft}
                canApplyCustomDeck={canApplyCustomDeck}
                canUseFacilitatorActions={canUseFacilitatorActions}
                onCustomDeckChange={onCustomDeckChange}
                onSelectPresetDeck={onSelectPresetDeck}
                onApplyCustomDeck={onApplyCustomDeck}
              />
            </div>
            <div className="order-3 lg:order-2">
              <CurrentStoryPanel
                room={room}
                storyDraft={storyDraft}
                canApplyStory={canApplyStory}
                canUseFacilitatorActions={canUseFacilitatorActions}
                onStoryChange={onStoryChange}
                onApplyStory={onApplyStory}
              />
            </div>
            <div className="order-4 lg:order-3">
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
            </div>
            <div className="order-1 lg:order-4">
              <VotingDeck
                room={room}
                currentVote={currentVote}
                voteConfirmation={voteConfirmation}
                isSpectator={isSpectator}
                onVote={onVote}
              />
            </div>
            <div className="order-5">
              <ResultsSummary voteSummary={voteSummary} />
            </div>
            <div className="order-6">
              <FacilitatorActions
                canUseFacilitatorActions={canUseFacilitatorActions}
                onRevealVotes={onRevealVotes}
                onResetRound={onResetRound}
              />
            </div>
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
