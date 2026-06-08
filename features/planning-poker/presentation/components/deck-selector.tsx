import type { PlanningPokerRoom } from "../../domain/planning-poker";
import {
  FacilitatorPermissionNotice,
  facilitatorPermissionMessage,
} from "./facilitator-permission";

type DeckSelectorProps = {
  room: PlanningPokerRoom;
  customDeckDraft: string;
  canApplyCustomDeck: boolean;
  canUseFacilitatorActions: boolean;
  onCustomDeckChange: (value: string) => void;
  onSelectPresetDeck: (kind: "fibonacci" | "t-shirt") => void;
  onApplyCustomDeck: () => void;
};

export function DeckSelector({
  room,
  customDeckDraft,
  canApplyCustomDeck,
  canUseFacilitatorActions,
  onCustomDeckChange,
  onSelectPresetDeck,
  onApplyCustomDeck,
}: DeckSelectorProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Estimation deck</h2>
          <p className="mt-1 text-sm text-slate-500">
            Active deck: {room.deck.name}. Changing decks resets the round.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PresetDeckButton
            label="Fibonacci"
            active={room.deck.kind === "fibonacci"}
            disabled={!canUseFacilitatorActions}
            onClick={() => onSelectPresetDeck("fibonacci")}
          />
          <PresetDeckButton
            label="T-shirt sizes"
            active={room.deck.kind === "t-shirt"}
            disabled={!canUseFacilitatorActions}
            onClick={() => onSelectPresetDeck("t-shirt")}
          />
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
            onChange={(event) => onCustomDeckChange(event.target.value)}
            className="mt-2 min-h-20 w-full rounded-2xl border border-slate-300 px-4 py-3 text-base outline-none transition disabled:bg-slate-100 disabled:text-slate-500 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
            placeholder="Example: 0, 1, 2, 3, 5, 8, ?"
          />
          <p className="mt-1 text-xs text-slate-500">
            Use commas or line breaks. Duplicates are removed; up to 12 cards
            are kept.
          </p>
        </div>
        <button
          type="button"
          disabled={!canApplyCustomDeck || !canUseFacilitatorActions}
          onClick={onApplyCustomDeck}
          className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-cyan-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
        >
          Apply custom
        </button>
      </div>
      <FacilitatorPermissionNotice
        canUseFacilitatorActions={canUseFacilitatorActions}
      />
    </section>
  );
}

function PresetDeckButton({
  label,
  active,
  disabled,
  onClick,
}: {
  label: string;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white"
          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100 disabled:bg-slate-100 disabled:text-slate-400"
      }`}
      title={disabled ? facilitatorPermissionMessage : undefined}
    >
      {label}
    </button>
  );
}
