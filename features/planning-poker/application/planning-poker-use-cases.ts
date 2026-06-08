import {
  addPlayer,
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
  revealVotes,
  resetRound,
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
    deck: params.deck,
    currentStory: params.currentStory,
    storyHistory: params.storyHistory,
  });
}

export function joinLocalPlanningPokerRoom(params: {
  roomCode: string;
  currentPlayerName: string;
  currentPlayerId: string;
  deck?: PlanningPokerDeck;
  currentStory?: string;
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
      deck: params.deck,
      currentStory: params.currentStory,
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

  return addPlayer(params.room, {
    id: params.currentPlayerId,
    name: normalizePlayerName(params.currentPlayerName),
  });
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

export function canUseFacilitatorControls(
  role: PlanningPokerRole,
): boolean {
  return canFacilitateRoom(role);
}
