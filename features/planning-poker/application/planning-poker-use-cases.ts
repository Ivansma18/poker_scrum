import {
  createPlanningPokerRoom,
  revealVotes,
  resetRound,
  submitVote,
  type PlanningPokerRoom,
  type VoteValue,
} from "../domain/planning-poker";

export function createDemoPlanningPokerRoom(): PlanningPokerRoom {
  return createPlanningPokerRoom({
    id: "demo-room",
    name: "Sprint planning",
    players: [
      { id: "ana", name: "Ana" },
      { id: "leo", name: "Leo" },
      { id: "mia", name: "Mia" },
      { id: "you", name: "You" },
    ],
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

export function revealRoomVotes(room: PlanningPokerRoom): PlanningPokerRoom {
  return revealVotes(room);
}

export function resetRoomRound(room: PlanningPokerRoom): PlanningPokerRoom {
  return resetRound(room);
}
