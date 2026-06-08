# Round History Specification

## Context

The app allows estimating a current story and can store a local history of replaced stories with their visible result. However, the team needs a clearer previous-rounds history to remember what was estimated and with what result.

## Objective

Allow the team to view a previous-rounds history with the estimated story, visible result, and basic round context.

## Scope

Includes:

- Show a list of previous rounds.
- Store the estimated story or ID for each round.
- Store the visible result of the round.
- Store the deck used in the round.
- Store approximate date/time of round closure or replacement.
- Show the history inside the room.
- Keep history after reload if local persistence exists.

Excludes:

- History export.
- Advanced reports.
- Editing previous rounds.
- Full remote history synchronization if no real backend exists.
- Integrations with Jira, Trello, GitHub Issues, or other tools.

## Functional Requirements

1. The system must save a previous round when an estimated story is closed or replaced after votes are revealed.
2. Each history entry must show the estimated story or ID.
3. Each entry must show the visible round result.
4. Each entry must show the deck used.
5. Each entry must show when the round was registered.
6. The team must be able to see history inside the room.
7. If there are no previous rounds, the UI must show a clear empty state.
8. History must persist after page reload.
9. History must not block new rounds or facilitator actions.
10. Current rounds must not appear in history until they are revealed and closed/replaced.

## Technical Requirements

1. History must be part of room state or persisted session state.
2. History entry creation must live in domain or application, not directly in React.
3. History must derive from closing/replacing revealed rounds.
4. Local persistence must store history entries.
5. The UI must render history without duplicating data in React state.
6. The structure must allow migration to remote history if a real backend is later added.

## Acceptance Criteria

- Given a revealed round has story and votes, when the facilitator changes to another story, then the previous round appears in history.
- Given a round was not revealed, when the story changes, then it is not stored as an estimated round.
- Given history exists, when the team opens the room, then it sees previous rounds.
- Given the page reloads and local history exists, when the room restores, then history is restored.
- Given no history exists, when the room is shown, then a clear empty state appears.
- Given a round is saved, then it includes story, result, deck, and date/time.
- Given the team starts a new round, then previous history remains visible.

## Risks / Tradeoffs

- If history is only local, it may differ between devices.
- Storing results as visible text is simple, but limits later analysis.
- A long history can reduce readability if not limited or grouped.
- Without an explicit close action, saving depends on changing story or resetting.

## Applicable Skills

- `typescript-advanced-types`: useful for modeling history entries with required fields.
- `vercel-react-best-practices`: useful for rendering history without duplicated state.
- `accessibility`: useful to ensure list and empty states are clear for screen readers.
- `frontend-design`: useful if a clearer visual history presentation is needed.

## Skill-Based Validation

- Verify that history creation is a pure domain/application rule.
- Verify that the UI does not duplicate history in local React state.
- Verify that empty and populated states are understandable.
- Verify that history is readable on mobile and desktop.

## Checklist

- Revealed rounds can be saved to history.
- Unrevealed rounds are not saved.
- History entries include story or ID.
- History entries include visible result.
- History entries include deck.
- History entries include date/time.
- History persists locally.
- History is visible in the room.
- Empty history state is clear.

## Actions

- Evolve current story history into previous-round history.
- Validate story change, reset, reload, empty, and populated scenarios.

## Validations

- Reveal a story with votes, change story, and verify it appears in history.
- Change story before reveal and verify it does not appear in history.
- Reveal a story with votes, reset round, and verify it appears in history.
- Reload and verify history remains visible.
- Verify each history item includes story, result, deck, and date/time.
- Verify history remains visible when starting a new round.
