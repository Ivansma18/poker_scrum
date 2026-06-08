"use client";

import { useState } from "react";
import {
  createDemoPlanningPokerRoom,
  resetRoomRound,
  revealRoomVotes,
  voteInRoom,
} from "../application/planning-poker-use-cases";
import {
  getVoteForPlayer,
  planningPokerDeck,
  type VoteValue,
} from "../domain/planning-poker";

const currentPlayerId = "you";

export function PlanningPokerBoard() {
  const [room, setRoom] = useState(createDemoPlanningPokerRoom);
  const currentVote = getVoteForPlayer(room, currentPlayerId);

  function handleVote(value: VoteValue) {
    setRoom((currentRoom) =>
      voteInRoom({
        room: currentRoom,
        playerId: currentPlayerId,
        value,
      }),
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
          </div>
          <div className="rounded-2xl bg-black/30 px-5 py-4 text-sm text-slate-200">
            <span className="block text-2xl font-semibold text-white">
              {room.votes.length}/{room.players.length}
            </span>
            votes submitted
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
                onClick={() => setRoom((currentRoom) => revealRoomVotes(currentRoom))}
                className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-cyan-950 transition hover:bg-cyan-300"
              >
                Reveal votes
              </button>
              <button
                type="button"
                onClick={() => setRoom((currentRoom) => resetRoomRound(currentRoom))}
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
