import {
  planningPokerDeck,
  type VoteValue,
} from "../domain/planning-poker";

const storageKey = "planning-poker.local-state.v1";
let cachedStoredValue: string | null | undefined;
let cachedLocalState: LocalPlanningPokerState | null = null;

export type LocalPlanningPokerState = {
  playerName: string;
  roomCode: string;
  voteValue?: VoteValue;
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

    if (!isLocalPlanningPokerState(parsedValue)) {
      clearLocalPlanningPokerState();
      cachedLocalState = null;
      return null;
    }

    cachedLocalState = parsedValue;
    return parsedValue;
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

function isLocalPlanningPokerState(
  value: unknown,
): value is LocalPlanningPokerState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const state = value as Partial<Record<keyof LocalPlanningPokerState, unknown>>;

  return (
    typeof state.playerName === "string" &&
    state.playerName.trim().length > 0 &&
    typeof state.roomCode === "string" &&
    state.roomCode.trim().length > 0 &&
    (state.voteValue === undefined || isVoteValue(state.voteValue))
  );
}

function isVoteValue(value: unknown): value is VoteValue {
  return planningPokerDeck.some((card) => card === value);
}
