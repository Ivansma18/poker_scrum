"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  createLocalPlanningPokerRoom,
  joinLocalPlanningPokerRoom,
  resetRoomRound,
  revealRoomVotes,
  selectRoomDeck,
  updateCurrentStory,
  voteInRoom,
} from "../application/planning-poker-use-cases";
import {
  canCreateCustomDeck,
  canCreateRoomWithName,
  canJoinWithPlayerName,
  canJoinWithRoomCode,
  createPlanningPokerDeck,
  getVoteForPlayer,
  normalizeStoryName,
  parseCustomDeckValues,
  type PlanningPokerRoom,
  type VoteValue,
} from "../domain/planning-poker";
import {
  clearLocalPlanningPokerState,
  loadLocalPlanningPokerState,
  saveLocalPlanningPokerState,
  subscribeToLocalPlanningPokerState,
} from "../infrastructure/local-planning-poker-state";

const currentPlayerId = "you";
type EntryMode = "create" | "join";

function getServerLocalPlanningPokerState() {
  return null;
}

type PlanningPokerBoardProps = {
  initialRoomCode?: string;
};

export function PlanningPokerBoard({
  initialRoomCode = "",
}: PlanningPokerBoardProps) {
  const [entryMode, setEntryMode] = useState<EntryMode>(
    initialRoomCode ? "join" : "create",
  );
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState(initialRoomCode);
  const [playerName, setPlayerName] = useState("");
  const [customDeckInput, setCustomDeckInput] = useState<string | null>(null);
  const [storyInput, setStoryInput] = useState<string | null>(null);
  const [inviteCopied, setInviteCopied] = useState(false);
  const [room, setRoom] = useState<PlanningPokerRoom | null>(null);
  const skipNextPersistence = useRef(false);
  const localState = useSyncExternalStore(
    subscribeToLocalPlanningPokerState,
    loadLocalPlanningPokerState,
    getServerLocalPlanningPokerState,
  );
  const restoredRoomCode = localState
    ? initialRoomCode || localState.roomCode
    : initialRoomCode;
  const restoredRoom = localState
    ? restoreLocalRoom({
        roomCode: restoredRoomCode,
        playerName: localState.playerName,
        voteValue: localState.voteValue,
        deck: localState.deck,
        currentStory: localState.currentStory,
        storyHistory: localState.storyHistory,
      })
    : null;
  const activeRoom = room ?? restoredRoom;

  useEffect(() => {
    if (!room) {
      return;
    }

    if (skipNextPersistence.current) {
      skipNextPersistence.current = false;
      return;
    }

    const currentPlayer = room.players.find(
      (player) => player.id === currentPlayerId,
    );

    if (!currentPlayer) {
      return;
    }

    const currentVote = getVoteForPlayer(room, currentPlayerId);

    saveLocalPlanningPokerState({
      playerName: currentPlayer.name,
      roomCode: room.id,
      voteValue: currentVote?.value,
      deck: room.deck,
      currentStory: room.currentStory,
      storyHistory: room.storyHistory,
    });
  }, [room]);

  if (!activeRoom) {
    const canSubmitCreate =
      canCreateRoomWithName(roomName) && canJoinWithPlayerName(playerName);
    const canSubmitJoin =
      canJoinWithRoomCode(roomCode) && canJoinWithPlayerName(playerName);
    const canSubmit = entryMode === "create" ? canSubmitCreate : canSubmitJoin;

    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0f172a] px-6 py-8 text-white">
        <form
          className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/30"
          onSubmit={(event) => {
            event.preventDefault();

            if (!canSubmit) {
              return;
            }

            setRoom(
              entryMode === "create"
                ? createLocalPlanningPokerRoom({
                    roomName,
                    currentPlayerName: playerName,
                  })
                : joinLocalPlanningPokerRoom({
                    roomCode,
                    currentPlayerName: playerName,
                  }),
            );
          }}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-700">
            Planning poker
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">
            {entryMode === "create" ? "Create a room" : "Join a room"}
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Start a planning poker session or enter an existing local room code.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-2 rounded-full bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setEntryMode("create")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                entryMode === "create"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setEntryMode("join")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                entryMode === "join"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              Join
            </button>
          </div>

          {entryMode === "create" ? (
            <>
              <label className="mt-6 block text-sm font-semibold" htmlFor="room-name">
                Room name
              </label>
              <input
                id="room-name"
                type="text"
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="Example: Sprint planning"
                autoComplete="off"
                autoFocus
              />
            </>
          ) : (
            <>
              <label className="mt-6 block text-sm font-semibold" htmlFor="room-code">
                Room code
              </label>
              <input
                id="room-code"
                type="text"
                value={roomCode}
                onChange={(event) => setRoomCode(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base uppercase outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                placeholder="Example: SPRINT"
                autoComplete="off"
                autoFocus
              />
            </>
          )}

          <label className="mt-5 block text-sm font-semibold" htmlFor="player-name">
            Your name
          </label>
          <input
            id="player-name"
            type="text"
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="Example: Alex"
            autoComplete="name"
          />

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 w-full rounded-full bg-cyan-400 px-6 py-3 font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            {entryMode === "create" ? "Create room" : "Join room"}
          </button>
        </form>
      </main>
    );
  }

  const activePlanningRoom = activeRoom;
  const currentVote = getVoteForPlayer(activePlanningRoom, currentPlayerId);
  const customDeckDraft =
    customDeckInput ??
    (activePlanningRoom.deck.kind === "custom"
      ? activePlanningRoom.deck.values.join(", ")
      : "");
  const canApplyCustomDeck = canCreateCustomDeck(customDeckDraft);
  const storyDraft = storyInput ?? activePlanningRoom.currentStory;
  const canApplyStory =
    normalizeStoryName(storyDraft) !== activePlanningRoom.currentStory;

  async function handleCopyInviteLink() {
    const inviteLink = `${window.location.origin}/?room=${encodeURIComponent(activePlanningRoom.id)}`;

    await navigator.clipboard.writeText(inviteLink);
    setInviteCopied(true);
  }

  function handleVote(value: VoteValue) {
    setRoom((currentRoom) =>
      voteInRoom({
        room: currentRoom ?? activePlanningRoom,
        playerId: currentPlayerId,
        value,
      }),
    );
  }

  function handleSelectPresetDeck(kind: "fibonacci" | "t-shirt") {
    setCustomDeckInput(null);
    setRoom((currentRoom) =>
      selectRoomDeck({
        room: currentRoom ?? activePlanningRoom,
        deck: createPlanningPokerDeck(kind),
      }),
    );
  }

  function handleApplyCustomDeck() {
    if (!canApplyCustomDeck) {
      return;
    }

    setRoom((currentRoom) =>
      selectRoomDeck({
        room: currentRoom ?? activePlanningRoom,
        deck: createPlanningPokerDeck(
          "custom",
          parseCustomDeckValues(customDeckDraft),
        ),
      }),
    );
  }

  function handleApplyStory() {
    if (!canApplyStory) {
      return;
    }

    setRoom((currentRoom) =>
      updateCurrentStory({
        room: currentRoom ?? activePlanningRoom,
        storyName: storyDraft,
      }),
    );
    setStoryInput(null);
  }

  return (
    <main className="min-h-screen bg-[#0f172a] px-6 py-8 text-white sm:px-10">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-200">
              Planning poker
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              {activeRoom.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-300">
              Vote privately, reveal estimates together, then reset the round for
              the next story.
            </p>
            <p className="mt-2 text-sm font-medium text-cyan-200">
              Room code: {activeRoom.id}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="rounded-2xl bg-black/30 px-5 py-4 text-sm text-slate-200">
              <span className="block text-2xl font-semibold text-white">
                {activeRoom.votes.length}/{activeRoom.players.length}
              </span>
              votes submitted
            </div>
            <button
              type="button"
              onClick={handleCopyInviteLink}
              className="rounded-full border border-cyan-200/50 px-5 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-200 hover:text-cyan-950"
            >
              {inviteCopied ? "Invite link copied" : "Copy invite link"}
            </button>
          </div>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-white/10 bg-white p-5 text-slate-950 shadow-2xl shadow-black/20 sm:p-6">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Estimation deck</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Active deck: {activePlanningRoom.deck.name}. Changing decks resets the round.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPresetDeck("fibonacci")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activePlanningRoom.deck.kind === "fibonacci"
                        ? "bg-slate-950 text-white"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Fibonacci
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectPresetDeck("t-shirt")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activePlanningRoom.deck.kind === "t-shirt"
                        ? "bg-slate-950 text-white"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    T-shirt sizes
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <label className="block text-sm font-semibold" htmlFor="custom-deck">
                    Custom deck
                  </label>
                  <textarea
                    id="custom-deck"
                    value={customDeckDraft}
                    onChange={(event) => setCustomDeckInput(event.target.value)}
                    className="mt-2 min-h-20 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    placeholder="Example: 0, 1, 2, 3, 5, 8, ?"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Use commas or line breaks. Duplicates are removed; up to 12 cards are kept.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!canApplyCustomDeck}
                  onClick={handleApplyCustomDeck}
                  className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  Apply custom
                </button>
              </div>
            </section>

            <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Current story</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {activePlanningRoom.currentStory || "No story selected"}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {activePlanningRoom.currentStory ? "Estimating" : "Empty"}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <label className="block text-sm font-semibold" htmlFor="current-story">
                    Story name or ID
                  </label>
                  <input
                    id="current-story"
                    type="text"
                    value={storyDraft}
                    onChange={(event) => setStoryInput(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    placeholder="Example: PROJ-123 Login flow"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Applying a different story clears the current votes.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!canApplyStory}
                  onClick={handleApplyStory}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  Apply story
                </button>
              </div>
            </section>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Choose your card</h2>
                <p className="text-sm text-slate-500">
                  Your current vote: {currentVote?.value ?? "none"}
                </p>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {activeRoom.revealed ? "Revealed" : "Voting"}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {activePlanningRoom.deck.values.map((card) => {
                const selected = currentVote?.value === card;

                return (
                  <button
                    key={card}
                    type="button"
                    disabled={activeRoom.revealed}
                    onClick={() => handleVote(card)}
                    className={`aspect-[3/4] rounded-2xl border text-2xl font-bold transition enabled:hover:-translate-y-1 enabled:hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 ${
                      selected
                        ? "border-cyan-400 bg-cyan-100 text-cyan-950 shadow-lg shadow-cyan-200"
                        : "border-slate-200 bg-white text-slate-900 shadow-sm"
                    }`}
                  >
                    {card === "coffee" ? "coffee" : card}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setRoom((currentRoom) =>
                    revealRoomVotes(currentRoom ?? activePlanningRoom),
                  )
                }
                className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-cyan-950 transition hover:bg-cyan-300"
              >
                Reveal votes
              </button>
              <button
                type="button"
                onClick={() =>
                  setRoom((currentRoom) => {
                    const roomToReset = currentRoom ?? activePlanningRoom;

                    if (!roomToReset) {
                      return currentRoom;
                    }

                    clearLocalPlanningPokerState();
                    skipNextPersistence.current = true;
                    return resetRoomRound(roomToReset);
                  })
                }
                className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Reset round
              </button>
            </div>
          </div>

          <aside className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
            <h2 className="text-2xl font-semibold">Players</h2>
            <div className="mt-5 flex flex-col gap-3">
              {activeRoom.players.map((player) => {
                const vote = getVoteForPlayer(activeRoom, player.id);

                return (
                  <div
                    key={player.id}
                    className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold">{player.name}</p>
                      <p className="text-sm text-slate-300">
                        {vote ? "Voted" : "Waiting"}
                      </p>
                    </div>
                    <div className="flex h-12 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-slate-950">
                      {activeRoom.revealed ? vote?.value ?? "-" : vote ? "ok" : "-"}
                    </div>
                  </div>
                );
              })}
            </div>

            <section className="mt-8 border-t border-white/10 pt-6">
              <h2 className="text-2xl font-semibold">Story history</h2>
              {activePlanningRoom.storyHistory.length === 0 ? (
                <p className="mt-3 text-sm text-slate-300">
                  Revealed stories will appear here after you replace them.
                </p>
              ) : (
                <div className="mt-5 flex flex-col gap-3">
                  {activePlanningRoom.storyHistory.map((entry, index) => (
                    <div
                      key={`${entry.storyName}-${index}`}
                      className="rounded-2xl bg-white/10 px-4 py-3"
                    >
                      <p className="font-semibold">{entry.storyName}</p>
                      <p className="mt-1 text-sm text-slate-300">{entry.result}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}

function restoreLocalRoom(params: {
  roomCode: string;
  playerName: string;
  voteValue?: VoteValue;
  deck: PlanningPokerRoom["deck"];
  currentStory: string;
  storyHistory: PlanningPokerRoom["storyHistory"];
}): PlanningPokerRoom {
  const restoredRoom = joinLocalPlanningPokerRoom({
    roomCode: params.roomCode,
    currentPlayerName: params.playerName,
    deck: params.deck,
    currentStory: params.currentStory,
    storyHistory: params.storyHistory,
  });

  return params.voteValue
    ? voteInRoom({
        room: restoredRoom,
        playerId: currentPlayerId,
        value: params.voteValue,
      })
    : restoredRoom;
}
