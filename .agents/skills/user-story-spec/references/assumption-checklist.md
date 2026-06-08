# Assumption Checklist

Use this checklist before showing `Assumptions made`.

## Include Assumptions When They Affect

- User-visible behavior.
- Business rules.
- UX flow or decision points.
- Permissions, roles, or access.
- Data meaning, ownership, or persistence.
- Limits, thresholds, timing, or expiration.
- Validation rules and error behavior.
- Notifications, confirmations, or messaging.
- Acceptance criteria.
- Edge-case behavior.

## Exclude Assumptions When They Are Only

- Internal implementation details.
- Framework, library, database, or architecture choices.
- Naming conventions that do not affect users.
- Deployment or infrastructure details.
- Test strategy details.

## Quality Rules

- Each assumption must be independently rejectable.
- Each assumption must be written as a statement, not a question.
- Keep assumptions short and specific.
- Avoid bundling multiple product decisions into one assumption.
- Keep numbering stable during refinement.
- If an assumption is uncertain but important, list it instead of asking a blocking question.

## Bad Examples

- "The backend will use PostgreSQL."
- "The component will be implemented in React."
- "Need to confirm behavior."
- "The user can save, edit, delete, and share favorites."

## Better Examples

- "Favorites are saved at account level and persist across sessions."
- "The user must confirm before deleting a submitted request."
- "Guest users lose their favorites when the browser session ends."
