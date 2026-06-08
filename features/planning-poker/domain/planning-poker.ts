export const planningPokerDeck = ["1", "2", "3", "5", "8", "13", "21", "?", "coffee"] as const;

export type VoteValue = (typeof planningPokerDeck)[number];

export type Player = {
  id: string;
  name: string;
};

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
