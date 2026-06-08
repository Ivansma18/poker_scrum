import type { FormEvent } from "react";
import type { EntryMode } from "../hooks/use-planning-poker-board";

type PlanningPokerEntryFormProps = {
  entryMode: EntryMode;
  roomName: string;
  roomCode: string;
  playerName: string;
  canSubmit: boolean;
  onEntryModeChange: (mode: EntryMode) => void;
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
  canSubmit,
  onEntryModeChange,
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
    <main className="flex min-h-screen items-center justify-center bg-[#0f172a] px-6 py-8 text-white">
      <form
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/30"
        onSubmit={handleSubmit}
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
            onClick={() => onEntryModeChange("create")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              entryMode === "create" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
            }`}
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => onEntryModeChange("join")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              entryMode === "join" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
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
              onChange={(event) => onRoomNameChange(event.target.value)}
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
              onChange={(event) => onRoomCodeChange(event.target.value)}
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
          onChange={(event) => onPlayerNameChange(event.target.value)}
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
