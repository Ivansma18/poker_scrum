import type { Dispatch, SetStateAction } from "react";
import type { PlanningPokerRoomRepository } from "../../application/planning-poker-room-repository";
import {
  advanceToNextPendingStory,
  leavePlanningPokerRoom,
  choosePendingStory,
  loadPendingStories,
  resetRoomRound,
  revealRoomVotes,
  selectRoomDeck,
  updateCurrentStory,
  voteInRoom,
} from "../../application/planning-poker-use-cases";
import {
  createPlanningPokerDeck,
  parseCustomDeckValues,
  type PlanningPokerRole,
  type PlanningPokerRoom,
  type VoteValue,
} from "../../domain/planning-poker";

type PlanningPokerRoomActionsParams = {
  activeRoom: PlanningPokerRoom | null;
  currentPlayerId: string;
  currentUserRole: PlanningPokerRole;
  canUseFacilitatorActions: boolean;
  canApplyCustomDeck: boolean;
  customDeckDraft: string;
  canApplyStory: boolean;
  storyDraft: string;
  canLoadPendingStories: boolean;
  pendingStoriesInput: string;
  roomRepository: PlanningPokerRoomRepository;
  setRoom: Dispatch<SetStateAction<PlanningPokerRoom | null>>;
  setCustomDeckInput: Dispatch<SetStateAction<string | null>>;
  setStoryInput: Dispatch<SetStateAction<string | null>>;
  setPendingStoriesInput: Dispatch<SetStateAction<string>>;
  setInviteCopied: Dispatch<SetStateAction<boolean>>;
};

export function createPlanningPokerRoomActions({
  activeRoom,
  currentPlayerId,
  currentUserRole,
  canUseFacilitatorActions,
  canApplyCustomDeck,
  customDeckDraft,
  canApplyStory,
  storyDraft,
  canLoadPendingStories,
  pendingStoriesInput,
  roomRepository,
  setRoom,
  setCustomDeckInput,
  setStoryInput,
  setPendingStoriesInput,
  setInviteCopied,
}: PlanningPokerRoomActionsParams) {
  async function copyInviteLink() {
    if (!activeRoom) {
      return;
    }

    const inviteLink = `${window.location.origin}/?room=${encodeURIComponent(activeRoom.id)}`;

    await navigator.clipboard.writeText(inviteLink);
    setInviteCopied(true);
  }

  function vote(value: VoteValue) {
    if (!activeRoom) {
      return;
    }

    setRoom((currentRoom) =>
      voteInRoom({
        room: currentRoom ?? activeRoom,
        playerId: currentPlayerId,
        value,
      }),
    );
  }

  function selectPresetDeck(kind: "fibonacci" | "t-shirt") {
    if (!activeRoom || !canUseFacilitatorActions) {
      return;
    }

    setCustomDeckInput(null);
    setRoom((currentRoom) =>
      selectRoomDeck({
        room: currentRoom ?? activeRoom,
        deck: createPlanningPokerDeck(kind),
        currentUserRole,
      }),
    );
  }

  function applyCustomDeck() {
    if (!activeRoom || !canApplyCustomDeck || !canUseFacilitatorActions) {
      return;
    }

    setRoom((currentRoom) =>
      selectRoomDeck({
        room: currentRoom ?? activeRoom,
        deck: createPlanningPokerDeck(
          "custom",
          parseCustomDeckValues(customDeckDraft),
        ),
        currentUserRole,
      }),
    );
  }

  function applyStory() {
    if (!activeRoom || !canApplyStory || !canUseFacilitatorActions) {
      return;
    }

    setRoom((currentRoom) =>
      updateCurrentStory({
        room: currentRoom ?? activeRoom,
        storyName: storyDraft,
        currentUserRole,
      }),
    );
    setStoryInput(null);
  }

  function loadStories() {
    if (!activeRoom || !canLoadPendingStories || !canUseFacilitatorActions) {
      return;
    }

    setRoom((currentRoom) =>
      loadPendingStories({
        room: currentRoom ?? activeRoom,
        storiesInput: pendingStoriesInput,
        currentUserRole,
      }),
    );
    setPendingStoriesInput("");
  }

  function selectPendingStory(storyName: string) {
    if (!activeRoom || !canUseFacilitatorActions) {
      return;
    }

    setRoom((currentRoom) =>
      choosePendingStory({
        room: currentRoom ?? activeRoom,
        storyName,
        currentUserRole,
      }),
    );
  }

  function advanceToNextPendingStoryAction() {
    if (!activeRoom || !canUseFacilitatorActions) {
      return;
    }

    setRoom((currentRoom) =>
      advanceToNextPendingStory({
        room: currentRoom ?? activeRoom,
        currentUserRole,
      }),
    );
  }

  function revealVotes() {
    if (!activeRoom) {
      return;
    }

    setRoom((currentRoom) =>
      revealRoomVotes({
        room: currentRoom ?? activeRoom,
        currentUserRole,
      }),
    );
  }

  function resetRound() {
    setRoom((currentRoom) => {
      const roomToReset = currentRoom ?? activeRoom;

      if (!roomToReset || !canUseFacilitatorActions) {
        return currentRoom;
      }

      return resetRoomRound({
        room: roomToReset,
        currentUserRole,
      });
    });
  }

  function leaveRoom() {
    if (!activeRoom) {
      return;
    }

    const nextRoom = leavePlanningPokerRoom({
      room: activeRoom,
      playerId: currentPlayerId,
    });

    roomRepository.publishRoom(nextRoom);
  }

  return {
    copyInviteLink,
    vote,
    selectPresetDeck,
    applyCustomDeck,
    applyStory,
    loadStories,
    selectPendingStory,
    advanceToNextPendingStory: advanceToNextPendingStoryAction,
    revealVotes,
    resetRound,
    leaveRoom,
  };
}
