import type { PlanningPokerRoom } from "../domain/planning-poker";

export type PlanningPokerConnectionStatus =
  | "connected"
  | "reconnecting"
  | "disconnected";

export type PlanningPokerRoomSnapshot = {
  room: PlanningPokerRoom;
  updatedAt: number;
};

export type PlanningPokerRoomSubscription = {
  onSnapshot: (snapshot: PlanningPokerRoomSnapshot) => void;
  onConnectionStatusChange: (status: PlanningPokerConnectionStatus) => void;
};

export type PlanningPokerRoomRepository = {
  getRoomSnapshot: (
    roomId: PlanningPokerRoom["id"],
  ) => PlanningPokerRoomSnapshot | null;
  publishRoom: (room: PlanningPokerRoom) => void;
  subscribeToRoom: (
    roomId: PlanningPokerRoom["id"],
    subscription: PlanningPokerRoomSubscription,
  ) => () => void;
};
