# Connection Indicator

## Context

Planning Poker participants need confidence that their vote is synchronized with the active room. The app already exposes a realtime connection status (`connected`, `reconnecting`, `disconnected`) through the local realtime room repository and currently shows raw connection text in the room header.

## Objective

Provide a clear connection indicator so participants can quickly understand whether they are connected, reconnecting, or disconnected before trusting that their vote was sent.

## Scope

- Show a visible connection indicator whenever a user is inside a planning poker room.
- Support the existing states: `connected`, `reconnecting`, `disconnected`.
- Make the state understandable without relying only on color.
- Keep voting behavior unchanged; disconnected state informs but does not block voting.
- Keep the indicator presentational and reusable.

## Functional Requirements

1. The room UI must display a connection indicator whenever a user is inside a planning poker room.
2. The indicator must map connection states to user-facing labels:
   - `connected`: "Connected"
   - `reconnecting`: "Reconnecting"
   - `disconnected`: "Disconnected"
3. The indicator must include explanatory helper text:
   - Connected: "Your votes can sync with the room."
   - Reconnecting: "Trying to restore room sync."
   - Disconnected: "Your latest changes may not sync yet."
4. The indicator must use distinct visual treatments for each state.
5. The indicator must not block voting by default.
6. The indicator must be reusable as a generic/presentation component that receives status as props.
7. The room header must use the reusable indicator instead of raw `Connection: <status>` text.
8. The indicator must remain visible and readable on desktop and mobile layouts.
9. The indicator text must stay in English to match the current UI.

## Technical Requirements

1. Keep connection status source in the existing hook/repository flow.
2. Do not move connection rules into React UI components.
3. Add a focused presentational component, for example `connection-status-indicator.tsx`.
4. Keep the component small and reusable.
5. Use accessible text, not color alone, to communicate status.
6. Do not add backend realtime functionality as part of this story.
7. Validate with `npm run lint` and `npm run build`.

## Acceptance Criteria

1. Given a participant is in a room and status is `connected`, the UI shows "Connected" and "Your votes can sync with the room."
2. Given status changes to `reconnecting`, the UI shows "Reconnecting" and "Trying to restore room sync."
3. Given status changes to `disconnected`, the UI shows "Disconnected" and "Your latest changes may not sync yet."
4. The room header no longer renders raw `Connection: <status>` text.
5. The indicator is visible in the room header on mobile and desktop.
6. The indicator remains understandable without relying only on color.
7. Existing voting behavior continues to work.
8. `npm run lint` passes.
9. `npm run build` passes.

## Risks / Tradeoffs

- The current local `BroadcastChannel` implementation may not represent a real multi-device backend connection.
- Not blocking votes while disconnected keeps the flow simple, but users may still vote while sync is unavailable.
- The disconnected message must avoid claiming that changes are lost; it should only warn that changes may not sync yet.

## Applicable Skills

- `accessibility`: Use if validating that the indicator communicates state beyond color and works for assistive technologies.
- `vercel-react-best-practices`: Use when implementing the presentational component and keeping props/state boundaries clean.

## Skill-Based Validation

- Accessibility validation: Confirm state is communicated with visible text and not only color.
- React validation: Confirm the indicator is presentational and receives status via props.
- Build validation: Run `npm run lint` and `npm run build`.
