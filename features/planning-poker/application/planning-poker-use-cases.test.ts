import { describe, expect, test } from "vitest";
import { createPlanningPokerDeck } from "../domain/planning-poker";
import {
  advanceToNextPendingStory,
  canUseFacilitatorControls,
  choosePendingStory,
  createLocalPlanningPokerRoom,
  joinExistingPlanningPokerRoom,
  joinExistingPlanningPokerRoomAsSpectator,
  loadPendingStories,
  revealRoomVotes,
  selectRoomDeck,
  updateCurrentStory,
  voteInRoom,
} from "./planning-poker-use-cases";

describe("planning poker use cases", () => {
  test("creates local rooms with normalized names and room codes", () => {
    const room = createLocalPlanningPokerRoom({
      roomName: " Sprint planning ",
      currentPlayerName: " Ada   Lovelace ",
      currentPlayerId: "ada",
    });

    expect(room).toMatchObject({
      id: "SPRINT",
      name: "Sprint planning",
      players: [{ id: "ada", name: "Ada Lovelace" }],
    });
  });

  test("validates required room and player names", () => {
    expect(() =>
      createLocalPlanningPokerRoom({
        roomName: " ",
        currentPlayerName: "Ada",
        currentPlayerId: "ada",
      }),
    ).toThrow("A room name is required to create a room.");

    expect(() =>
      createLocalPlanningPokerRoom({
        roomName: "Sprint",
        currentPlayerName: " ",
        currentPlayerId: "ada",
      }),
    ).toThrow("A player name is required to join the room.");
  });

  test("joins existing rooms as participant or spectator", () => {
    const room = createLocalPlanningPokerRoom({
      roomName: "Sprint",
      currentPlayerName: "Ada",
      currentPlayerId: "ada",
    });
    const roomWithGrace = joinExistingPlanningPokerRoom({
      room,
      currentPlayerName: "Grace Hopper",
      currentPlayerId: "grace",
    });
    const roomWithSpectator = joinExistingPlanningPokerRoomAsSpectator({
      room: roomWithGrace,
      currentSpectatorName: "Linus",
      currentSpectatorId: "linus",
    });

    expect(roomWithSpectator.players.map((player) => player.id)).toEqual([
      "ada",
      "grace",
    ]);
    expect(roomWithSpectator.spectators).toEqual([{ id: "linus", name: "Linus" }]);
  });

  test("restricts facilitator-only actions", () => {
    const room = createLocalPlanningPokerRoom({
      roomName: "Sprint",
      currentPlayerName: "Ada",
      currentPlayerId: "ada",
    });
    const votedRoom = voteInRoom({ room, playerId: "ada", value: "5" });

    expect(canUseFacilitatorControls("facilitator")).toBe(true);
    expect(canUseFacilitatorControls("participant")).toBe(false);
    expect(revealRoomVotes({ room: votedRoom, currentUserRole: "participant" })).toBe(
      votedRoom,
    );
    expect(
      selectRoomDeck({
        room: votedRoom,
        deck: createPlanningPokerDeck("t-shirt"),
        currentUserRole: "spectator",
      }),
    ).toBe(votedRoom);

    const revealedRoom = revealRoomVotes({
      room: votedRoom,
      currentUserRole: "facilitator",
    });

    expect(revealedRoom.revealed).toBe(true);
  });

  test("loads and advances pending stories as facilitator", () => {
    const room = createLocalPlanningPokerRoom({
      roomName: "Sprint",
      currentPlayerName: "Ada",
      currentPlayerId: "ada",
    });

    const loadedRoom = loadPendingStories({
      room,
      storiesInput: "PROJ-1 Login\nPROJ-2 Checkout",
      currentUserRole: "facilitator",
    });
    const selectedRoom = choosePendingStory({
      room: loadedRoom,
      storyName: "PROJ-1 Login",
      currentUserRole: "facilitator",
    });
    const advancedRoom = advanceToNextPendingStory({
      room: selectedRoom,
      currentUserRole: "facilitator",
    });

    expect(loadedRoom.pendingStories).toEqual(["PROJ-1 Login", "PROJ-2 Checkout"]);
    expect(selectedRoom.currentStory).toBe("PROJ-1 Login");
    expect(advancedRoom.currentStory).toBe("PROJ-2 Checkout");
  });

  test("does not update story when current user is not facilitator", () => {
    const room = createLocalPlanningPokerRoom({
      roomName: "Sprint",
      currentPlayerName: "Ada",
      currentPlayerId: "ada",
    });

    expect(
      updateCurrentStory({
        room,
        storyName: "PROJ-1 Login",
        currentUserRole: "participant",
      }),
    ).toBe(room);
  });
});
