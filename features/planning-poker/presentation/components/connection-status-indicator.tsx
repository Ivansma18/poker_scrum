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
      className={`w-fit rounded-2xl border px-4 py-3 ${content.badgeClassName}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2 text-sm font-semibold">
        <span
          className={`h-2.5 w-2.5 rounded-full ${content.dotClassName}`}
          aria-hidden="true"
        />
        {content.label}
      </div>
      <p className="mt-1 text-xs opacity-80">{content.helperText}</p>
    </div>
  );
}
