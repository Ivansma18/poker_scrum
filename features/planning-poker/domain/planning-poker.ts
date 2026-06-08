export const fibonacciPlanningPokerCards = [
  "1",
  "2",
  "3",
  "5",
  "8",
  "13",
  "21",
  "?",
  "coffee",
] as const;

export const tShirtPlanningPokerCards = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "?",
  "coffee",
] as const;

export const planningPokerDeck = fibonacciPlanningPokerCards;
export const customDeckMaxCards = 12;

export type VoteValue = string;
export type PlanningPokerDeckKind = "fibonacci" | "t-shirt" | "custom";

export type PlanningPokerDeck = {
  kind: PlanningPokerDeckKind;
  name: string;
  values: VoteValue[];
};

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

export function normalizeDeckValue(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function parseCustomDeckValues(input: string): VoteValue[] {
  const values = input
    .split(/[\n,]/)
    .map(normalizeDeckValue)
    .filter((value) => value.length > 0);

  return Array.from(new Set(values)).slice(0, customDeckMaxCards);
}

export function createPlanningPokerDeck(
  kind: PlanningPokerDeckKind,
  customValues: VoteValue[] = [],
): PlanningPokerDeck {
  if (kind === "t-shirt") {
    return {
      kind,
      name: "T-shirt sizes",
      values: [...tShirtPlanningPokerCards],
    };
  }

  if (kind === "custom") {
    const values = Array.from(
      new Set(customValues.map(normalizeDeckValue).filter(Boolean)),
    ).slice(0, customDeckMaxCards);

    if (values.length === 0) {
      throw new Error("A custom deck requires at least one card.");
    }

    return {
      kind,
      name: "Custom",
      values,
    };
  }

  return {
    kind: "fibonacci",
    name: "Fibonacci",
    values: [...fibonacciPlanningPokerCards],
  };
}

export const defaultPlanningPokerDeck = createPlanningPokerDeck("fibonacci");

export function canCreateCustomDeck(input: string): boolean {
  return parseCustomDeckValues(input).length > 0;
}

export function isVoteValueInDeck(
  deck: PlanningPokerDeck,
  value: VoteValue,
): boolean {
  return deck.values.some((card) => card === value);
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
  deck: PlanningPokerDeck;
};

export function createPlanningPokerRoom(params: {
  id: string;
  name: string;
  players: Player[];
  deck?: PlanningPokerDeck;
}): PlanningPokerRoom {
  return {
    id: params.id,
    name: params.name,
    players: params.players,
    votes: [],
    revealed: false,
    deck: params.deck ?? defaultPlanningPokerDeck,
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
  if (room.revealed || !isVoteValueInDeck(room.deck, vote.value)) {
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

export function changeRoomDeck(
  room: PlanningPokerRoom,
  deck: PlanningPokerDeck,
): PlanningPokerRoom {
  if (arePlanningPokerDecksEqual(room.deck, deck)) {
    return room;
  }

  return {
    ...room,
    deck,
    votes: [],
    revealed: false,
  };
}

function arePlanningPokerDecksEqual(
  firstDeck: PlanningPokerDeck,
  secondDeck: PlanningPokerDeck,
): boolean {
  return (
    firstDeck.kind === secondDeck.kind &&
    firstDeck.values.length === secondDeck.values.length &&
    firstDeck.values.every((value, index) => value === secondDeck.values[index])
  );
}

export function getVoteForPlayer(
  room: PlanningPokerRoom,
  playerId: Player["id"],
): Vote | undefined {
  return room.votes.find((vote) => vote.playerId === playerId);
}
