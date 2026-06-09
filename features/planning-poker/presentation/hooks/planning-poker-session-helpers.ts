import {
  joinExistingPlanningPokerRoom,
  joinExistingPlanningPokerRoomAsSpectator,
  joinLocalPlanningPokerRoom,
  joinLocalPlanningPokerRoomAsSpectator,
  voteInRoom,
} from "../../application/planning-poker-use-cases";
import {
  normalizeRoomCode,
  type PlanningPokerRole,
  type PlanningPokerRoom,
  type VoteValue,
} from "../../domain/planning-poker";
import { loadLocalPlanningPokerState } from "../../infrastructure/local-planning-poker-state";
import { getLocalRealtimePlanningPokerRoomRepository } from "../../infrastructure/local-realtime-planning-poker-room-repository";

const localPlayerIdKey = "planning-poker.player-id.v1";

export function getServerLocalPlanningPokerState() {
  return null;
}

export function getInitialCurrentUserRole(): PlanningPokerRole {
  if (typeof window === "undefined") {
    return "participant";
  }

  return loadLocalPlanningPokerState()?.currentUserRole ?? "participant";
}

export function getInitialCurrentPlayerId(): string {
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

export function restoreLocalRoom(params: {
  roomCode: string;
  currentPlayerId: string;
  playerName: string;
  voteValue?: VoteValue;
  deck: PlanningPokerRoom["deck"];
  currentStory: string;
  pendingStories: PlanningPokerRoom["pendingStories"];
  spectators: PlanningPokerRoom["spectators"];
  storyHistory: PlanningPokerRoom["storyHistory"];
  currentUserRole: PlanningPokerRole;
}): PlanningPokerRoom {
  if (params.currentUserRole === "spectator") {
    return joinLocalPlanningPokerRoomAsSpectator({
      roomCode: params.roomCode,
      currentSpectatorName: params.playerName,
      currentSpectatorId: params.currentPlayerId,
      deck: params.deck,
      currentStory: params.currentStory,
      pendingStories: params.pendingStories,
      storyHistory: params.storyHistory,
    });
  }

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

export function joinSharedRoom(params: {
  roomCode: string;
  currentPlayerName: string;
  currentPlayerId: string;
  joinAs: "participant" | "spectator";
  roomRepository: ReturnType<typeof getLocalRealtimePlanningPokerRoomRepository>;
}): PlanningPokerRoom {
  const normalizedRoomCode = normalizeRoomCode(params.roomCode);
  const sharedSnapshot = params.roomRepository.getRoomSnapshot(normalizedRoomCode);

  if (sharedSnapshot) {
    if (params.joinAs === "spectator") {
      return joinExistingPlanningPokerRoomAsSpectator({
        room: sharedSnapshot.room,
        currentSpectatorName: params.currentPlayerName,
        currentSpectatorId: params.currentPlayerId,
      });
    }

    return joinExistingPlanningPokerRoom({
      room: sharedSnapshot.room,
      currentPlayerName: params.currentPlayerName,
      currentPlayerId: params.currentPlayerId,
    });
  }

  if (params.joinAs === "spectator") {
    return joinLocalPlanningPokerRoomAsSpectator({
      roomCode: normalizedRoomCode,
      currentSpectatorName: params.currentPlayerName,
      currentSpectatorId: params.currentPlayerId,
    });
  }

  return joinLocalPlanningPokerRoom({
    roomCode: normalizedRoomCode,
    currentPlayerName: params.currentPlayerName,
    currentPlayerId: params.currentPlayerId,
  });
}
