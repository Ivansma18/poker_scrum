# Final Spec Approval Loop

Use this reference after generating the final spec.

## Goal

Do not close the flow until the user confirms full agreement with the final spec.

## Required

- After showing the final spec, ask: `Do you agree with this final spec?`, translated into the user's language.
- If the user says no, start an adjustment cycle.
- Ask adjustment questions one at a time.
- Update the spec according to the user's answer.
- Show the updated spec again.
- Ask again whether the user agrees.
- Repeat until full confirmation is received.
- Show final options only after full confirmation.

## Recommended Adjustment Options

When the user says they do not agree but does not specify the change, ask in the user's language:

```text
What part do you want to adjust?

A. Context
B. Objective
C. Scope
D. Functional requirements
E. Technical requirements
F. Acceptance criteria
G. Risks / tradeoffs
H. Applicable skills or Skill-based validation
I. Other
```

If the user chooses a section, ask for a concrete definition to replace or adjust that part.

If the user chooses `Other`, ask for their custom definition.

## Final Options

Show only after the user confirms full agreement:

```text
Perfect, the final spec is confirmed.

What do you want to do now?

A. Only create the spec.
B. Create the spec and apply it.
C. Only show it.
```

## Interpretation Rules

- `Only create the spec`: create or update the spec at `docs/<english-kebab-case-name>.md`, without implementation.
- `Create the spec and apply it`: create or update the spec at `docs/<english-kebab-case-name>.md` and proceed with implementation if the environment and permissions allow it.
- `Only show it`: show the final spec in the conversation without creating files or applying changes.

For folder and naming rules, see `spec-file-output-rules.md`.
