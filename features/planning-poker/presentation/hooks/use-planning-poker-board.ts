"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  canUseFacilitatorControls,
  createLocalPlanningPokerRoom,
} from "../../application/planning-poker-use-cases";
import type { PlanningPokerConnectionStatus } from "../../application/planning-poker-room-repository";
import {
  canCreateCustomDeck,
  canCreateRoomWithName,
  canJoinWithPlayerName,
  canJoinWithRoomCode,
  getVoteForPlayer,
  normalizeStoryName,
  summarizeRevealedVotes,
  type PlanningPokerRole,
  type PlanningPokerRoom,
} from "../../domain/planning-poker";
import {
  clearLocalPlanningPokerState,
  loadLocalPlanningPokerState,
  saveLocalPlanningPokerState,
  subscribeToLocalPlanningPokerState,
} from "../../infrastructure/local-planning-poker-state";
import { getLocalRealtimePlanningPokerRoomRepository } from "../../infrastructure/local-realtime-planning-poker-room-repository";
import { createPlanningPokerRoomActions } from "./planning-poker-room-actions";
import {
  getInitialCurrentPlayerId,
  getInitialCurrentUserRole,
  getServerLocalPlanningPokerState,
  joinSharedRoom,
  restoreLocalRoom,
} from "./planning-poker-session-helpers";

export type EntryMode = "create" | "join";

