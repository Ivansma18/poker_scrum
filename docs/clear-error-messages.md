# Clear Error Messages

## Context

The Planning Poker app includes flows for creating/joining rooms, voting, leaving, and local realtime synchronization. Some failure or blocked states currently return silently or only disable controls, which can leave users unsure about what happened or what they should do next.

## Objective

Show clear, actionable error messages when a user cannot enter a room, vote, or synchronize, so they understand the problem and the next step.

## Scope

- Show validation/error messages for entry failures.
- Show user-facing feedback when voting is unavailable or fails.
- Show synchronization error or warning states when realtime/local sync is unavailable.
- Keep error messaging accessible and understandable.
- Keep business rules in domain/application; UI displays messages based on outcomes/state.

## Functional Requirements

1. Entry validation must explain why the user cannot create or join a room.
2. If room name is missing when creating, show a clear message.
3. If room code is missing when joining, show a clear message.
4. If user name is missing, show a clear message.
5. If a user cannot vote because voting is revealed, show a clear message.
6. If a spectator tries to vote, show a clear message explaining they are watching only.
7. If a vote cannot be submitted because the card is invalid or unavailable, show a clear message.
8. If synchronization is disconnected, show a clear warning explaining changes may not sync yet.
9. If sync reconnects, the warning should clear or downgrade automatically.
10. Error messages must be visible near the relevant action where possible.
11. Error messages must not rely only on color.
12. Error messages must be announced or marked accessibly where appropriate.

## Technical Requirements

1. Add presentation-level error state for user actions where domain/application currently returns unchanged state.
2. Do not move business validation rules into React; use existing domain/application checks where possible.
3. Add small reusable feedback/error components if the same pattern appears more than once.
4. Use accessible attributes such as `role="alert"` or `aria-live` for dynamic errors.
5. Keep components small and presentational.
6. Validate with `npm run lint` and `npm run build`.

## Acceptance Criteria

1. Given the user attempts to create without room name, they see a message explaining the room name is required.
2. Given the user attempts to join without room code, they see a message explaining the room code is required.
3. Given the user attempts to enter without name, they see a message explaining their name is required.
4. Given votes are revealed and the user attempts to vote, they see a message explaining voting is closed for the round.
5. Given the user is a spectator and attempts to vote, they see a message explaining spectators cannot vote.
6. Given sync is disconnected, the user sees a visible warning that changes may not sync yet.
7. Given sync reconnects, the warning no longer appears as an active error.
8. Error messages are readable in light and dark themes.
9. Error messages are understandable without relying only on color.
10. `npm run lint` passes.
11. `npm run build` passes.

## Risks / Tradeoffs

- Disabled controls can prevent click-based error triggering; some messages may need to appear proactively instead of after click.
- Some sync states are simulated by local `BroadcastChannel`, so errors should avoid overpromising backend delivery guarantees.
- Too many persistent messages could clutter mobile layouts, so placement must be concise.
- Domain/application functions that return unchanged room state may need additional UI-level interpretation to explain why.

## Applicable Skills

- `accessibility`: Useful for accessible error messaging, live regions, and non-color-only feedback.
- `vercel-react-best-practices`: Useful for keeping error state localized and avoiding unnecessary renders.
- `frontend-design`: Useful for making warning/error surfaces clear without cluttering the mobile UI.

## Skill-Based Validation

- Accessibility validation: Confirm errors use readable text, semantic announcements, and are not color-only.
- React validation: Confirm error state is presentation-level and not mixed into domain rules.
- Design validation: Confirm errors fit mobile and desktop layouts without crowding primary actions.
- Build validation: Run `npm run lint` and `npm run build`.
