import { describe, expect, test } from "vitest";
import {
  addPendingStories,
  addPlayer,
  addSpectator,
  changeCurrentStory,
  changeRoomDeck,
  createPlanningPokerDeck,
  createPlanningPokerRoom,
  createRoomCodeFromName,
  getVoteForPlayer,
  parseCustomDeckValues,
  parsePendingStories,
  resetRound,
  revealVotes,
  submitVote,
  summarizeRevealedVotes,
} from "./planning-poker";

function createRoom() {
  return createPlanningPokerRoom({
    id: "SPRINT",
    name: "Sprint Planning",
    players: [
      { id: "ada", name: "Ada" },
      { id: "grace", name: "Grace" },
    ],
  });
}

describe("planning poker domain", () => {
  test("normalizes room codes, pending stories, and custom deck values", () => {
    expect(createRoomCodeFromName(" Sprint planning #42 ")).toBe("SPRINT");
    expect(parsePendingStories(" PROJ-1 Login \n\nPROJ-2 Checkout\nPROJ-1 Login ")).toEqual([
      "PROJ-1 Login",
      "PROJ-2 Checkout",
    ]);
    expect(parseCustomDeckValues(" 1, 2\n3, 2, coffee ")).toEqual([
      "1",
      "2",
      "3",
      "coffee",
    ]);
  });

  test("moves members between participant and spectator roles", () => {
    const roomWithSpectator = addSpectator(createRoom(), {
      id: "ada",
      name: "Ada Lovelace",
    });

    expect(roomWithSpectator.players.map((player) => player.id)).toEqual([
      "grace",
    ]);
    expect(roomWithSpectator.spectators).toEqual([
      { id: "ada", name: "Ada Lovelace" },
    ]);

    const roomWithPlayer = addPlayer(roomWithSpectator, {
      id: "ada",
      name: "Ada Lovelace",
    });

    expect(roomWithPlayer.players.map((player) => player.id)).toEqual([
      "grace",
      "ada",
    ]);
    expect(roomWithPlayer.spectators).toEqual([]);
  });

  test("accepts valid player votes and rejects spectators, invalid cards, and revealed rooms", () => {
    const room = createRoom();
    const roomWithSpectator = addSpectator(room, { id: "linus", name: "Linus" });
    const votedRoom = submitVote(roomWithSpectator, { playerId: "ada", value: "5" });

    expect(getVoteForPlayer(votedRoom, "ada")?.value).toBe("5");
    expect(submitVote(votedRoom, { playerId: "linus", value: "8" })).toBe(votedRoom);
    expect(submitVote(votedRoom, { playerId: "ada", value: "999" })).toBe(votedRoom);

    const revealedRoom = revealVotes(votedRoom);

    expect(submitVote(revealedRoom, { playerId: "grace", value: "8" })).toBe(
      revealedRoom,
    );
  });

  test("changing deck clears votes only when the deck changes", () => {
    const votedRoom = submitVote(createRoom(), { playerId: "ada", value: "5" });

    expect(changeRoomDeck(votedRoom, votedRoom.deck)).toBe(votedRoom);

    const nextRoom = changeRoomDeck(votedRoom, createPlanningPokerDeck("t-shirt"));

    expect(nextRoom.deck.kind).toBe("t-shirt");
    expect(nextRoom.votes).toEqual([]);
    expect(nextRoom.revealed).toBe(false);
  });

  test("stores revealed story results when moving to another story or resetting", () => {
    const room = addPendingStories(createRoom(), ["PROJ-1 Login", "PROJ-2 Checkout"]);
    const estimatingRoom = changeCurrentStory(room, "PROJ-1 Login");
    const votedRoom = submitVote(estimatingRoom, { playerId: "ada", value: "5" });
    const revealedRoom = revealVotes(votedRoom);
    const nextStoryRoom = changeCurrentStory(revealedRoom, "PROJ-2 Checkout");

    expect(nextStoryRoom.currentStory).toBe("PROJ-2 Checkout");
    expect(nextStoryRoom.pendingStories).toEqual(["PROJ-2 Checkout"]);
    expect(nextStoryRoom.storyHistory).toHaveLength(1);
    expect(nextStoryRoom.storyHistory[0]).toMatchObject({
      storyName: "PROJ-1 Login",
      result: "Ada: 5",
      deckName: "Fibonacci",
    });

    const resetRoomResult = resetRound(revealedRoom);

    expect(resetRoomResult.votes).toEqual([]);
    expect(resetRoomResult.revealed).toBe(false);
    expect(resetRoomResult.pendingStories).toEqual(["PROJ-2 Checkout"]);
    expect(resetRoomResult.storyHistory[0].storyName).toBe("PROJ-1 Login");
  });

  test("summarizes revealed votes with averages, ties, and high dispersion", () => {
    const votedRoom = [
      { playerId: "ada", value: "1" },
      { playerId: "grace", value: "13" },
    ].reduce(submitVote, createRoom());
    const summary = summarizeRevealedVotes(revealVotes(votedRoom));

    expect(summary).toMatchObject({
      voteCount: 2,
      majorityValues: ["1", "13"],
      average: 7,
      nonNumericValues: [],
      dispersion: "Numeric range: 12",
      hasHighDispersion: true,
    });
    expect(summary?.highDispersionReason).toBe("Numeric range is 12, at or above 8.");
  });

  test("summarizes non-numeric revealed votes without averaging", () => {
    const room = createPlanningPokerRoom({
      id: "CUSTOM",
      name: "Custom",
      players: [
        { id: "ada", name: "Ada" },
        { id: "grace", name: "Grace" },
        { id: "linus", name: "Linus" },
      ],
      deck: createPlanningPokerDeck("custom", ["S", "M", "L"]),
    });
    const votedRoom = [
      { playerId: "ada", value: "S" },
      { playerId: "grace", value: "M" },
      { playerId: "linus", value: "L" },
    ].reduce(submitVote, room);

    expect(summarizeRevealedVotes(revealVotes(votedRoom))).toMatchObject({
      average: undefined,
      nonNumericValues: ["S", "M", "L"],
      dispersion: "3 distinct vote values",
      hasHighDispersion: true,
      highDispersionReason: "3 distinct vote values were revealed.",
    });
  });
});
