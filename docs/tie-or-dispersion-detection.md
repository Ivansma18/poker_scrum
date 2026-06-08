# Tie Or Dispersion Detection Specification

## Context

The app can already reveal votes and show a summary with majority, average, and dispersion. The facilitator needs to quickly identify when results require discussion, especially if there is a tie or a large difference between estimates.

## Objective

Visually highlight tie or high-dispersion situations in revealed votes to help the facilitator start a team discussion.

## Scope

Includes:

- Detect majority ties.
- Detect high numeric dispersion.
- Show a visual alert when a tie exists.
- Show a visual alert when high dispersion exists.
- Keep result summary and individual votes visible.
- Clear highlights when the round resets, the story changes, or the deck changes.

Excludes:

- Automatic final estimate recommendation.
- Chat or guided discussion flow.
- Automatic secondary voting round.
- Advanced per-room threshold configuration.
- Historical reports or dispersion analytics.

## Functional Requirements

1. When votes are not revealed, no tie or dispersion alert must be shown.
2. When votes are revealed, the system must evaluate whether there is a majority tie.
3. When a majority tie exists, the UI must highlight it clearly.
4. When numeric votes have high dispersion, the UI must highlight it clearly.
5. If tie and high dispersion exist at the same time, the UI must show both states or a combined message.
6. If there is no tie or high dispersion, the UI must show the normal summary without an alert.
7. Alerts must disappear when the round resets, the story changes, or the deck changes.
8. Alerts must help the facilitator open discussion without blocking the session.
9. Participants must still see individual votes and summary.
10. Detection must work with Fibonacci, T-shirt sizes, and custom decks.

## Technical Requirements

1. Detection must live in the domain or application layer, not directly in React.
2. The UI must derive highlights from the summary or current votes without persisting duplicated state.
3. Tie detection must be based on multiple values sharing the maximum vote frequency.
4. High dispersion must have a simple and verifiable threshold.
5. For non-numeric decks, dispersion must be based on distinct vote count if there is not enough numeric range.
6. The logic must reuse or extend the existing revealed vote summary.
7. Detection must not expose values before votes are revealed.

## Acceptance Criteria

- Given votes are not revealed, when the room is shown, then no tie or dispersion alert appears.
- Given revealed votes are `3`, `5`, `5`, when the summary is shown, then no tie alert appears.
- Given revealed votes are `3`, `5`, `3`, `5`, when the summary is shown, then a tie alert appears between `3` and `5`.
- Given revealed votes are `1`, `13`, `21`, when the summary is shown, then a high-dispersion alert appears.
- Given revealed votes are `S`, `L`, `XL`, when there is no numeric range, then the app can highlight disagreement by multiple distinct values.
- Given the round resets, the story changes, or the deck changes, when the room is shown, then alerts disappear.
- Given an alert exists, when it is shown, then it does not block voting in future rounds or resetting.

## Risks / Tradeoffs

- A dispersion threshold that is too low can generate unnecessary alerts.
- A threshold that is too high can hide important disagreements.
- In non-numeric decks, dispersion is less precise and approximated through vote diversity.
- Highlighting alerts can distract if it visually competes too much with the summary.

## Applicable Skills

- `typescript-advanced-types`: useful for modeling tie/dispersion flags inside the result summary.
- `vercel-react-best-practices`: useful for deriving highlights without duplicated React state.
- `frontend-design`: useful if a clearer visual presentation is needed for discussion alerts.
- `accessibility`: useful to make alerts announceable and understandable for screen readers.

## Skill-Based Validation

- Verify that detection is a pure domain/application function.
- Verify that the UI does not persist derived alerts.
- Verify that tie, high dispersion, and normal states are distinguishable.
- Verify that alerts are legible and accessible on desktop and mobile.

## Checklist

- Tie alert appears only after reveal.
- High-dispersion alert appears only after reveal.
- Tie alert shows tied values.
- Numeric dispersion uses a clear threshold.
- Non-numeric dispersion uses distinct vote count.
- Alerts clear when votes clear.
- Summary and individual votes remain visible.
- Alerts do not block session actions.

## Actions

- Extend the revealed vote summary calculation.
- Validate tie, high numeric dispersion, non-numeric diversity, normal, and reset scenarios.

## Validations

- Reveal `3`, `5`, `5` and verify no tie alert.
- Reveal `3`, `5`, `3`, `5` and verify tie alert.
- Reveal `1`, `13`, `21` and verify high-dispersion alert.
- Reveal `S`, `L`, `XL` and verify non-numeric disagreement alert.
- Reset round, change story, or change deck and verify alerts disappear.
- Verify alerts do not hide individual votes or summary.
