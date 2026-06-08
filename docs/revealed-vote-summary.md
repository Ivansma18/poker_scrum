# Revealed Vote Summary Specification

## Context

The Planning Poker room allows votes to be revealed, but the team needs to interpret results quickly without reviewing every individual vote manually.

## Objective

Show a revealed-vote summary with useful metrics such as average, majority, and dispersion to support estimation discussion.

## Scope

Includes:

- Show the summary only after votes are revealed.
- Calculate the majority vote.
- Calculate the average when the deck has numeric values.
- Show dispersion or agreement level between votes.
- Show non-numeric votes separately when they affect the average.
- Keep individual votes visible.

Excludes:

- Saving additional historical results beyond the existing story history behavior.
- Exporting results.
- Automatically recommending a final estimate.
- Automatically changing the story's final estimate.
- Advanced analytics or complex charts.

## Functional Requirements

1. When votes are hidden, the summary must not show aggregate results.
2. When votes are revealed, the system must show a result summary.
3. The summary must include the majority or most-voted value.
4. If enough numeric votes exist, the summary must show the average.
5. If non-numeric votes exist, the summary must identify them and exclude them from the average.
6. The summary must show a signal of dispersion or agreement between votes.
7. If there are no revealed votes, the summary must show a clear empty state.
8. Individual votes must remain visible together with the summary.
9. The summary must update when votes change before reveal or when the round resets.
10. When the round resets or the story/deck changes, the summary must clear together with votes.

## Technical Requirements

1. Summary calculation must live in the domain or application layer, not directly in React.
2. The summary must be derived from current votes and not persisted as duplicated state.
3. The average must consider only numeric votes.
4. Majority must handle ties explicitly.
5. Dispersion must have a simple and verifiable definition.
6. The summary must work with Fibonacci, T-shirt sizes, and custom decks.

## Acceptance Criteria

- Given votes are not revealed, when the room is shown, then average, majority, and dispersion are not visible.
- Given votes are revealed, when the room is shown, then a result summary appears.
- Given revealed votes are `3`, `5`, `5`, when the summary is calculated, then majority is `5` and average is `4.33`.
- Given revealed votes include `?` or `coffee`, when the average is calculated, then those votes are excluded and shown as non-numeric.
- Given there is a majority tie, when the summary is shown, then all tied values are indicated.
- Given the round resets, the story changes, or the deck changes, when the room is shown, then the summary is clear.
- Given a T-shirt sizes deck is active, when votes are revealed, then majority and dispersion are shown, but no numeric average appears if there are no numeric votes.

## Risks / Tradeoffs

- Averaging Fibonacci values can be useful, but does not always represent consensus.
- Non-numeric decks limit average calculation.
- A simple dispersion metric may not capture the full team discussion.
- Showing too many metrics can distract if the UI does not prioritize well.

## Applicable Skills

- `typescript-advanced-types`: useful for modeling summary results and cases with/without average safely.
- `vercel-react-best-practices`: useful for deriving the summary without duplicated React state.
- `frontend-design`: useful if the summary should be presented with a clearer visual UI.
- `accessibility`: useful to ensure revealed metrics are understandable for screen readers.

## Skill-Based Validation

- Verify that the summary is a pure domain/application function.
- Verify that the summary is not duplicated in local or React state.
- Verify that average, majority, ties, and non-numeric values have clear representations.
- Verify that the UI is legible on desktop and mobile.

## Checklist

- Summary appears only after reveal.
- Majority is calculated.
- Majority ties are represented.
- Numeric average is calculated only from numeric votes.
- Non-numeric votes are shown separately.
- Dispersion/agreement is shown.
- Empty revealed state is clear.
- Individual votes remain visible.
- Summary clears when votes are cleared.

## Actions

- Model summary calculation as a pure domain/application function.
- Validate numeric, non-numeric, tie, empty, and reset scenarios.

## Validations

- Reveal `3`, `5`, `5` and verify majority `5`, average `4.33`.
- Reveal votes with `?` or `coffee` and verify those values are excluded from average.
- Reveal tied values and verify all tied majority values are shown.
- Reveal T-shirt sizes and verify no numeric average is shown if all votes are non-numeric.
- Reset round, change story, or change deck and verify the summary clears.
- Verify individual votes remain visible with the summary.
