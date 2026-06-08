# Local State Persistence Specification

## Context

The Planning Poker application allows a user to participate in a room using a name, a room code, and a selected vote. Currently, this information may be lost when the page is reloaded.

## Objective

Persist the user's minimum local room state so that, after reloading the page, the user can continue in the same room without re-entering their name, room code, or vote.

## Scope

Includes:

- Save the user's name locally.
- Save the room code locally.
- Save the selected vote locally.
- Restore those values when the page loads or reloads.
- Keep the restored state visible in the interface.

Excludes:

- Server-side persistence.
- Cross-device synchronization.
- Restoration of other users' votes.
- Session or room history.

## Functional Requirements

1. When the user enters or updates their name, the system must save it locally.
2. When the user joins or creates a room with a code, the system must save that code locally.
3. When the user selects a vote, the system must save that vote locally.
4. When the page reloads, the system must restore the saved name, room code, and vote.
5. If no local state exists, the application must start normally without prefilled data.
6. If the user changes their vote after the page has been restored, the new vote must replace the saved vote.
7. If the user leaves or resets the room, the associated local state must be cleared.

## Technical Requirements

1. Persistence must be local to the browser.
2. The saved state must be application-specific and must not rely on cookies.
3. State restoration must happen when the room experience initializes.
4. Business domain logic must not directly depend on browser APIs.
5. Persistence logic should stay outside React components where possible, using an application or infrastructure layer.

## Acceptance Criteria

- Given a user with a name, room code, and selected vote, when the user reloads the page, then the same name, room, and vote are restored.
- Given a user without saved data, when the user opens the application, then no incorrect values are prefilled.
- Given a user who changes their vote, when the user reloads the page, then the most recent vote is restored.
- Given a user who leaves or resets the room, when the user reloads the page, then the previous state is not restored.
- The feature does not require any additional backend connection to restore local state.

## Risks / Tradeoffs

- If local state becomes stale, the user may return to a room that no longer exists.
- If the vote is stored indefinitely, it may be confused with a current vote after the session has ended.
- Local persistence improves continuity but does not replace shared or remote persistence.

## Applicable Skills

- `vercel-react-best-practices`: useful during implementation in React/Next.js to validate state restoration without unnecessary effects.
- `typescript-advanced-types`: useful if the persisted state is modeled with strict types.
- `accessibility`: useful if restored state requires visible or screen-reader-friendly feedback.

## Skill-Based Validation

- Verify that state restoration does not cause unnecessary rendering loops.
- Verify that the persisted state has a typed and validatable shape.
- Verify that any visible restored state is understandable for keyboard and screen reader users.

## Checklist

- Local name persistence is implemented.
- Local room code persistence is implemented.
- Local vote persistence is implemented.
- Reload restores all saved values.
- Empty local state does not prefill incorrect data.
- Vote updates overwrite the stored vote.
- Leaving or resetting the room clears local state.

## Actions

- Place browser persistence outside domain logic.
- Validate the behavior with reload scenarios.

## Validations

- Reload after entering name, room code, and vote.
- Reload with no saved state.
- Change vote, reload, and confirm the latest vote is restored.
- Leave or reset room, reload, and confirm previous state is cleared.
