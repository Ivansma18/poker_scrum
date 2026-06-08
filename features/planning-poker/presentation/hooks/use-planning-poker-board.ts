"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  advanceToNextPendingStory,
  canUseFacilitatorControls,
  choosePendingStory,
  createLocalPlanningPokerRoom,
  joinExistingPlanningPokerRoom,
  joinLocalPlanningPokerRoom,
  loadPendingStories,
  resetRoomRound,
  revealRoomVotes,
  selectRoomDeck,
  updateCurrentStory,
  voteInRoom,
} from "../../application/planning-poker-use-cases";
import type { PlanningPokerConnectionStatus } from "../../application/planning-poker-room-repository";
import {
  canCreateCustomDeck,
  canCreateRoomWithName,
  canJoinWithPlayerName,
  canJoinWithRoomCode,
  createPlanningPokerDeck,
  getVoteForPlayer,
  normalizeRoomCode,
  normalizeStoryName,
  parseCustomDeckValues,
  summarizeRevealedVotes,
  type PlanningPokerRole,
  type PlanningPokerRoom,
  type VoteValue,
} from "../../domain/planning-poker";
import {
  loadLocalPlanningPokerState,
  saveLocalPlanningPokerState,
  subscribeToLocalPlanningPokerState,
} from "../../infrastructure/local-planning-poker-state";
import { getLocalRealtimePlanningPokerRoomRepository } from "../../infrastructure/local-realtime-planning-poker-room-repository";

const localPlayerIdKey = "planning-poker.player-id.v1";

export type EntryMode = "create" | "join";

function getServerLocalPlanningPokerState() {
  return null;
}

function getInitialCurrentUserRole(): PlanningPokerRole {
  if (typeof window === "undefined") {
    return "participant";
  }

  return loadLocalPlanningPokerState()?.currentUserRole ?? "participant";
}

function getInitialCurrentPlayerId(): string {
  if (typeof window === "undefined") {
    return "you";
  }

  const localState = loadLocalPlanningPokerState();

  if (localState?.playerId) {
    return localState.playerId;
  }

  const storedPlayerId = window.sessionStorage.getItem(localPlayerIdKey);

  if (storedPlayerId) {
    return storedPlayerId;
  }

  const playerId = crypto.randomUUID();

  window.sessionStorage.setItem(localPlayerIdKey, playerId);

  return playerId;
}

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
    if (!activeRoom) {
      return;
    }

    return roomRepository.subscribeToRoom(activeRoom.id, {
      onSnapshot: (snapshot) => {
        if (snapshot.room.id !== activeRoom.id) {
          return;
        }

        skipNextRoomPublish.current = true;
        setRoom(snapshot.room);
      },
      onConnectionStatusChange: setConnectionStatus,
    });
  }, [activeRoom, roomRepository]);

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

  async function handleCopyInviteLink() {
    if (!activeRoom) {
      return;
    }

    const inviteLink = `${window.location.origin}/?room=${encodeURIComponent(activeRoom.id)}`;

    await navigator.clipboard.writeText(inviteLink);
    setInviteCopied(true);
  }

  function handleVote(value: VoteValue) {
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

  function handleSelectPresetDeck(kind: "fibonacci" | "t-shirt") {
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

  function handleApplyCustomDeck() {
    if (!activeRoom || !canApplyCustomDeck || !canUseFacilitatorActions) {
      return;
    }

    setRoom((currentRoom) =>
      selectRoomDeck({
        room: currentRoom ?? activeRoom,
        deck: createPlanningPokerDeck("custom", parseCustomDeckValues(customDeckDraft)),
        currentUserRole,
      }),
    );
  }

  function handleApplyStory() {
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

  function handleLoadPendingStories() {
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

  function handleSelectPendingStory(storyName: string) {
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

  function handleAdvanceToNextPendingStory() {
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

  function handleRevealVotes() {
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

  function handleResetRound() {
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
          onCopyInviteLink: handleCopyInviteLink,
          onVote: handleVote,
          onSelectPresetDeck: handleSelectPresetDeck,
          onApplyCustomDeck: handleApplyCustomDeck,
          onApplyStory: handleApplyStory,
          onLoadPendingStories: handleLoadPendingStories,
          onSelectPendingStory: handleSelectPendingStory,
          onAdvanceToNextPendingStory: handleAdvanceToNextPendingStory,
          onRevealVotes: handleRevealVotes,
          onResetRound: handleResetRound,
        }
      : null,
  };
}

function restoreLocalRoom(params: {
  roomCode: string;
  currentPlayerId: string;
  playerName: string;
  voteValue?: VoteValue;
  deck: PlanningPokerRoom["deck"];
  currentStory: string;
  pendingStories: PlanningPokerRoom["pendingStories"];
  storyHistory: PlanningPokerRoom["storyHistory"];
}): PlanningPokerRoom {
  const restoredRoom = joinLocalPlanningPokerRoom({
    roomCode: params.roomCode,
    currentPlayerName: params.playerName,
    currentPlayerId: params.currentPlayerId,
    deck: params.deck,
    currentStory: params.currentStory,
    pendingStories: params.pendingStories,
    storyHistory: params.storyHistory,
  });

  return params.voteValue
    ? voteInRoom({
        room: restoredRoom,
        playerId: params.currentPlayerId,
        value: params.voteValue,
      })
    : restoredRoom;
}

function joinSharedRoom(params: {
  roomCode: string;
  currentPlayerName: string;
  currentPlayerId: string;
  roomRepository: ReturnType<typeof getLocalRealtimePlanningPokerRoomRepository>;
}): PlanningPokerRoom {
  const normalizedRoomCode = normalizeRoomCode(params.roomCode);
  const sharedSnapshot = params.roomRepository.getRoomSnapshot(normalizedRoomCode);

  if (sharedSnapshot) {
    return joinExistingPlanningPokerRoom({
      room: sharedSnapshot.room,
      currentPlayerName: params.currentPlayerName,
      currentPlayerId: params.currentPlayerId,
    });
  }

  return joinLocalPlanningPokerRoom({
    roomCode: normalizedRoomCode,
    currentPlayerName: params.currentPlayerName,
    currentPlayerId: params.currentPlayerId,
  });
}
