import type { FormEvent } from "react";
import type { EntryMode, JoinAs } from "../hooks/use-planning-poker-board";

type PlanningPokerEntryFormProps = {
  entryMode: EntryMode;
  roomName: string;
  roomCode: string;
  playerName: string;
  joinAs: JoinAs;
  canSubmit: boolean;
  onEntryModeChange: (mode: EntryMode) => void;
  onJoinAsChange: (mode: JoinAs) => void;
  onRoomNameChange: (value: string) => void;
  onRoomCodeChange: (value: string) => void;
  onPlayerNameChange: (value: string) => void;
  onSubmit: () => void;
};

export function PlanningPokerEntryForm({
  entryMode,
  roomName,
  roomCode,
  playerName,
  joinAs,
  canSubmit,
  onEntryModeChange,
  onJoinAsChange,
  onRoomNameChange,
  onRoomCodeChange,
  onPlayerNameChange,
  onSubmit,
}: PlanningPokerEntryFormProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <main className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#0b1120] px-4 py-8 text-white sm:px-6">
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 noise-overlay" />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <div className="mb-8 text-center sm:mb-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/25 sm:h-16 sm:w-16 sm:rounded-3xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white sm:h-8 sm:w-8"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M8 13h2" />
              <path d="M8 17h2" />
              <path d="M14 13h2" />
              <path d="M14 17h2" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400 sm:text-sm">
            Planning Poker
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {entryMode === "create" ? "Create a room" : "Join a room"}
          </h1>
          <p className="mt-2 text-sm text-slate-400 sm:text-base">
            {entryMode === "create"
              ? "Start estimating stories with your team"
              : "Enter an existing room code to join"}
          </p>
        </div>

        <form
          className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-white/[0.06] p-1 sm:gap-1.5">
            <button
              type="button"
              onClick={() => onEntryModeChange("create")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                entryMode === "create"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => onEntryModeChange("join")}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                entryMode === "join"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Join
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {entryMode === "create" ? (
              <div>
                <label className="block text-xs font-medium text-slate-400" htmlFor="room-name">
                  Room name
                </label>
                <input
                  id="room-name"
                  type="text"
                  value={roomName}
                  onChange={(event) => onRoomNameChange(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-500 input-focus sm:text-base"
                  placeholder="Sprint planning"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-400" htmlFor="room-code">
                  Room code
                </label>
                <input
                  id="room-code"
                  type="text"
                  value={roomCode}
                  onChange={(event) => onRoomCodeChange(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm uppercase text-white placeholder-slate-500 input-focus sm:text-base"
                  placeholder="SPRINT"
                  autoComplete="off"
                  autoFocus
                />
              </div>
            )}

            {entryMode === "join" ? (
              <div>
                <p className="block text-xs font-medium text-slate-400">
                  Join as
                </p>
                <div className="mt-2 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.05] p-1">
                  <button
                    type="button"
                    onClick={() => onJoinAsChange("participant")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                      joinAs === "participant"
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Participant
                  </button>
                  <button
                    type="button"
                    onClick={() => onJoinAsChange("spectator")}
                    className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                      joinAs === "spectator"
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    Spectator
                  </button>
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-medium text-slate-400" htmlFor="player-name">
                Your name
              </label>
              <input
                id="player-name"
                type="text"
                value={playerName}
                onChange={(event) => onPlayerNameChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white placeholder-slate-500 input-focus sm:text-base"
                placeholder="Alex"
                autoComplete="name"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-cyan-950 transition-all hover:from-cyan-300 hover:to-cyan-400 hover:shadow-lg hover:shadow-cyan-500/25 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 disabled:shadow-none touch-target sm:text-base"
          >
            {entryMode === "create"
              ? "Create room"
              : joinAs === "spectator"
                ? "Join as spectator"
                : "Join room"}
          </button>
        </form>
      </div>
    </main>
  );
}
