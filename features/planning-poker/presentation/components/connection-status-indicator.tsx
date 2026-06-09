import type { PlanningPokerConnectionStatus } from "../../application/planning-poker-room-repository";

const connectionStatusContent: Record<
  PlanningPokerConnectionStatus,
  {
    label: string;
    helperText: string;
    badgeClassName: string;
    dotClassName: string;
  }
> = {
  connected: {
    label: "Connected",
    helperText: "Your votes can sync with the room.",
    badgeClassName: "border-emerald-300/30 bg-emerald-400/10 text-emerald-100",
    dotClassName: "bg-emerald-300",
  },
  reconnecting: {
    label: "Reconnecting",
    helperText: "Trying to restore room sync.",
    badgeClassName: "border-amber-300/30 bg-amber-400/10 text-amber-100",
    dotClassName: "bg-amber-300",
  },
  disconnected: {
    label: "Disconnected",
    helperText: "Your latest changes may not sync yet.",
    badgeClassName: "border-rose-300/30 bg-rose-400/10 text-rose-100",
    dotClassName: "bg-rose-300",
  },
};

type ConnectionStatusIndicatorProps = {
  status: PlanningPokerConnectionStatus;
};

export function ConnectionStatusIndicator({
  status,
}: ConnectionStatusIndicatorProps) {
  const content = connectionStatusContent[status];

  return (
    <div
      className={`w-fit rounded-lg border px-2.5 py-1.5 sm:px-3 sm:py-2 ${content.badgeClassName}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider sm:text-xs">
        <span
          className={`h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2 ${content.dotClassName}`}
          aria-hidden="true"
        />
        {content.label}
      </div>
    </div>
  );
}
