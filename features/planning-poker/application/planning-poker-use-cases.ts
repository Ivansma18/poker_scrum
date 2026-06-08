import {
  addPlayer,
  canCreateRoomWithName,
  canJoinWithPlayerName,
  canJoinWithRoomCode,
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
  type PlanningPokerRoom,
  type VoteValue,
} from "../domain/planning-poker";

export function createLocalPlanningPokerRoom(params: {
  roomName: string;
  currentPlayerName: string;
  deck?: PlanningPokerDeck;
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
    players: [{ id: "you", name: normalizePlayerName(params.currentPlayerName) }],
    deck: params.deck,
  });
}

export function joinLocalPlanningPokerRoom(params: {
  roomCode: string;
  currentPlayerName: string;
  deck?: PlanningPokerDeck;
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
    }),
    { id: "you", name: normalizePlayerName(params.currentPlayerName) },
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

export function revealRoomVotes(room: PlanningPokerRoom): PlanningPokerRoom {
  return revealVotes(room);
}

export function resetRoomRound(room: PlanningPokerRoom): PlanningPokerRoom {
  return resetRound(room);
}

export function selectRoomDeck(params: {
  room: PlanningPokerRoom;
  deck: PlanningPokerDeck;
}): PlanningPokerRoom {
  return changeRoomDeck(params.room, params.deck);
}
