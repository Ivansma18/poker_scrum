import type { PlanningPokerConnectionStatus } from "../../application/planning-poker-room-repository";
import type {
  PlanningPokerRole,
  PlanningPokerRoom,
} from "../../domain/planning-poker";
import { ConnectionStatusIndicator } from "./connection-status-indicator";

type RoomHeaderProps = {
  room: PlanningPokerRoom;
  currentUserRole: PlanningPokerRole;
  connectionStatus: PlanningPokerConnectionStatus;
  inviteCopied: boolean;
  onCopyInviteLink: () => void;
};

export function RoomHeader({
  room,
  currentUserRole,
  connectionStatus,
  inviteCopied,
  onCopyInviteLink,
}: RoomHeaderProps) {
  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-200">
          Planning poker
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          {room.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-300">
          Vote privately, reveal estimates together, then reset the round for the
          next story.
        </p>
        <p className="mt-2 text-sm font-medium text-cyan-200">
          Room code: {room.id}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-300">
          Your role: {currentUserRole}
        </p>
        <div className="mt-4">
          <ConnectionStatusIndicator status={connectionStatus} />
        </div>
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
          onClick={onCopyInviteLink}
          className="rounded-full border border-cyan-200/50 px-5 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-200 hover:text-cyan-950"
        >
          {inviteCopied ? "Invite link copied" : "Copy invite link"}
        </button>
      </div>
    </header>
  );
}
