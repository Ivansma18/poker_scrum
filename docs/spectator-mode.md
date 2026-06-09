# Spectator Mode

## Context

Planning Poker currently lets users create or join a room as active participants. Active users appear in the players list and can vote. Some users may need to observe the session without participating in voting or affecting vote counts.

## Objective

Allow a user to join a planning poker room as a spectator so they can observe the session without voting or appearing as an active voting participant.

## Scope

- Add a spectator entry option when joining an existing room.
- Let spectators view room state, players, current story, pending stories, revealed results, and round history.
- Prevent spectators from submitting votes.
- Keep spectators out of vote counts.
- Keep spectators separate from active participants in the UI.
- Keep facilitator controls unavailable to spectators.
- Preserve compatibility with existing room snapshots and persisted local state.

## Functional Requirements

1. The entry UI must let a user choose between joining as participant or spectator when joining a room.
2. Spectators must provide a display name before entering.
3. Spectators must be able to view the active room.
4. Spectators must not be able to submit votes.
5. Spectators must not appear in `room.players` as active voting participants.
6. Spectators must not affect vote count totals.
7. Spectators must appear in a separate spectator list or spectator section.
8. Spectators must not have facilitator controls.
9. Spectators must be able to leave the room using the existing leave-room flow.
10. Spectator presence should sync through the existing local/realtime room synchronization model.
11. The feature must keep voting rules in domain/application, not React components.
12. The app must tolerate old room snapshots without a `spectators` field.

## Technical Requirements

1. Add domain representation for spectators, separate from voting players.
2. Add domain functions to add/remove spectators.
3. Add application use cases for joining/leaving as spectator.
4. Ensure vote submission only accepts active players.
5. Extend local persistence and realtime snapshots to support spectators safely.
6. Keep old room data compatible by defaulting missing spectators to an empty list.
7. Keep UI components small and presentational.
8. Validate with `npm run lint` and `npm run build`.

## Acceptance Criteria

1. Given a user joins a room as spectator, they can see the room screen.
2. Given a spectator is in the room, they cannot vote.
3. Given a spectator is in the room, they do not increase the submitted votes count.
4. Given a spectator is in the room, they do not appear in the active players voting list.
5. Given a spectator is in the room, they appear in a spectator section/list.
6. Given a spectator leaves, they are removed from the spectator list.
7. Given a spectator refreshes, their spectator session can be restored.
8. Given old persisted room data has no spectators field, the app still works.
9. Given old realtime room snapshots have no spectators field, the app still works.
10. `npm run lint` passes.
11. `npm run build` passes.

## Risks / Tradeoffs

- Existing room snapshots may not include spectators, so parsing must tolerate missing data.
- Without backend presence, spectator removal on tab close may still be stale unless they explicitly leave.
- Adding spectators to room snapshots changes the room model and requires careful compatibility handling.
- Spectators can observe revealed results and discussion context, which is expected for this story.

## Applicable Skills

- `vercel-react-best-practices`: Useful for keeping entry mode, room view, and spectator list components small and decoupled.
- `accessibility`: Useful to ensure disabled voting controls or spectator notices are understandable.

## Skill-Based Validation

- Domain/application validation: Confirm spectators cannot vote through use cases.
- React validation: Confirm UI only reflects spectator state and does not own voting rules.
- Compatibility validation: Confirm old room snapshots without spectators still load.
- Build validation: Run `npm run lint` and `npm run build`.
