# Real-Time Synchronization Specification

## Context

The Planning Poker app currently works mainly with local state. To use it in real meetings, multiple users need to see the same room synchronized live: participants, submitted votes, and reveal state.

## Objective

Enable real-time room synchronization so all team members see participants, votes, and current round state updated live.

## Scope

Includes:

- Synchronize participants connected to the same room.
- Synchronize submitted votes without revealing vote values before `Reveal`.
- Synchronize reveal state.
- Synchronize round reset.
- Synchronize active deck.
- Synchronize current story.
- Keep facilitator permissions compatible with the shared room.

Excludes:

- Room chat.
- Audio/video.
- External tool integrations.
- Advanced remote history.
- Analytics or reports.
- Full account authentication.

## Functional Requirements

1. When a user joins a room, other participants must see them live.
2. When a user leaves or disconnects, the room must reflect that clearly.
3. When a user votes, others must see that the user voted, but not the value if the round is not revealed.
4. When the facilitator reveals votes, all participants must see revealed values.
5. When the facilitator resets the round, everyone must see votes cleared and the round hidden.
6. When the facilitator changes the deck, everyone must see the new deck and votes must be cleared.
7. When the facilitator changes the current story, everyone must see the new story and votes must be cleared.
8. The initial state for a late-joining user must reflect the current room.
9. The app must indicate whether the user is connected, reconnecting, or disconnected.
10. If there is a temporary connection loss, the app must attempt to recover the room state.

## Technical Requirements

1. The room must have a shared state source, not only `localStorage`.
2. The domain must remain independent from network APIs, browser APIs, or realtime providers.
3. Synchronization must live in infrastructure/adapters.
4. The application must define contracts or repositories for reading, writing, and subscribing to room changes.
5. Hidden votes must not expose their value to unauthorized participants before reveal.
6. Sensitive actions must continue validating permissions.
7. Local persistence must remain session support, not the shared source of truth.
8. The UI must handle loading, connection, and error states.

## Acceptance Criteria

- Given two users are in the same room, when one user joins, then the other user sees them as a participant.
- Given a user votes before reveal, when another user views the room, then they see that the user voted but not the value.
- Given the facilitator reveals votes, when everyone views the room, then values appear synchronized.
- Given the facilitator resets the round, when everyone views the room, then votes disappear and the round returns to hidden.
- Given the facilitator changes the deck, when everyone views the room, then the deck changes and votes are cleared.
- Given a user joins late, when the room loads, then they see current participants, story, deck, and reveal state.
- Given the connection is temporarily lost, when it recovers, then the room synchronizes with the current state.

## Risks / Tradeoffs

- Real synchronization requires a backend, realtime service, or external provider.
- Hiding vote values before reveal may require separating vote metadata from actual vote values.
- Without real authentication, facilitator permissions remain weak.
- Reconnection can create conflicts if the user votes while offline.
- The current local model must evolve toward repository contracts and shared events.

## Applicable Skills

- `nodejs-backend-patterns`: useful if implementing a custom realtime backend.
- `nodejs-best-practices`: useful for backend architecture, events, and concurrency handling.
- `vercel-react-best-practices`: useful for consuming realtime state without unnecessary renders.
- `typescript-advanced-types`: useful for modeling events, snapshots, and connection states.
- `accessibility`: useful for communicating connection states and room changes.

## Skill-Based Validation

- Verify that synchronization stays outside the domain.
- Verify that the UI derives state from a shared subscription.
- Verify that hidden votes do not leak values before reveal.
- Verify that connection states are accessible.
- Verify reconnection and initial room snapshot behavior.

## Checklist

- Shared room state source exists.
- Participants synchronize live.
- Vote submitted state synchronizes without revealing hidden values.
- Reveal state synchronizes.
- Reset synchronizes.
- Active deck synchronizes.
- Current story synchronizes.
- Late joiners receive current room state.
- Connection status is visible.
- Reconnection attempts recover current state.
- Domain remains provider-independent.
- Local persistence is not the shared source of truth.

## Actions

- Introduce repository/subscription contracts before selecting or wiring a provider.
- Validate multi-user, hidden-vote, reveal, reset, late-join, and reconnection scenarios.

## Validations

- Open the same room in two clients and verify participant synchronization.
- Vote in one client and verify the other sees `voted` without value before reveal.
- Reveal votes and verify both clients see values.
- Reset the round and verify both clients clear votes.
- Change deck/story and verify both clients update and clear votes.
- Join late and verify current room snapshot.
- Simulate disconnect/reconnect and verify state recovery.
