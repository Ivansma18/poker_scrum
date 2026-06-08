"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  canUseFacilitatorControls,
  createLocalPlanningPokerRoom,
  joinExistingPlanningPokerRoom,
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
  normalizeRoomCode,
  normalizeStoryName,
  parseCustomDeckValues,
  summarizeRevealedVotes,
  type PlanningPokerRole,
  type PlanningPokerRoom,
  type VoteValue,
} from "../domain/planning-poker";
import {
  loadLocalPlanningPokerState,
  saveLocalPlanningPokerState,
  subscribeToLocalPlanningPokerState,
} from "../infrastructure/local-planning-poker-state";
import type { PlanningPokerConnectionStatus } from "../application/planning-poker-room-repository";
import { getLocalRealtimePlanningPokerRoomRepository } from "../infrastructure/local-realtime-planning-poker-room-repository";

const facilitatorPermissionMessage = "Only facilitators can use this control.";
const localPlayerIdKey = "planning-poker.player-id.v1";
type EntryMode = "create" | "join";

function getServerLocalPlanningPokerState() {
  return null;
}

function getInitialCurrentUserRole(): PlanningPokerRole {
  if (typeof window === "undefined") {
    return "participant";
  }

  return loadLocalPlanningPokerState()?.currentUserRole ?? "participant";
}

