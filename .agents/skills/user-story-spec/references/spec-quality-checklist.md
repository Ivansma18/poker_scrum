# Spec Quality Checklist

Use this checklist before returning the initial spec.

## Required

- The spec follows `assets/spec-template.md`.
- `Context` explains the problem and why it matters.
- The objective is clear.
- `Scope` states what is included and excluded.
- `Functional requirements` describe expected behavior.
- `Technical requirements` include relevant architecture, performance, accessibility, typing, or validation constraints.
- `Acceptance criteria` are observable.
- `Risks / tradeoffs` identify possible impacts or open decisions.
- `Applicable skills` lists skills that should be applied during implementation or validation.
- `Skill-based validation` includes a checklist for executing validations with applicable skills.
- Assumptions are listed and numbered.
- Output includes concrete actions, validations, risks, and verifiable next steps.
- Acceptance criteria can pass or fail objectively.

## Recommended

- Keep the spec proportional to the story size.
- Keep sections concise when the story is small.
- Include edge cases only when they affect product behavior.
- Suggest only skills relevant to implementation or validation.
- Prefer checkboxes for validation steps.

## Standard Output Areas

- The output follows `.agents/skills/_shared/assets/standard-output-contract.md`.

## Red Flags

- The spec contains only implementation tasks.
- Assumptions are hidden inside prose.
- Acceptance criteria are vague, such as "works correctly".
- The spec asks many questions before making reasonable assumptions.
- The output lacks a clear next step for the user.
- The spec is much larger than the story requires.
- The output contains vague actions without a clear decision or validation.

## Final Check

Before asking which assumptions the user dislikes, confirm that each assumption number maps to one replaceable product decision.
