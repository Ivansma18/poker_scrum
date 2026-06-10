"use client";

import { PlanningPokerEntryForm } from "./components/planning-poker-entry-form";
import { PlanningPokerRoomView } from "./components/planning-poker-room-view";
import { usePlanningPokerBoard } from "./hooks/use-planning-poker-board";
import { useThemePreference } from "./hooks/use-theme-preference";

type PlanningPokerBoardProps = {
  initialRoomCode?: string;
};

export function PlanningPokerBoard({
  initialRoomCode = "",
}: PlanningPokerBoardProps) {
  const { entry, session } = usePlanningPokerBoard(initialRoomCode);
  const { theme, toggleTheme } = useThemePreference();

  if (!session) {
    return (
      <PlanningPokerEntryForm
        entryMode={entry.entryMode}
        roomName={entry.roomName}
        roomCode={entry.roomCode}
        playerName={entry.playerName}
        joinAs={entry.joinAs}
        theme={theme}
        validationMessages={entry.validationMessages}
        canSubmit={entry.canSubmit}
        onEntryModeChange={entry.setEntryMode}
        onJoinAsChange={entry.setJoinAs}
        onRoomNameChange={entry.setRoomName}
        onRoomCodeChange={entry.setRoomCode}
        onPlayerNameChange={entry.setPlayerName}
        onSubmit={entry.onEnterRoom}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <PlanningPokerRoomView
      room={session.room}
      currentUserRole={session.currentUserRole}
      isSpectator={session.isSpectator}
      theme={theme}
      connectionStatus={session.connectionStatus}
      inviteCopied={session.inviteCopied}
      isLeaveRoomDialogOpen={session.isLeaveRoomDialogOpen}
      canUseFacilitatorActions={session.canUseFacilitatorActions}
      currentVote={session.currentVote}
      voteSummary={session.voteSummary}
      customDeckDraft={session.customDeckDraft}
      canApplyCustomDeck={session.canApplyCustomDeck}
      storyDraft={session.storyDraft}
      canApplyStory={session.canApplyStory}
      pendingStoriesInput={session.pendingStoriesInput}
      canLoadPendingStories={session.canLoadPendingStories}
      pendingStories={session.pendingStories}
      onCustomDeckChange={session.setCustomDeckInput}
      onStoryChange={session.setStoryInput}
      onPendingStoriesChange={session.setPendingStoriesInput}
      onCopyInviteLink={session.onCopyInviteLink}
      onRequestLeaveRoom={() => session.setIsLeaveRoomDialogOpen(true)}
      onCancelLeaveRoom={() => session.setIsLeaveRoomDialogOpen(false)}
      onConfirmLeaveRoom={session.onConfirmLeaveRoom}
      onVote={session.onVote}
      onSelectPresetDeck={session.onSelectPresetDeck}
      onApplyCustomDeck={session.onApplyCustomDeck}
      onApplyStory={session.onApplyStory}
      onLoadPendingStories={session.onLoadPendingStories}
      onSelectPendingStory={session.onSelectPendingStory}
      onAdvanceToNextPendingStory={session.onAdvanceToNextPendingStory}
      onRevealVotes={session.onRevealVotes}
      onResetRound={session.onResetRound}
      onToggleTheme={toggleTheme}
    />
  );
}
