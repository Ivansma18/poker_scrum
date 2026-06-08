# Spec File Output Rules

Use this reference when the user chooses `Only create the spec` or `Create the spec and apply it`.

## Required

- Create specs inside `docs/`.
- If `docs/` does not exist, create the folder before writing the spec.
- Do not create spec files in the project root.
- The filename must be English, lowercase, kebab-case, and end in `.md`.
- The filename must be related to what the spec does.
- The file content must be the final spec confirmed by the user.
- The generated file content must be English by default unless the user explicitly asks for the saved file content in another language.

## Naming

Derive the filename from the objective, main action, or main entity of the spec.

Rules:

- Use only lowercase letters, numbers, and hyphens.
- Replace spaces with hyphens.
- Remove accents and special characters.
- Avoid generic names such as `spec.md`, `feature.md`, or `document.md`.
- Prefer names of 3 to 8 words.

Examples:

- Product favorites: `docs/save-product-favorites.md`
- Password recovery: `docs/recover-user-password.md`
- Guest checkout: `docs/guest-checkout.md`

## Final Actions

- `Only create the spec`: create or update the file at `docs/<english-kebab-case-name>.md` and do not implement changes.
- `Create the spec and apply it`: create or update the file at `docs/<english-kebab-case-name>.md`, then proceed with implementation if the user and environment allow it.
- `Only show it`: show the final spec in the conversation and do not create or modify files.

## Result Confirmation

After creating the file, report the exact path:

```text
Spec created at `docs/<english-kebab-case-name>.md`.
```
