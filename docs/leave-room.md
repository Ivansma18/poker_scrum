# Leave Room

## Context

Planning Poker participants can join or create rooms and appear in the active players list. There is currently no explicit way for a participant to leave a room, so their presence may remain visible even when they no longer want to participate.

## Objective

Allow a participant to leave a planning poker room so their presence no longer appears active in the room.

## Scope

- Add a visible leave-room action for users inside a room.
- Ask for confirmation in a modal before leaving.
- Remove the current player from the room's active player list when they confirm leaving.
- Remove the player's vote from the current round when they leave.
- Clear local session state enough that the user returns to the entry screen.
- Keep this behavior within the existing local/realtime room synchronization model.

## Functional Requirements

1. The room UI must provide a "Leave room" action while the user is inside a room.
2. Clicking "Leave room" must open a confirmation modal instead of leaving immediately.
3. The confirmation modal must explain that the user will be removed from the active players list.
4. The modal must provide a cancel action that closes the modal without changing room state.
5. The modal must provide a confirm action that completes the leave-room flow.
6. When the user confirms leaving, the current player must be removed from `room.players`.
7. When the user confirms leaving, any vote submitted by that player must be removed from `room.votes`.
8. The updated room must be published to realtime/local room sync so other active users no longer see the participant.
9. The leaving user must return to the entry/create-join screen.
10. The leaving user's local room session must be cleared so the room is not automatically restored on refresh.
11. Leaving a room must not delete the room for remaining participants.
12. If the facilitator leaves, the feature should remove them like any other player and not transfer facilitation automatically.
13. The action should be implemented through domain/application rules, not directly inside React UI.
14. The UI should use small reusable/presentational components and avoid expanding large components.

## Technical Requirements

1. Add a domain function to remove a player from a planning poker room.
2. Add an application use case for leaving a room.
3. Clear persisted local planning poker state for the leaving user.
4. Publish the updated room before returning the user to the entry screen.
5. Add a focused confirmation modal component or reusable dialog component.
6. Keep App Router files unchanged unless route-level wiring is required.
7. Validate with `npm run lint` and `npm run build`.

## Acceptance Criteria

1. Given a participant is inside a room, they can see a "Leave room" action.
2. Given the participant clicks "Leave room", a confirmation modal appears.
3. Given the participant cancels the modal, they remain in the room and no room state changes.
4. Given the participant confirms the modal, they return to the entry screen.
5. Given the participant confirms leaving, their name no longer appears in the players list for other synced users.
6. Given the participant had voted, their vote is removed from the current vote count.
7. Given the participant refreshes after leaving, they are not restored into the old room automatically.
8. Given other players remain in the room, the room continues to exist for them.
9. Given the facilitator leaves, no automatic facilitator reassignment happens.
10. `npm run lint` passes.
11. `npm run build` passes.

## Risks / Tradeoffs

- Without a real backend presence system, this action only removes presence when the user explicitly confirms "Leave room"; closing the tab may still leave stale presence.
- If the facilitator leaves and no facilitator remains, remaining participants may lose access to facilitator controls.
- Publishing the updated room before clearing local state is important so the leave action is visible to other users.
- A modal adds an extra click, but prevents accidental room exits.

## Applicable Skills

- `vercel-react-best-practices`: Useful for keeping the leave action presentational and the state transition inside hooks/use cases.
- `accessibility`: Useful for making the modal keyboard-accessible and understandable to assistive technologies.

## Skill-Based Validation

- React validation: Confirm UI components remain small and presentational.
- Domain/application validation: Confirm removal logic is not embedded in React.
- Accessibility validation: Confirm the modal can be understood and operated with keyboard/accessibility semantics.
- Build validation: Run `npm run lint` and `npm run build`.