function getInitialCurrentPlayerId(): string {
  if (typeof window === "undefined") {
    return "you";
  }

  const localState = loadLocalPlanningPokerState();

  if (localState?.playerId) {
    return localState.playerId;
  }

  const storedPlayerId = window.sessionStorage.getItem(localPlayerIdKey);

  if (storedPlayerId) {
    return storedPlayerId;
  }

  const playerId = crypto.randomUUID();

  window.sessionStorage.setItem(localPlayerIdKey, playerId);

  return playerId;
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
  const [currentPlayerId] = useState(getInitialCurrentPlayerId);
  const [customDeckInput, setCustomDeckInput] = useState<string | null>(null);
  const [storyInput, setStoryInput] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<PlanningPokerConnectionStatus>("disconnected");
  const [currentUserRole, setCurrentUserRole] = useState<PlanningPokerRole>(
    getInitialCurrentUserRole,
  );
  const [inviteCopied, setInviteCopied] = useState(false);
  const [room, setRoom] = useState<PlanningPokerRoom | null>(null);
  const skipNextRoomPublish = useRef(false);
  const roomRepository = getLocalRealtimePlanningPokerRoomRepository();
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
        currentPlayerId,
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

    const currentPlayer = room.players.find(
      (player) => player.id === currentPlayerId,
    );

    if (!currentPlayer) {
      return;
    }

    const currentVote = getVoteForPlayer(room, currentPlayerId);

    saveLocalPlanningPokerState({
      playerId: currentPlayerId,
      playerName: currentPlayer.name,
      roomCode: room.id,
      voteValue: currentVote?.value,
      deck: room.deck,
      currentUserRole,
      currentStory: room.currentStory,
      storyHistory: room.storyHistory,
    });
  }, [currentPlayerId, currentUserRole, room]);

  useEffect(() => {
    if (!activeRoom) {
      return;
    }

    return roomRepository.subscribeToRoom(activeRoom.id, {
      onSnapshot: (snapshot) => {
        if (snapshot.room.id !== activeRoom.id) {
          return;
        }

        skipNextRoomPublish.current = true;
        setRoom(snapshot.room);
      },
      onConnectionStatusChange: setConnectionStatus,
    });
  }, [activeRoom, roomRepository]);

  useEffect(() => {
    if (!room) {
      return;
    }

    if (skipNextRoomPublish.current) {
      skipNextRoomPublish.current = false;
      return;
    }

    roomRepository.publishRoom(room);
  }, [room, roomRepository]);

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

            const nextRole = entryMode === "create" ? "facilitator" : "participant";

            setCurrentUserRole(nextRole);
            setRoom(
              entryMode === "create"
                ? createLocalPlanningPokerRoom({
                    roomName,
                    currentPlayerName: playerName,
                    currentPlayerId,
                  })
                : joinSharedRoom({
                    roomCode,
                    currentPlayerName: playerName,
                    currentPlayerId,
                    roomRepository,
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
  const canUseFacilitatorActions = canUseFacilitatorControls(currentUserRole);
  const currentVote = getVoteForPlayer(activePlanningRoom, currentPlayerId);
  const voteSummary = summarizeRevealedVotes(activePlanningRoom);
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
    if (!canUseFacilitatorActions) {
      return;
    }

    setCustomDeckInput(null);
    setRoom((currentRoom) =>
      selectRoomDeck({
        room: currentRoom ?? activePlanningRoom,
        deck: createPlanningPokerDeck(kind),
        currentUserRole,
      }),
    );
  }

  function handleApplyCustomDeck() {
    if (!canApplyCustomDeck || !canUseFacilitatorActions) {
      return;
    }

    setRoom((currentRoom) =>
      selectRoomDeck({
        room: currentRoom ?? activePlanningRoom,
        deck: createPlanningPokerDeck(
          "custom",
          parseCustomDeckValues(customDeckDraft),
        ),
        currentUserRole,
      }),
    );
  }

  function handleApplyStory() {
    if (!canApplyStory || !canUseFacilitatorActions) {
      return;
    }

    setRoom((currentRoom) =>
      updateCurrentStory({
        room: currentRoom ?? activePlanningRoom,
        storyName: storyDraft,
        currentUserRole,
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
            <p className="mt-1 text-sm font-medium text-slate-300">
              Your role: {currentUserRole}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-300">
              Connection: {connectionStatus}
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
                    disabled={!canUseFacilitatorActions}
                    onClick={() => handleSelectPresetDeck("fibonacci")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activePlanningRoom.deck.kind === "fibonacci"
                        ? "bg-slate-950 text-white"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
                    }`}
                    title={
                      canUseFacilitatorActions ? undefined : facilitatorPermissionMessage
                    }
                  >
                    Fibonacci
                  </button>
                  <button
                    type="button"
                    disabled={!canUseFacilitatorActions}
                    onClick={() => handleSelectPresetDeck("t-shirt")}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activePlanningRoom.deck.kind === "t-shirt"
                        ? "bg-slate-950 text-white"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
                    }`}
                    title={
                      canUseFacilitatorActions ? undefined : facilitatorPermissionMessage
                    }
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
                    disabled={!canUseFacilitatorActions}
                    value={customDeckDraft}
                    onChange={(event) => setCustomDeckInput(event.target.value)}
                    className="mt-2 min-h-20 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    placeholder="Example: 0, 1, 2, 3, 5, 8, ?"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Use commas or line breaks. Duplicates are removed; up to 12 cards are kept.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!canApplyCustomDeck || !canUseFacilitatorActions}
                  onClick={handleApplyCustomDeck}
                  className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  Apply custom
                </button>
              </div>
              {!canUseFacilitatorActions ? (
                <p className="mt-3 text-sm font-medium text-slate-500">
                  {facilitatorPermissionMessage}
                </p>
              ) : null}
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
                    disabled={!canUseFacilitatorActions}
                    type="text"
                    value={storyDraft}
                    onChange={(event) => setStoryInput(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    placeholder="Example: PROJ-123 Login flow"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Applying a different story clears the current votes.
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!canApplyStory || !canUseFacilitatorActions}
                  onClick={handleApplyStory}
                  className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  Apply story
                </button>
              </div>
              {!canUseFacilitatorActions ? (
                <p className="mt-3 text-sm font-medium text-slate-500">
                  {facilitatorPermissionMessage}
                </p>
              ) : null}
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

            {voteSummary ? (
              <section className="mt-8 rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-cyan-950">
                      Results summary
                    </h2>
                    <p className="mt-1 text-sm text-cyan-900/70">
                      Based on {voteSummary.voteCount} revealed votes.
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-700">
                    Revealed
                  </span>
                </div>

                {voteSummary.voteCount === 0 ? (
                  <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
                    No votes were submitted before reveal.
                  </p>
                ) : (
                  <>
                    {voteSummary.hasMajorityTie ||
                    voteSummary.hasHighDispersion ? (
                      <div
                        className="mt-4 grid gap-3"
                        role="status"
                        aria-live="polite"
                      >
                        {voteSummary.hasMajorityTie ? (
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-950">
                            <p className="font-semibold">Tie detected</p>
                            <p className="mt-1 text-sm">
                              Multiple values share the lead:{" "}
                              {voteSummary.majorityValues.join(", ")}. Discuss
                              before deciding.
                            </p>
                          </div>
                        ) : null}
                        {voteSummary.hasHighDispersion ? (
                          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-950">
                            <p className="font-semibold">High dispersion detected</p>
                            <p className="mt-1 text-sm">
                              {voteSummary.highDispersionReason} Use this as a
                              prompt for discussion.
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Majority
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-950">
                          {voteSummary.majorityValues.join(", ")}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Average
                        </p>
                        <p className="mt-2 text-2xl font-bold text-slate-950">
                          {voteSummary.average ?? "N/A"}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-white p-4 shadow-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Dispersion
                        </p>
                        <p className="mt-2 text-lg font-bold text-slate-950">
                          {voteSummary.dispersion}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {voteSummary.nonNumericValues.length > 0 ? (
                  <p className="mt-3 text-sm text-cyan-900/70">
                    Non-numeric votes excluded from average:{" "}
                    {voteSummary.nonNumericValues.join(", ")}
                  </p>
                ) : null}
              </section>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() =>
                  setRoom((currentRoom) =>
                    revealRoomVotes({
                      room: currentRoom ?? activePlanningRoom,
                      currentUserRole,
                    }),
                  )
                }
                disabled={!canUseFacilitatorActions}
                className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                title={
                  canUseFacilitatorActions ? undefined : facilitatorPermissionMessage
                }
              >
                Reveal votes
              </button>
              <button
                type="button"
                onClick={() =>
                  setRoom((currentRoom) => {
                    const roomToReset = currentRoom ?? activePlanningRoom;

                    if (!roomToReset || !canUseFacilitatorActions) {
                      return currentRoom;
                    }

                    return resetRoomRound({
                      room: roomToReset,
                      currentUserRole,
                    });
                  })
                }
                disabled={!canUseFacilitatorActions}
                className="rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                title={
                  canUseFacilitatorActions ? undefined : facilitatorPermissionMessage
                }
              >
                Reset round
              </button>
            </div>
            {!canUseFacilitatorActions ? (
              <p className="mt-3 text-sm font-medium text-slate-500">
                {facilitatorPermissionMessage}
              </p>
            ) : null}
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
              <h2 className="text-2xl font-semibold">Round history</h2>
              {activePlanningRoom.storyHistory.length === 0 ? (
                <p className="mt-3 text-sm text-slate-300">
                  Revealed rounds will appear here after you replace the story or reset.
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
                      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                        {entry.deckName} - {formatHistoryDate(entry.recordedAt)}
                      </p>
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

function formatHistoryDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown time";
  }

  return date.toLocaleString();
}

function restoreLocalRoom(params: {
  roomCode: string;
  currentPlayerId: string;
  playerName: string;
  voteValue?: VoteValue;
  deck: PlanningPokerRoom["deck"];
  currentStory: string;
  storyHistory: PlanningPokerRoom["storyHistory"];
}): PlanningPokerRoom {
  const restoredRoom = joinLocalPlanningPokerRoom({
    roomCode: params.roomCode,
    currentPlayerName: params.playerName,
    currentPlayerId: params.currentPlayerId,
    deck: params.deck,
    currentStory: params.currentStory,
    storyHistory: params.storyHistory,
  });

  return params.voteValue
    ? voteInRoom({
        room: restoredRoom,
        playerId: params.currentPlayerId,
        value: params.voteValue,
      })
    : restoredRoom;
}

function joinSharedRoom(params: {
  roomCode: string;
  currentPlayerName: string;
  currentPlayerId: string;
  roomRepository: ReturnType<typeof getLocalRealtimePlanningPokerRoomRepository>;
}): PlanningPokerRoom {
  const normalizedRoomCode = normalizeRoomCode(params.roomCode);
  const sharedSnapshot = params.roomRepository.getRoomSnapshot(normalizedRoomCode);

  if (sharedSnapshot) {
    return joinExistingPlanningPokerRoom({
      room: sharedSnapshot.room,
      currentPlayerName: params.currentPlayerName,
      currentPlayerId: params.currentPlayerId,
    });
  }

  return joinLocalPlanningPokerRoom({
    roomCode: normalizedRoomCode,
    currentPlayerName: params.currentPlayerName,
    currentPlayerId: params.currentPlayerId,
  });
}