export function usePlanningPokerBoard(initialRoomCode = "") {
  const [entryMode, setEntryMode] = useState<EntryMode>(
    initialRoomCode ? "join" : "create",
  );
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [playerName, setPlayerName] = useState("");
  const [currentPlayerId] = useState(getInitialCurrentPlayerId);
  const [customDeckInput, setCustomDeckInput] = useState<string | null>(null);
  const [storyInput, setStoryInput] = useState<string | null>(null);
  const [pendingStoriesInput, setPendingStoriesInput] = useState("");
  const [connectionStatus, setConnectionStatus] =
    useState<PlanningPokerConnectionStatus>("disconnected");
  const [currentUserRole, setCurrentUserRole] = useState<PlanningPokerRole>(
    getInitialCurrentUserRole,
  );
  const [inviteCopied, setInviteCopied] = useState(false);
  const [isLeaveRoomDialogOpen, setIsLeaveRoomDialogOpen] = useState(false);
  const [room, setRoom] = useState<PlanningPokerRoom | null>(null);
  const skipNextRoomPublish = useRef(false);
  const roomRepository = getLocalRealtimePlanningPokerRoomRepository();
  const localState = useSyncExternalStore(
    subscribeToLocalPlanningPokerState,
    loadLocalPlanningPokerState,
    getServerLocalPlanningPokerState,
  );
  const restoredRoomCode = localState
    ? initialRoomCode || localState.roomCode
    : initialRoomCode;
  const restoredRoom = localState
    ? restoreLocalRoom({
        roomCode: restoredRoomCode,
        currentPlayerId,
        playerName: localState.playerName,
        voteValue: localState.voteValue,
        deck: localState.deck,
        currentStory: localState.currentStory,
        pendingStories: localState.pendingStories,
        storyHistory: localState.storyHistory,
      })
    : null;
  const activeRoom = room ?? restoredRoom;
  const canSubmitCreate =
    canCreateRoomWithName(roomName) && canJoinWithPlayerName(playerName);
  const canSubmitJoin =
    canJoinWithRoomCode(roomCode) && canJoinWithPlayerName(playerName);
  const canSubmitEntry = entryMode === "create" ? canSubmitCreate : canSubmitJoin;
  const canUseFacilitatorActions = canUseFacilitatorControls(currentUserRole);
  const currentVote = activeRoom
    ? getVoteForPlayer(activeRoom, currentPlayerId)
    : undefined;
  const voteSummary = activeRoom ? summarizeRevealedVotes(activeRoom) : null;
  const customDeckDraft = activeRoom
    ? customDeckInput ??
      (activeRoom.deck.kind === "custom" ? activeRoom.deck.values.join(", ") : "")
    : customDeckInput ?? "";
  const canApplyCustomDeck = canCreateCustomDeck(customDeckDraft);
  const storyDraft = activeRoom ? storyInput ?? activeRoom.currentStory : storyInput ?? "";
  const canApplyStory = activeRoom
    ? normalizeStoryName(storyDraft) !== activeRoom.currentStory
    : false;
  const canLoadPendingStories = pendingStoriesInput.trim().length > 0;
  const pendingStories = activeRoom?.pendingStories ?? [];
  const activeRoomId = activeRoom?.id;

  useEffect(() => {
    if (!room) {
      return;
    }

    const currentPlayer = room.players.find(
      (player) => player.id === currentPlayerId,
    );

    if (!currentPlayer) {
      return;
    }

    const currentVoteValue = getVoteForPlayer(room, currentPlayerId);

    saveLocalPlanningPokerState({
      playerId: currentPlayerId,
      playerName: currentPlayer.name,
      roomCode: room.id,
      voteValue: currentVoteValue?.value,
      deck: room.deck,
      currentUserRole,
      currentStory: room.currentStory,
      pendingStories: room.pendingStories ?? [],
      storyHistory: room.storyHistory,
    });
  }, [currentPlayerId, currentUserRole, room]);

  useEffect(() => {
    if (!activeRoomId) {
      return;
    }

    return roomRepository.subscribeToRoom(activeRoomId, {
      onSnapshot: (snapshot) => {
        if (snapshot.room.id !== activeRoomId) {
          return;
        }

        skipNextRoomPublish.current = true;
        setRoom(snapshot.room);
      },
      onConnectionStatusChange: setConnectionStatus,
    });
  }, [activeRoomId, roomRepository]);

  useEffect(() => {
    if (!room) {
      return;
    }

    if (skipNextRoomPublish.current) {
      skipNextRoomPublish.current = false;
      return;
    }

    roomRepository.publishRoom(room);
  }, [room, roomRepository]);

  function handleEnterRoom() {
    if (!canSubmitEntry) {
      return;
    }

    const nextRole = entryMode === "create" ? "facilitator" : "participant";

    setCurrentUserRole(nextRole);
    setRoom(
      entryMode === "create"
        ? createLocalPlanningPokerRoom({
            roomName,
            currentPlayerName: playerName,
            currentPlayerId,
          })
        : joinSharedRoom({
            roomCode,
            currentPlayerName: playerName,
            currentPlayerId,
            roomRepository,
          }),
    );
  }

  const roomActions = createPlanningPokerRoomActions({
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
  });

  return {
    entry: {
      entryMode,
      roomName,
      roomCode,
      playerName,
      canSubmit: canSubmitEntry,
      setEntryMode,
      setRoomName,
      setRoomCode,
      setPlayerName,
      onEnterRoom: handleEnterRoom,
    },
    session: activeRoom
      ? {
          room: activeRoom,
          currentPlayerId,
          currentUserRole,
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
          setCustomDeckInput,
          setStoryInput,
          setPendingStoriesInput,
          setIsLeaveRoomDialogOpen,
          onCopyInviteLink: roomActions.copyInviteLink,
          onVote: roomActions.vote,
          onSelectPresetDeck: roomActions.selectPresetDeck,
          onApplyCustomDeck: roomActions.applyCustomDeck,
          onApplyStory: roomActions.applyStory,
          onLoadPendingStories: roomActions.loadStories,
          onSelectPendingStory: roomActions.selectPendingStory,
          onAdvanceToNextPendingStory: roomActions.advanceToNextPendingStory,
          onRevealVotes: roomActions.revealVotes,
          onResetRound: roomActions.resetRound,
          onConfirmLeaveRoom: () => {
            roomActions.leaveRoom();
            clearLocalPlanningPokerState();
            setIsLeaveRoomDialogOpen(false);
            setRoom(null);
          },
        }
      : null,
  };
}
