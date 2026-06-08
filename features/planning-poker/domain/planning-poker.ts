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
export const highNumericDispersionThreshold = 8;
export const highDistinctVoteDispersionThreshold = 3;

export type VoteValue = string;
export type PlanningPokerDeckKind = "fibonacci" | "t-shirt" | "custom";
export type PlanningPokerRole = "facilitator" | "participant";

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

export function normalizeStoryName(storyName: string): string {
  return storyName.trim().replace(/\s+/g, " ");
}

export function parsePendingStories(input: string): string[] {
  const stories = input
    .split("\n")
    .map(normalizeStoryName)
    .filter((storyName) => storyName.length > 0);

  return Array.from(new Set(stories));
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

export type StoryHistoryEntry = {
  storyName: string;
  result: string;
  deckName: string;
  recordedAt: string;
};

export type RevealedVoteSummary = {
  voteCount: number;
  majorityValues: VoteValue[];
  average?: number;
  nonNumericValues: VoteValue[];
  dispersion: string;
  hasMajorityTie: boolean;
  hasHighDispersion: boolean;
  highDispersionReason?: string;
};

export function canFacilitateRoom(role: PlanningPokerRole): boolean {
  return role === "facilitator";
}

export type PlanningPokerRoom = {
  id: string;
  name: string;
  players: Player[];
  votes: Vote[];
  revealed: boolean;
  deck: PlanningPokerDeck;
  currentStory: string;
  pendingStories: string[];
  storyHistory: StoryHistoryEntry[];
};

export function createPlanningPokerRoom(params: {
  id: string;
  name: string;
  players: Player[];
  deck?: PlanningPokerDeck;
  currentStory?: string;
  pendingStories?: string[];
  storyHistory?: StoryHistoryEntry[];
}): PlanningPokerRoom {
  return {
    id: params.id,
    name: params.name,
    players: params.players,
    votes: [],
    revealed: false,
    deck: params.deck ?? defaultPlanningPokerDeck,
    currentStory: normalizeStoryName(params.currentStory ?? ""),
    pendingStories: normalizePendingStories(params.pendingStories ?? []),
    storyHistory: params.storyHistory ?? [],
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

export function removePlayer(
  room: PlanningPokerRoom,
  playerId: Player["id"],
): PlanningPokerRoom {
  return {
    ...room,
    players: room.players.filter((player) => player.id !== playerId),
    votes: room.votes.filter((vote) => vote.playerId !== playerId),
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
  const storyHistory = shouldStoreCurrentStoryResult(room)
    ? [createStoryHistoryEntry(room), ...room.storyHistory]
    : room.storyHistory;

  return {
    ...room,
    votes: [],
    revealed: false,
    pendingStories: shouldStoreCurrentStoryResult(room)
      ? removePendingStory(getPendingStories(room), room.currentStory)
      : getPendingStories(room),
    storyHistory,
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

export function changeCurrentStory(
  room: PlanningPokerRoom,
  storyName: string,
): PlanningPokerRoom {
  const normalizedStoryName = normalizeStoryName(storyName);
  const shouldStoreRound = shouldStoreCurrentStoryResult(room);

  if (room.currentStory === normalizedStoryName) {
    return room;
  }

  return {
    ...room,
    currentStory: normalizedStoryName,
    votes: [],
    revealed: false,
    pendingStories: shouldStoreRound
      ? removePendingStory(getPendingStories(room), room.currentStory)
      : getPendingStories(room),
    storyHistory: shouldStoreRound
      ? [createStoryHistoryEntry(room), ...room.storyHistory]
      : room.storyHistory,
  };
}

export function addPendingStories(
  room: PlanningPokerRoom,
  stories: string[],
): PlanningPokerRoom {
  return {
    ...room,
    pendingStories: normalizePendingStories([...getPendingStories(room), ...stories]),
  };
}

export function selectPendingStory(
  room: PlanningPokerRoom,
  storyName: string,
): PlanningPokerRoom {
  const normalizedStoryName = normalizeStoryName(storyName);

  if (!getPendingStories(room).includes(normalizedStoryName)) {
    return room;
  }

  return changeCurrentStory(room, normalizedStoryName);
}

export function selectNextPendingStory(room: PlanningPokerRoom): PlanningPokerRoom {
  const nextStory =
    getPendingStories(room).find((story) => story !== room.currentStory) ??
    getPendingStories(room)[0];

  return nextStory ? selectPendingStory(room, nextStory) : room;
}

function normalizePendingStories(stories: string[]): string[] {
  return Array.from(new Set(stories.map(normalizeStoryName).filter(Boolean)));
}

function getPendingStories(room: PlanningPokerRoom): string[] {
  return room.pendingStories ?? [];
}

function removePendingStory(stories: string[], storyName: string): string[] {
  const normalizedStoryName = normalizeStoryName(storyName);

  return stories.filter((story) => story !== normalizedStoryName);
}

function shouldStoreCurrentStoryResult(room: PlanningPokerRoom): boolean {
  return room.currentStory.length > 0 && room.revealed && room.votes.length > 0;
}

function createStoryHistoryEntry(room: PlanningPokerRoom): StoryHistoryEntry {
  return {
    storyName: room.currentStory,
    deckName: room.deck.name,
    recordedAt: new Date().toISOString(),
    result: room.votes
      .map((vote) => {
        const player = room.players.find(
          (currentPlayer) => currentPlayer.id === vote.playerId,
        );

        return `${player?.name ?? vote.playerId}: ${vote.value}`;
      })
      .join(", "),
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

export function summarizeRevealedVotes(
  room: PlanningPokerRoom,
): RevealedVoteSummary | null {
  if (!room.revealed) {
    return null;
  }

  if (room.votes.length === 0) {
    return {
      voteCount: 0,
      majorityValues: [],
      nonNumericValues: [],
      dispersion: "No votes revealed",
      hasMajorityTie: false,
      hasHighDispersion: false,
    };
  }

  const numericValues: number[] = [];
  const nonNumericValues: VoteValue[] = [];
  const voteCounts = new Map<VoteValue, number>();

  for (const vote of room.votes) {
    const numericValue = Number(vote.value);

    if (Number.isFinite(numericValue) && vote.value.trim() !== "") {
      numericValues.push(numericValue);
    } else {
      nonNumericValues.push(vote.value);
    }

    voteCounts.set(vote.value, (voteCounts.get(vote.value) ?? 0) + 1);
  }

  const highestVoteCount = Math.max(...voteCounts.values());
  const majorityValues = Array.from(voteCounts.entries())
    .filter(([, count]) => count === highestVoteCount)
    .map(([value]) => value);
  const hasMajorityTie = highestVoteCount > 1 && majorityValues.length > 1;
  const average =
    numericValues.length > 0
      ? roundToTwoDecimals(
          numericValues.reduce((total, value) => total + value, 0) /
            numericValues.length,
        )
      : undefined;

  const highDispersionReason = getHighDispersionReason(
    numericValues,
    voteCounts.size,
  );

  return {
    voteCount: room.votes.length,
    majorityValues,
    average,
    nonNumericValues: Array.from(new Set(nonNumericValues)),
    dispersion: describeVoteDispersion(numericValues, voteCounts.size),
    hasMajorityTie,
    hasHighDispersion: highDispersionReason !== undefined,
    highDispersionReason,
  };
}

function getHighDispersionReason(
  numericValues: number[],
  distinctVoteCount: number,
): string | undefined {
  if (numericValues.length >= 2) {
    const range = Math.max(...numericValues) - Math.min(...numericValues);

    if (range >= highNumericDispersionThreshold) {
      return `Numeric range is ${roundToTwoDecimals(range)}, at or above ${highNumericDispersionThreshold}.`;
    }

    return undefined;
  }

  if (distinctVoteCount >= highDistinctVoteDispersionThreshold) {
    return `${distinctVoteCount} distinct vote values were revealed.`;
  }

  return undefined;
}

function describeVoteDispersion(
  numericValues: number[],
  distinctVoteCount: number,
): string {
  if (numericValues.length >= 2) {
    const range = Math.max(...numericValues) - Math.min(...numericValues);

    return `Numeric range: ${roundToTwoDecimals(range)}`;
  }

  if (distinctVoteCount <= 1) {
    return "High agreement";
  }

  return `${distinctVoteCount} distinct vote values`;
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
