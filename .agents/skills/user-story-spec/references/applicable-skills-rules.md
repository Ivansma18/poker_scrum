# Applicable Skills Rules

Use this reference when completing the `Applicable skills` and `Skill-based validation` sections of a spec.

## Required

- Suggest only skills relevant to the implementation or validation of the spec.
- Prioritize skills available in the current environment.
- If a skill does not exist in the environment but would be useful, mark it as an external recommendation.
- Briefly explain why each skill applies.
- Include at least one concrete validation for each applicable skill when relevant.

## Recommended

- Do not suggest more skills than necessary.
- Prefer specialized skills over generic skills.
- Do not suggest a skill when there is no associated verifiable action.

## Format

```text
## Applicable skills

- `zod`: define and validate runtime contracts for external payloads.
- `impeccable`: review flow clarity, empty states, and UX errors.

## Skill-based validation

- [ ] Validate the Zod schema with valid and invalid cases.
- [ ] Review error and empty states with `impeccable`.
- [ ] Document discovered risks.
```

## External Skills

If a skill is not available in the current environment, use this format:

```text
- `accessibility` (external recommendation): validate keyboard navigation, focus, and semantics.
```
