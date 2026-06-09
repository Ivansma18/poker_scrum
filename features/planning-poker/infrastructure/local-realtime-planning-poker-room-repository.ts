import type {
  PlanningPokerConnectionStatus,
  PlanningPokerRoomRepository,
  PlanningPokerRoomSnapshot,
  PlanningPokerRoomSubscription,
} from "../application/planning-poker-room-repository";
import type { PlanningPokerRoom } from "../domain/planning-poker";

const channelName = "planning-poker.room-sync.v1";
const storageKeyPrefix = "planning-poker.shared-room.v1.";

type RoomMessage = PlanningPokerRoomSnapshot & {
  sourceId: string;
};

class LocalRealtimePlanningPokerRoomRepository
  implements PlanningPokerRoomRepository
{
  private channel: BroadcastChannel | null = null;
  private readonly sourceId = crypto.randomUUID();
  private readonly lastPublishedRooms = new Map<string, string>();

  getRoomSnapshot(roomId: PlanningPokerRoom["id"]): PlanningPokerRoomSnapshot | null {
    return readStoredSnapshot(roomId);
  }

  publishRoom(room: PlanningPokerRoom): void {
    const snapshot: PlanningPokerRoomSnapshot = {
      room,
      updatedAt: Date.now(),
    };
    const storedValue = JSON.stringify(snapshot);
    const storageKey = getRoomStorageKey(room.id);

    if (this.lastPublishedRooms.get(room.id) === storedValue) {
      return;
    }

    this.lastPublishedRooms.set(room.id, storedValue);
    window.localStorage.setItem(storageKey, storedValue);
    this.getChannel()?.postMessage({ ...snapshot, sourceId: this.sourceId });
  }

  subscribeToRoom(
    roomId: PlanningPokerRoom["id"],
    subscription: PlanningPokerRoomSubscription,
  ): () => void {
    let status: PlanningPokerConnectionStatus = "connected";
    const channel = this.getChannel();

    function emitStatus(nextStatus: PlanningPokerConnectionStatus) {
      if (status !== nextStatus) {
        status = nextStatus;
        subscription.onConnectionStatusChange(nextStatus);
      }
    }

    subscription.onConnectionStatusChange(status);

    const storedSnapshot = readStoredSnapshot(roomId);

    if (storedSnapshot) {
      subscription.onSnapshot(storedSnapshot);
    }

    function handleMessage(event: MessageEvent<RoomMessage>) {
      const message = event.data;

      if (!isRoomMessage(message) || message.room.id !== roomId) {
        return;
      }

        subscription.onSnapshot(normalizeRoomSnapshot(message));
    }

    function handleOffline() {
      emitStatus("disconnected");
    }

    function handleOnline() {
      emitStatus("reconnecting");
      const latestSnapshot = readStoredSnapshot(roomId);

      if (latestSnapshot) {
        subscription.onSnapshot(latestSnapshot);
      }

      emitStatus("connected");
    }

    channel?.addEventListener("message", handleMessage);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      channel?.removeEventListener("message", handleMessage);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }

  private getChannel(): BroadcastChannel | null {
    if (!("BroadcastChannel" in window)) {
      return null;
    }

    this.channel ??= new BroadcastChannel(channelName);

    return this.channel;
  }
}

let repository: PlanningPokerRoomRepository | null = null;

export function getLocalRealtimePlanningPokerRoomRepository(): PlanningPokerRoomRepository {
  repository ??= new LocalRealtimePlanningPokerRoomRepository();

  return repository;
}

function getRoomStorageKey(roomId: PlanningPokerRoom["id"]): string {
  return `${storageKeyPrefix}${roomId}`;
}

function readStoredSnapshot(
  roomId: PlanningPokerRoom["id"],
): PlanningPokerRoomSnapshot | null {
  const storedValue = window.localStorage.getItem(getRoomStorageKey(roomId));

  if (!storedValue) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    return isRoomSnapshot(parsedValue) ? normalizeRoomSnapshot(parsedValue) : null;
  } catch {
    return null;
  }
}

function isRoomMessage(value: unknown): value is RoomMessage {
  return isRoomSnapshot(value);
}

function isRoomSnapshot(value: unknown): value is PlanningPokerRoomSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const snapshot = value as Partial<PlanningPokerRoomSnapshot>;

  return (
    typeof snapshot.updatedAt === "number" &&
    !!snapshot.room &&
    typeof snapshot.room === "object" &&
    typeof snapshot.room.id === "string"
  );
}

function normalizeRoomSnapshot(
  snapshot: PlanningPokerRoomSnapshot,
): PlanningPokerRoomSnapshot {
  return {
    ...snapshot,
    room: {
      ...snapshot.room,
      pendingStories: snapshot.room.pendingStories ?? [],
      spectators: snapshot.room.spectators ?? [],
      storyHistory: snapshot.room.storyHistory ?? [],
    },
  };
}
