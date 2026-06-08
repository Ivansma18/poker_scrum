# Current Story Name Specification

## Context

The Planning Poker room allows users to vote on an estimate, but it does not explicitly identify which story, task, or issue is being estimated in the current round.

## Objective

Allow the facilitator to write the current story name or ID so that votes in the round are visually associated with a concrete task.

## Scope

Includes:

- Enter a current story name, title, or ID.
- Show the current story in the room.
- Visually associate the current vote round with that story.
- Change the current story between rounds.
- Clear votes when the current story changes.
- Save previous stories with their final visible estimation result.

Excludes:

- Integration with Jira, Trello, GitHub Issues, or other external tools.
- Remote persistence of stories.
- Assigning multiple stories to the same round.
- Exporting reports.

## Functional Requirements

1. The facilitator must be able to write the current story name or ID.
2. The room must visibly show the current story to participants.
3. If no story is defined, the room must show a clear empty state.
4. When the current story changes, existing votes must be cleared to avoid associating them with the wrong story.
5. The facilitator must be able to edit or replace the current story.
6. The story name or ID must accept free text.
7. The current story must be restored after page reload if local room persistence exists.
8. Changing the story must not change the active deck or participants.
9. When a story is replaced after votes are revealed, the previous story must be stored in local history with its visible estimation result.
10. The facilitator must be able to see the local history of previously estimated stories.

## Technical Requirements

1. The current story must be part of the room state.
2. Rules for updating the story must live in the domain or application layer, not directly in React.
3. Local persistence must include the current story together with room, player name, vote, and deck.
4. Story text must be normalized to avoid unnecessary whitespace.
5. Local persistence must include the story history and each stored result.
6. The UI must remain usable on desktop and mobile.

## Acceptance Criteria

- Given a facilitator in a room, when they write a valid current story, then the room shows that story.
- Given votes have been submitted, when the facilitator changes the current story, then votes are cleared.
- Given the facilitator changes the story, when participants vote after the change, then those votes are visually associated with the new story.
- Given no current story exists, when the room is shown, then a clear empty state appears.
- Given a current story exists in local persistence, when the page reloads, then the story is restored.
- Given the current story changes, then the active deck and participants remain unchanged.
- Given votes are revealed for a story, when the facilitator replaces the story, then the previous story is saved in local history with its visible estimation result.
- Given previous stories exist locally, when the facilitator views the room, then they can see the history.

## Risks / Tradeoffs

- Changing the story during voting can interrupt the flow, so votes are cleared.
- If real roles do not exist yet, facilitator may continue to mean the current local user.
- Local history may not match other devices because it is not remotely persisted.
- Storing history without export keeps scope small but limits reporting value.

## Applicable Skills

- `vercel-react-best-practices`: useful for implementing editing/restoration without unnecessary effects.
- `typescript-advanced-types`: useful if the current story and history entries are modeled with stricter types.
- `accessibility`: useful to ensure story changes and history are understandable for screen reader users.

## Skill-Based Validation

- Verify that updating the story does not duplicate unnecessary React state.
- Verify that changing the story resets votes through domain/application rules.
- Verify that empty, current, and historical story states are clear to users.
- Verify that the restored story is visible after reload.
- Verify that history entries include the story and final visible result.

## Checklist

- Current story can be entered.
- Current story is visible in the room.
- Empty story state is clear.
- Changing story clears votes.
- Changing story preserves deck and participants.
- Current story persists locally.
- Revealed story result is saved to local history when the story is replaced.
- Local history is visible in the room.

## Actions

- Model current story and history in domain/application.
- Validate behavior for empty story, story changes, revealed results, and reload.

## Validations

- Enter a story and verify it appears in the room.
- Submit votes, change story, and verify votes are cleared.
- Change story and verify deck and participants remain unchanged.
- Reload and verify the current story is restored.
- Reveal votes, replace the story, and verify the previous story appears in local history with the visible result.
- Open the room with no story and verify the empty state is clear.
