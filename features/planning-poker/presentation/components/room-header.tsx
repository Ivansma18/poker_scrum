import type { PlanningPokerConnectionStatus } from "../../application/planning-poker-room-repository";
import type {
  PlanningPokerRole,
  PlanningPokerRoom,
} from "../../domain/planning-poker";
import type { ThemePreference } from "../hooks/use-theme-preference";
import { ConnectionStatusIndicator } from "./connection-status-indicator";
import { ThemeToggle } from "./theme-toggle";

type RoomHeaderProps = {
  room: PlanningPokerRoom;
  currentUserRole: PlanningPokerRole;
  connectionStatus: PlanningPokerConnectionStatus;
  inviteCopied: boolean;
  theme: ThemePreference;
  onCopyInviteLink: () => void;
  onRequestLeaveRoom: () => void;
  onToggleTheme: () => void;
};

export function RoomHeader({
  room,
  currentUserRole,
  connectionStatus,
  inviteCopied,
  theme,
  onCopyInviteLink,
  onRequestLeaveRoom,
  onToggleTheme,
}: RoomHeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3 backdrop-blur-xl card-shadow-lg sm:rounded-3xl sm:p-6">
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 sm:h-10 sm:w-10 sm:rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white sm:h-5 sm:w-5"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 sm:text-sm">
              Planning Poker
            </p>
          </div>
          <h1 className="mt-3 break-words text-2xl font-bold tracking-tight sm:truncate sm:text-4xl lg:text-5xl">
            {room.name}
          </h1>
          <p className="mt-2 hidden max-w-xl text-sm text-slate-400 sm:block sm:text-base">
            Vote privately, reveal estimates together, then reset for the next
            story.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
            <p className="text-xs text-slate-400 sm:text-sm">
              Room: <span className="font-mono font-semibold text-cyan-400">{room.id}</span>
            </p>
            <p className="text-xs text-slate-400 sm:text-sm">
              Role: <span className="font-semibold text-white capitalize">{currentUserRole}</span>
            </p>
          </div>
          <div className="mt-3">
            <ConnectionStatusIndicator status={connectionStatus} />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.04] px-4 py-3 sm:px-5 sm:py-4">
            <div className="text-right">
              <span className="block text-2xl font-bold tabular-nums text-white sm:text-3xl">
                {room.votes.length}
                <span className="text-lg text-slate-500">/{room.players.length}</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
                votes
              </span>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-2 min-[380px]:grid-cols-3 sm:flex sm:w-auto sm:flex-col sm:gap-2">
            <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
            <button
              type="button"
              onClick={onCopyInviteLink}
              className="flex-1 rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-300 sm:flex-none sm:px-5 sm:text-sm touch-target"
            >
              {inviteCopied ? "Copied!" : "Copy invite link"}
            </button>
            <button
              type="button"
              onClick={onRequestLeaveRoom}
              className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-slate-400 transition-all hover:bg-white/[0.06] hover:text-slate-200 sm:flex-none sm:px-5 sm:text-sm touch-target"
            >
              Leave room
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
