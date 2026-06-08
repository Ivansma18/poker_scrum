"use client";

import { useState } from "react";
import {
  createLocalPlanningPokerRoom,
  joinLocalPlanningPokerRoom,
  resetRoomRound,
  revealRoomVotes,
  voteInRoom,
} from "../application/planning-poker-use-cases";
import {
  canCreateRoomWithName,
  canJoinWithPlayerName,
  canJoinWithRoomCode,
  getVoteForPlayer,
  planningPokerDeck,
  type PlanningPokerRoom,
  type VoteValue,
} from "../domain/planning-poker";

const currentPlayerId = "you";
type EntryMode = "create" | "join";

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
  const [inviteCopied, setInviteCopied] = useState(false);
  const [room, setRoom] = useState<PlanningPokerRoom | null>(null);

  if (!room) {
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

  const currentVote = getVoteForPlayer(room, currentPlayerId);

  async function handleCopyInviteLink() {
    if (!room) {
      return;
    }

    const inviteLink = `${window.location.origin}/?room=${encodeURIComponent(room.id)}`;

    await navigator.clipboard.writeText(inviteLink);
    setInviteCopied(true);
  }

  function handleVote(value: VoteValue) {
    setRoom((currentRoom) =>
      currentRoom
        ? voteInRoom({
            room: currentRoom,
            playerId: currentPlayerId,
            value,
          })
        : currentRoom,
    );
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
              {room.name}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-300">
              Vote privately, reveal estimates together, then reset the round for
              the next story.
            </p>
            <p className="mt-2 text-sm font-medium text-cyan-200">
              Room code: {room.id}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="rounded-2xl bg-black/30 px-5 py-4 text-sm text-slate-200">
              <span className="block text-2xl font-semibold text-white">
                {room.votes.length}/{room.players.length}
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
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Choose your card</h2>
                <p className="text-sm text-slate-500">
                  Your current vote: {currentVote?.value ?? "none"}
                </p>
              </div>
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                {room.revealed ? "Revealed" : "Voting"}
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {planningPokerDeck.map((card) => {
                const selected = currentVote?.value === card;

                return (
                  <button
                    key={card}
                    type="button"
                    disabled={room.revealed}
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
                    currentRoom ? revealRoomVotes(currentRoom) : currentRoom,
                  )
                }
                className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-cyan-950 transition hover:bg-cyan-300"
              >
                Reveal votes
              </button>
              <button
                type="button"
                onClick={() =>
                  setRoom((currentRoom) =>
                    currentRoom ? resetRoomRound(currentRoom) : currentRoom,
                  )
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
              {room.players.map((player) => {
                const vote = getVoteForPlayer(room, player.id);

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
                      {room.revealed ? vote?.value ?? "-" : vote ? "ok" : "-"}
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
