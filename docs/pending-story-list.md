# Pending Story List Specification

## Context

The app allows defining a current story and storing estimated rounds in history. However, the facilitator still has to manually write each story one by one during the session.

## Objective

Allow the facilitator to load a pending story list and estimate those stories sequentially during the session.

## Scope

Includes:

- Load multiple pending stories into a room.
- Show the pending story list.
- Select or advance to the next story.
- Mark stories as estimated when a round is completed.
- Keep the current story visible.
- Keep estimated round history.
- Persist the pending story list locally.

Excludes:

- Import from Jira, Trello, GitHub Issues, or other tools.
- Advanced prioritization.
- Assignee management.
- Advanced remote collaborative editing.
- Exporting the list or results.
- Estimating multiple stories at the same time.

## Functional Requirements

1. The facilitator must be able to load multiple pending stories.
2. Each pending story must accept free text, such as ID, name, or both.
3. The room must show the pending story list.
4. The facilitator must be able to select a pending story as the current story.
5. The facilitator must be able to advance to the next pending story.
6. Selecting or advancing to a story must clear current votes.
7. When a revealed round closes or is replaced, the estimated story must stop being pending.
8. Estimated stories must continue appearing in round history.
9. If there are no pending stories, the UI must show a clear empty state.
10. Only facilitators may load, select, or advance pending stories.
11. Participants may see the current story and pending list, but must not modify it.
12. The list must persist after page reload.

## Technical Requirements

1. Pending stories must be part of room state or persisted session state.
2. Rules for loading, selecting, advancing, and completing stories must live in domain or application, not directly in React.
3. Local persistence must store the pending list.
4. Realtime synchronization, if active, must publish pending-list changes.
5. Changing the current story from the list must reuse the existing current-story change rule.
6. The UI must derive the list from room state without unnecessary React state duplication.

## Acceptance Criteria

- Given a facilitator, when they load multiple stories, then they appear in the pending list.
- Given a participant, when they view the room, then they can see pending stories but cannot modify them.
- Given a pending story, when the facilitator selects it, then it becomes the current story and votes are cleared.
- Given multiple pending stories, when the facilitator advances to the next one, then the next story becomes current.
- Given a revealed round with a pending story, when the facilitator changes to another story or resets the round, then the estimated story is removed from pending and appears in history.
- Given no pending stories, when the list is shown, then a clear empty state appears.
- Given the page reloads and pending stories were saved, then they are restored.

## Risks / Tradeoffs

- Long lists can take too much UI space.
- If history and pending list are not updated consistently, a story could appear pending after being estimated.
- Without external integration, the facilitator must load stories manually.
- In local/realtime synchronization, clients can diverge if snapshots are not published correctly.

## Applicable Skills

- `typescript-advanced-types`: useful for modeling pending stories and estimated/pending transitions.
- `vercel-react-best-practices`: useful to avoid duplicated UI state.
- `accessibility`: useful to make the list, selection, and empty states clear.
- `frontend-design`: useful if a clearer visual experience is needed for loading and navigating stories.

## Skill-Based Validation

- Verify that pending-list rules stay outside React.
- Verify that selecting or advancing stories does not duplicate state.
- Verify that participants cannot modify the list.
- Verify that the list is usable on desktop and mobile.

## Checklist

- Facilitator can load pending stories.
- Pending stories are shown in the room.
- Participants can view but not modify pending stories.
- Facilitator can select a pending story.
- Facilitator can advance to next pending story.
- Selecting/advancing clears votes.
- Revealed estimated stories are removed from pending.
- Estimated stories appear in round history.
- Pending list persists locally.
- Pending list syncs through realtime snapshots.

## Actions

- Add pending stories to room state and reuse current-story transition rules.
- Validate load, select, next, complete, participant permissions, reload, and realtime snapshot scenarios.

## Validations

- Load multiple newline-separated stories and verify they appear.
- Select a pending story and verify it becomes current.
- Advance to next story and verify votes clear.
- Reveal and close a story, then verify it is removed from pending and added to history.
- Reload and verify pending stories remain.
- Join as participant and verify list is visible but controls are disabled.
