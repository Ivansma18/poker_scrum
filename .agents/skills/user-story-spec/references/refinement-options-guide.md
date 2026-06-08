# Refinement Options Guide

Use this guide when the user rejects one or more assumptions.

## Goal

Each refinement question must help the user replace one rejected assumption with a clearer product decision.

## Option Requirements

For each rejected assumption, generate:

- Four concrete replacement assumptions: `A`, `B`, `C`, and `D`.
- One custom option: `E. Other`, translated into the user's language.
- Options that are distinct and plausible.
- Options focused on the original assumption.

## Good Dimensions For Varying Options

Vary options by one meaningful product dimension, such as:

- Who can perform the action.
- When the action is allowed.
- Whether confirmation is required.
- How long data persists.
- Whether behavior applies to guests or authenticated users.
- What limit or threshold applies.
- What happens on failure.
- What notification or message appears.
- Whether the action is reversible.

## Avoid

- Four options that say the same thing with different wording.
- Technical architecture alternatives unless user-visible.
- Combining unrelated decisions in one option.
- Asking about multiple rejected assumptions at the same time.
- Regenerating the full spec during refinement.

## Progress Bar Rule

Use a 10-slot bar and approximate progress from current question over total questions.

Examples:

- `Progress: 1/4 [███░░░░░░░]`
- `Progress: 2/4 [█████░░░░░]`
- `Progress: 3/4 [████████░░]`
- `Progress: 4/4 [██████████]`
