export const planningPokerDeck = ["1", "2", "3", "5", "8", "13", "21", "?", "coffee"] as const;

export type VoteValue = (typeof planningPokerDeck)[number];

export type Player = {
  id: string;
  name: string;
};

export function normalizePlayerName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function normalizeRoomName(name: string): string {
  return name.trim().replace(/\s+/g, " ");
}

export function normalizeRoomCode(code: string): string {
  return code.trim().replace(/\s+/g, "").toUpperCase();
}

export type Vote = {
  playerId: Player["id"];
  value: VoteValue;
};

export type PlanningPokerRoom = {
  id: string;
  name: string;
  players: Player[];
  votes: Vote[];
  revealed: boolean;
};

export function createPlanningPokerRoom(params: {
  id: string;
  name: string;
  players: Player[];
}): PlanningPokerRoom {
  return {
    id: params.id,
    name: params.name,
    players: params.players,
    votes: [],
    revealed: false,
  };
}

export function canJoinWithPlayerName(name: string): boolean {
  return normalizePlayerName(name).length > 0;
}

export function canCreateRoomWithName(name: string): boolean {
  return normalizeRoomName(name).length > 0;
}

export function canJoinWithRoomCode(code: string): boolean {
  return normalizeRoomCode(code).length > 0;
}

export function createRoomCodeFromName(name: string): string {
  const code = normalizeRoomName(name).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  return code.slice(0, 6) || "ROOM";
}

export function addPlayer(
  room: PlanningPokerRoom,
  player: Player,
): PlanningPokerRoom {
  const playerExists = room.players.some(
    (currentPlayer) => currentPlayer.id === player.id,
  );

  if (playerExists) {
    return room;
  }

  return {
    ...room,
    players: [...room.players, player],
  };
}

export function submitVote(
  room: PlanningPokerRoom,
  vote: Vote,
): PlanningPokerRoom {
  if (room.revealed) {
    return room;
  }

  const playerExists = room.players.some((player) => player.id === vote.playerId);

  if (!playerExists) {
    return room;
  }

  return {
    ...room,
    votes: [
      ...room.votes.filter((currentVote) => currentVote.playerId !== vote.playerId),
      vote,
    ],
  };
}

export function revealVotes(room: PlanningPokerRoom): PlanningPokerRoom {
  return {
    ...room,
    revealed: true,
  };
}

export function resetRound(room: PlanningPokerRoom): PlanningPokerRoom {
  return {
    ...room,
    votes: [],
    revealed: false,
  };
}

export function getVoteForPlayer(
  room: PlanningPokerRoom,
  playerId: Player["id"],
): Vote | undefined {
  return room.votes.find((vote) => vote.playerId === playerId);
}
