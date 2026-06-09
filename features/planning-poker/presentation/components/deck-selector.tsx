"use client";

import { useState } from "react";
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
  const [showCustomDeck, setShowCustomDeck] = useState(false);

  return (
    <section className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Estimation deck</h2>
          <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
            Active: <span className="font-medium text-cyan-400">{room.deck.name}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <PresetDeckButton
            label="Fibonacci"
            active={room.deck.kind === "fibonacci" && !showCustomDeck}
            disabled={!canUseFacilitatorActions}
            onClick={() => {
              setShowCustomDeck(false);
              onSelectPresetDeck("fibonacci");
            }}
          />
          <PresetDeckButton
            label="T-shirt sizes"
            active={room.deck.kind === "t-shirt" && !showCustomDeck}
            disabled={!canUseFacilitatorActions}
            onClick={() => {
              setShowCustomDeck(false);
              onSelectPresetDeck("t-shirt");
            }}
          />
          <PresetDeckButton
            label="Custom"
            active={showCustomDeck}
            disabled={!canUseFacilitatorActions}
            onClick={() => setShowCustomDeck(!showCustomDeck)}
          />
        </div>
      </div>

      {showCustomDeck && (
        <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-400" htmlFor="custom-deck">
              Custom deck values
            </label>
            <textarea
              id="custom-deck"
              disabled={!canUseFacilitatorActions}
              value={customDeckDraft}
              onChange={(event) => onCustomDeckChange(event.target.value)}
              className="mt-2 min-h-16 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-500 input-focus disabled:opacity-50 sm:min-h-20 sm:px-4 sm:py-3 sm:text-base"
              placeholder="0, 1, 2, 3, 5, 8, ?"
              autoFocus
            />
            <p className="mt-1.5 text-[10px] text-slate-500 sm:text-xs">
              Commas or line breaks. Max 12 cards, duplicates removed.
            </p>
          </div>
          <button
            type="button"
            disabled={!canApplyCustomDeck || !canUseFacilitatorActions}
            onClick={onApplyCustomDeck}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-cyan-950 transition-all hover:from-cyan-300 hover:to-cyan-400 disabled:cursor-not-allowed disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 sm:w-auto sm:px-5 sm:py-3 touch-target"
          >
            Apply custom
          </button>
        </div>
      )}
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
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all touch-target sm:px-4 sm:text-sm ${
        active
          ? "bg-white text-slate-950 shadow-sm"
          : "border border-white/[0.08] bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white disabled:opacity-40"
      }`}
      title={disabled ? facilitatorPermissionMessage : undefined}
    >
      {label}
    </button>
  );
}
