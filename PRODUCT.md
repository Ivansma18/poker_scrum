# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are Scrum teams estimating backlog items during planning, refinement, or related estimation sessions.

## Product Purpose

This product lets a team create or join a planning-poker room, cast estimates privately, reveal them together, and reset quickly for the next story. Success means a team can start an estimation session with minimal setup and move through stories without friction.

## Positioning

The product is optimized to be fast to start. It favors immediate room creation and joining over setup-heavy workflows so a team can begin estimating in seconds.

## Operating Context

- Teams work in shared estimation sessions around stories or backlog items.
- One person can facilitate the room while others participate or observe as spectators.
- Sessions revolve around a current story, optional pending-story queue, private voting, reveal, summary, and round reset.
- Joining happens through a short room code or invite link.

## Capabilities and Constraints

- Confirmed roles: facilitator, participant, and spectator.
- Confirmed deck support: Fibonacci, T-shirt sizes, and custom decks.
- Confirmed theme support: dark and light.
- Current implementation is a web app built with Next.js 16 App Router.
- Current implementation persists room/session state in the browser and syncs room updates locally through browser storage and `BroadcastChannel`.
- Open decision: whether browser-local sync is a long-term product constraint or only the current implementation strategy.
- Open decision: whether the product should support use outside Scrum teams as a first-class audience.

## Brand Commitments

- Current product name in the app is `Scrum Poker` / `Planning Poker`; no stronger naming, voice, or identity constraints are confirmed yet.

## Evidence on Hand

- Main route and product shell: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`.
- Core room, voting, deck, and story rules: `features/planning-poker/domain/planning-poker.ts`.
- Room workflows and permissions: `features/planning-poker/application/planning-poker-use-cases.ts`.
- Current UI surfaces: `features/planning-poker/presentation/components/*`.
- Current local sync and persistence approach: `features/planning-poker/infrastructure/local-realtime-planning-poker-room-repository.ts` and `features/planning-poker/infrastructure/local-planning-poker-state.ts`.
- No confirmed external brand assets, testimonials, case studies, or product-proof materials are present in the repository today.

## Product Principles

- Minimize setup between deciding to estimate and casting the first vote.
- Keep collaborative estimation legible through clear roles, room state, and round transitions.
- Preserve flexible estimation rituals by supporting multiple decks and story-queue workflows.
- Prefer lightweight sharing and re-entry over account-heavy gating.
