# Execution Rules

Use this reference to distinguish mandatory behavior from recommendations.

## Required

- Keep this skill focused on user-story-to-spec workflows.
- Use `assets/spec-template.md` as the canonical spec format.
- Follow `.agents/skills/_shared/assets/standard-output-contract.md` for default formal output sections.
- Include `Assumptions made` with a stable numbered list, translated into the user's language.
- Ask the user which assumption numbers they dislike.
- Ask exactly one refinement question at a time.
- Include progress in every refinement question.
- Include four concrete options plus `E. Other` in every refinement question, translated into the user's language.
- Produce verifiable outputs: checklist, actions, validations, risks, and concrete next steps.
- Do not produce ambiguous next steps such as "review later" without a specific action.
- After refinement, ask whether the user wants the final specification generated.
- After showing the final spec, ask whether the user agrees.
- If the user does not agree, repeat the adjustment cycle until full confirmation is received.
- Show final options only after the user confirms agreement with the final spec.
- When creating spec files, use English file content and English kebab-case filenames by default.

## Recommended

- Keep the initial spec proportional to the size of the story.
- Prefer short assumptions that represent one product decision.
- Prefer references in `references/` instead of duplicating long rules in `SKILL.md`.
- Prefer paired example files in `examples/` when adding examples.
- Prefer reusable output formats in `assets/` instead of embedding templates in `SKILL.md`.
- Suggest only skills relevant to the specific implementation or validation needs.
