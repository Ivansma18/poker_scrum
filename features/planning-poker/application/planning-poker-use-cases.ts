import {
  addPlayer,
  addPendingStories,
  addSpectator,
  canFacilitateRoom,
  canCreateRoomWithName,
  canJoinWithPlayerName,
  canJoinWithRoomCode,
  changeCurrentStory,
  changeRoomDeck,
  createPlanningPokerRoom,
  createRoomCodeFromName,
  normalizePlayerName,
  normalizeRoomCode,
  normalizeRoomName,
  parsePendingStories,
  removeRoomMember,
  revealVotes,
  resetRound,
  selectNextPendingStory,
  selectPendingStory,
  submitVote,
  type PlanningPokerDeck,
  type PlanningPokerRole,
  type PlanningPokerRoom,
  type StoryHistoryEntry,
  type VoteValue,
} from "../domain/planning-poker";

export function createLocalPlanningPokerRoom(params: {
  roomName: string;
  currentPlayerName: string;
  currentPlayerId: string;
  deck?: PlanningPokerDeck;
  currentStory?: string;
  pendingStories?: string[];
  storyHistory?: StoryHistoryEntry[];
}): PlanningPokerRoom {
  if (!canCreateRoomWithName(params.roomName)) {
    throw new Error("A room name is required to create a room.");
  }

  if (!canJoinWithPlayerName(params.currentPlayerName)) {
    throw new Error("A player name is required to join the room.");
  }

  return createPlanningPokerRoom({
    id: createRoomCodeFromName(params.roomName),
    name: normalizeRoomName(params.roomName),
    players: [
      { id: params.currentPlayerId, name: normalizePlayerName(params.currentPlayerName) },
    ],
    spectators: [],
    deck: params.deck,
    currentStory: params.currentStory,
    pendingStories: params.pendingStories,
    storyHistory: params.storyHistory,
  });
}

export function joinLocalPlanningPokerRoom(params: {
  roomCode: string;
  currentPlayerName: string;
  currentPlayerId: string;
  deck?: PlanningPokerDeck;
  currentStory?: string;
  pendingStories?: string[];
  storyHistory?: StoryHistoryEntry[];
}): PlanningPokerRoom {
  if (!canJoinWithRoomCode(params.roomCode)) {
    throw new Error("A room code is required to join a room.");
  }

  if (!canJoinWithPlayerName(params.currentPlayerName)) {
    throw new Error("A player name is required to join the room.");
  }

  return addPlayer(
    createPlanningPokerRoom({
      id: normalizeRoomCode(params.roomCode),
      name: `Room ${normalizeRoomCode(params.roomCode)}`,
      players: [],
      spectators: [],
      deck: params.deck,
      currentStory: params.currentStory,
      pendingStories: params.pendingStories,
      storyHistory: params.storyHistory,
    }),
    { id: params.currentPlayerId, name: normalizePlayerName(params.currentPlayerName) },
  );
}

export function joinExistingPlanningPokerRoom(params: {
  room: PlanningPokerRoom;
  currentPlayerName: string;
  currentPlayerId: string;
}): PlanningPokerRoom {
  if (!canJoinWithPlayerName(params.currentPlayerName)) {
    throw new Error("A player name is required to join the room.");
  }

  return addPlayer({ ...params.room, pendingStories: params.room.pendingStories ?? [], spectators: params.room.spectators ?? [] }, {
    id: params.currentPlayerId,
    name: normalizePlayerName(params.currentPlayerName),
  });
}

export function joinExistingPlanningPokerRoomAsSpectator(params: {
  room: PlanningPokerRoom;
  currentSpectatorName: string;
  currentSpectatorId: string;
}): PlanningPokerRoom {
  if (!canJoinWithPlayerName(params.currentSpectatorName)) {
    throw new Error("A spectator name is required to join the room.");
  }

  return addSpectator(
    {
      ...params.room,
      pendingStories: params.room.pendingStories ?? [],
      spectators: params.room.spectators ?? [],
    },
    {
      id: params.currentSpectatorId,
      name: normalizePlayerName(params.currentSpectatorName),
    },
  );
}

