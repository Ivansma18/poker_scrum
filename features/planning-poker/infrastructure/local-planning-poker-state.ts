import {
  createPlanningPokerDeck,
  isVoteValueInDeck,
  type PlanningPokerDeck,
  type PlanningPokerDeckKind,
  type PlanningPokerRole,
  type StoryHistoryEntry,
  type VoteValue,
} from "../domain/planning-poker";

const storageKey = "planning-poker.local-state.v1";
let cachedStoredValue: string | null | undefined;
let cachedLocalState: LocalPlanningPokerState | null = null;

export type LocalPlanningPokerState = {
  playerName: string;
  roomCode: string;
  voteValue?: VoteValue;
  deck: PlanningPokerDeck;
  currentUserRole: PlanningPokerRole;
  currentStory: string;
  storyHistory: StoryHistoryEntry[];
};

export function loadLocalPlanningPokerState(): LocalPlanningPokerState | null {
  const storedValue = window.localStorage.getItem(storageKey);

  if (storedValue === cachedStoredValue) {
    return cachedLocalState;
  }

  cachedStoredValue = storedValue;

  if (!storedValue) {
    cachedLocalState = null;
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);
    const localState = parseLocalPlanningPokerState(parsedValue);

    if (!localState) {
      clearLocalPlanningPokerState();
      cachedLocalState = null;
      return null;
    }

    cachedLocalState = localState;
    return localState;
  } catch {
    clearLocalPlanningPokerState();
    cachedLocalState = null;
    return null;
  }
}

export function saveLocalPlanningPokerState(
  state: LocalPlanningPokerState,
): void {
  const storedValue = JSON.stringify(state);

  cachedStoredValue = storedValue;
  cachedLocalState = state;
  window.localStorage.setItem(storageKey, storedValue);
}

export function clearLocalPlanningPokerState(): void {
  cachedStoredValue = null;
  cachedLocalState = null;
  window.localStorage.removeItem(storageKey);
}

export function subscribeToLocalPlanningPokerState(
  onStoreChange: () => void,
): () => void {
  function handleStorageEvent(event: StorageEvent) {
    if (event.key === storageKey) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorageEvent);

  return () => window.removeEventListener("storage", handleStorageEvent);
}

function parseLocalPlanningPokerState(
  value: unknown,
): LocalPlanningPokerState | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const state = value as Partial<Record<keyof LocalPlanningPokerState, unknown>>;
  const deck = parsePlanningPokerDeck(state.deck);

  if (
    typeof state.playerName !== "string" ||
    state.playerName.trim().length === 0 ||
    typeof state.roomCode !== "string" ||
    state.roomCode.trim().length === 0 ||
    !deck
  ) {
    return null;
  }

  if (
    state.voteValue !== undefined &&
    (typeof state.voteValue !== "string" ||
      !isVoteValueInDeck(deck, state.voteValue))
  ) {
    return null;
  }

  return {
    playerName: state.playerName,
    roomCode: state.roomCode,
    voteValue: state.voteValue,
    deck,
    currentUserRole: parsePlanningPokerRole(state.currentUserRole),
    currentStory:
      typeof state.currentStory === "string" ? state.currentStory : "",
    storyHistory: parseStoryHistory(state.storyHistory),
  };
}

function parseStoryHistory(value: unknown): StoryHistoryEntry[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((entry): StoryHistoryEntry[] => {
    if (!entry || typeof entry !== "object") {
      return [];
    }

    const storyEntry = entry as Partial<
      Record<keyof StoryHistoryEntry, unknown>
    >;

    if (
      typeof storyEntry.storyName !== "string" ||
      storyEntry.storyName.trim().length === 0 ||
      typeof storyEntry.result !== "string" ||
      storyEntry.result.trim().length === 0
    ) {
      return [];
    }

    return [
      {
        storyName: storyEntry.storyName,
        result: storyEntry.result,
      },
    ];
  });
}

function parsePlanningPokerRole(value: unknown): PlanningPokerRole {
  return value === "facilitator" ? "facilitator" : "participant";
}

function parsePlanningPokerDeck(value: unknown): PlanningPokerDeck | null {
  if (!value || typeof value !== "object") {
    return createPlanningPokerDeck("fibonacci");
  }

  const deck = value as Partial<Record<keyof PlanningPokerDeck, unknown>>;

  if (!isPlanningPokerDeckKind(deck.kind)) {
    return null;
  }

  if (deck.kind === "custom") {
    if (!Array.isArray(deck.values)) {
      return null;
    }

    return createPlanningPokerDeck(
      "custom",
      deck.values.filter((card): card is string => typeof card === "string"),
    );
  }

  return createPlanningPokerDeck(deck.kind);
}

function isPlanningPokerDeckKind(
  value: unknown,
): value is PlanningPokerDeckKind {
  return value === "fibonacci" || value === "t-shirt" || value === "custom";
}
