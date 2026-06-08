# Spec Workflow Reference

Use this reference to keep `SKILL.md` concise.

## Minimum Inputs

The skill can operate with partial information, but it must account for:

- Objective: desired outcome for the user or product.
- Technical context: relevant platform, system, data, integration, or environment.
- Constraints: functional, business, UX, legal, timing, operational, or product limits.
- Definition of done: observable conditions that mean the spec or feature is complete.

## Standard Output Areas

Use `.agents/skills/_shared/assets/standard-output-contract.md` as the shared source for default formal output sections.

## Canonical Spec Format

Use `assets/spec-template.md` as the canonical format for the final specification.

Required spec sections:

- Context
- Objective
- Scope
- Functional requirements
- Technical requirements
- Acceptance criteria
- Risks / tradeoffs
- Applicable skills
- Skill-based validation

## Assumption Rules

- Prefer making the smallest useful assumption instead of blocking.
- List assumptions only when they affect product behavior, UX, business rules, workflow, content, permissions, limits, validation, notifications, or acceptance criteria.
- Keep assumptions numbered and stable during refinement.
- Do not include implementation details unless visible to users or required by the user's context.
- Ask one refinement question at a time for rejected assumptions.