export function joinLocalPlanningPokerRoomAsSpectator(params: {
  roomCode: string;
  currentSpectatorName: string;
  currentSpectatorId: string;
  deck?: PlanningPokerDeck;
  currentStory?: string;
  pendingStories?: string[];
  storyHistory?: StoryHistoryEntry[];
}): PlanningPokerRoom {
  if (!canJoinWithRoomCode(params.roomCode)) {
    throw new Error("A room code is required to join a room.");
  }

  if (!canJoinWithPlayerName(params.currentSpectatorName)) {
    throw new Error("A spectator name is required to join the room.");
  }

  return addSpectator(
    createPlanningPokerRoom({
      id: normalizeRoomCode(params.roomCode),
      name: `Room ${normalizeRoomCode(params.roomCode)}`,
      players: [],
      spectators: [],
      deck: params.deck,
      currentStory: params.currentStory,
      pendingStories: params.pendingStories,
      storyHistory: params.storyHistory,
    }),
    {
      id: params.currentSpectatorId,
      name: normalizePlayerName(params.currentSpectatorName),
    },
  );
}

export function voteInRoom(params: {
  room: PlanningPokerRoom;
  playerId: string;
  value: VoteValue;
}): PlanningPokerRoom {
  return submitVote(params.room, {
    playerId: params.playerId,
    value: params.value,
  });
}

export function leavePlanningPokerRoom(params: {
  room: PlanningPokerRoom;
  playerId: string;
}): PlanningPokerRoom {
  return removeRoomMember(params.room, params.playerId);
}

export function revealRoomVotes(params: {
  room: PlanningPokerRoom;
  currentUserRole: PlanningPokerRole;
}): PlanningPokerRoom {
  if (!canFacilitateRoom(params.currentUserRole)) {
    return params.room;
  }

  return revealVotes(params.room);
}

export function resetRoomRound(params: {
  room: PlanningPokerRoom;
  currentUserRole: PlanningPokerRole;
}): PlanningPokerRoom {
  if (!canFacilitateRoom(params.currentUserRole)) {
    return params.room;
  }

  return resetRound(params.room);
}

export function selectRoomDeck(params: {
  room: PlanningPokerRoom;
  deck: PlanningPokerDeck;
  currentUserRole: PlanningPokerRole;
}): PlanningPokerRoom {
  if (!canFacilitateRoom(params.currentUserRole)) {
    return params.room;
  }

  return changeRoomDeck(params.room, params.deck);
}

export function updateCurrentStory(params: {
  room: PlanningPokerRoom;
  storyName: string;
  currentUserRole: PlanningPokerRole;
}): PlanningPokerRoom {
  if (!canFacilitateRoom(params.currentUserRole)) {
    return params.room;
  }

  return changeCurrentStory(params.room, params.storyName);
}

export function loadPendingStories(params: {
  room: PlanningPokerRoom;
  storiesInput: string;
  currentUserRole: PlanningPokerRole;
}): PlanningPokerRoom {
  if (!canFacilitateRoom(params.currentUserRole)) {
    return params.room;
  }

  return addPendingStories(params.room, parsePendingStories(params.storiesInput));
}

export function choosePendingStory(params: {
  room: PlanningPokerRoom;
  storyName: string;
  currentUserRole: PlanningPokerRole;
}): PlanningPokerRoom {
  if (!canFacilitateRoom(params.currentUserRole)) {
    return params.room;
  }

  return selectPendingStory(params.room, params.storyName);
}

export function advanceToNextPendingStory(params: {
  room: PlanningPokerRoom;
  currentUserRole: PlanningPokerRole;
}): PlanningPokerRoom {
  if (!canFacilitateRoom(params.currentUserRole)) {
    return params.room;
  }

  return selectNextPendingStory(params.room);
}

export function canUseFacilitatorControls(
  role: PlanningPokerRole,
): boolean {
  return canFacilitateRoom(role);
}
