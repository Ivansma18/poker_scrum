---
name: user-story-spec
description: Use when the user wants to define a product spec from a user story, fill missing requirements, review assumptions, and refine rejected assumptions one question at a time with progress.
---

# User Story Spec

## Scope

This skill turns a user story into a product specification by filling missing functional, UX, business, and behavioral details with explicit assumptions.

Use this skill only for specification work based on user stories or product requirements. Do not use it for implementation planning, architecture design, coding tasks, test automation, or technical design unless those topics are explicitly part of the product behavior being specified.

## Language Policy

- The skill documentation, references, examples, templates, generated files, and generated filenames are written in English by default.
- Detect the language used by the user in the current request.
- Show the conversational procedure in the user's language: questions, progress prompts, assumption refinement prompts, approval prompts, and final option prompts.
- Default to English when the user's language is unclear.
- Generated spec filenames must always be English, lowercase, and kebab-case.
- Generated spec file content must be English by default, even if the conversation is in another language, unless the user explicitly asks for the saved spec content in another language.
- If the spec is only shown in chat and not saved, mirror the user's language unless they ask otherwise.

## Required

- Keep this skill focused on user-story-to-spec workflows.
- Use `assets/spec-template.md` as the canonical specification format.
- Follow `references/execution-rules.md` for mandatory behavior.
- Use `.agents/skills/_shared/assets/standard-output-contract.md` only for formal outputs, not for short clarification or refinement questions.
- Include verifiable outputs with checklist items, actions, validations, risks, and concrete next steps.
- Ask one refinement question at a time when assumptions are rejected.
- Never produce ambiguous outputs without a specific next action.
- After generating the final spec, ask whether the user agrees with it.
- Do not show final action options until the user confirms full agreement with the final spec.

## Recommended

- Keep the spec proportional to the story.
- Prefer references in `references/` instead of duplicating long rules in this file.
- Prefer behavior examples in `examples/` and reusable formats in `assets/`.
- Suggest only skills that are relevant to the specific implementation or validation needs.

## Trigger Phrases

Use this skill when the user asks to:

- Convert a user story into a structured product specification.
- Fill missing functional, UX, business, or behavioral details using explicit assumptions.
- Review, number, and validate assumptions made while drafting a specification.
- Refine rejected assumptions one by one through guided questions.
- Prepare a specification workflow before writing the final spec.

Common valid prompts:

- "I want to create a spec from a user story and have you fill in what is missing."
- "I will give you a story; fill in the blanks and tell me your assumptions."
- "Convert this story into a specification and number the functional assumptions."
- "I did not like assumptions 2 and 5; ask me one question at a time to correct them."
- "Help me validate the assumptions before generating the final spec."

Ambiguous prompts:

- "Help me with this user story."
- "Review this spec."
- "I want to define a requirement."
- "Improve this story."

For ambiguous prompts, ask one short clarification question before activating the full workflow if the user has not clearly requested assumption-driven spec creation.

Do not use this skill when:

- The user wants implementation, coding, refactoring, or architecture work.
- The user wants technical design without a product-spec or user-story refinement workflow.
- The user asks for frontend visual design, UI polish, or design critique.
- The user asks to create or modify opencode configuration, agents, plugins, or skill conventions unrelated to this skill's content.
- The user only wants code review, bug diagnosis, a test plan, or QA execution.

Use instead:

- `frontend-design` when the user asks to build a distinctive frontend page, component, layout, or visual UI.
- `impeccable` when the user asks to critique, polish, redesign, or improve a frontend interface or UX.
- `vercel-composition-patterns` when the user asks to refactor React component APIs or composition patterns.
- `customize-opencode` when the user asks to create or modify opencode configuration, agents, skills, plugins, MCP servers, or permission rules.
- `zod` when the user asks to define or improve Zod validation schemas.

## Expected Inputs

This skill must be able to operate with these minimum inputs, even when some are partial and must be completed through assumptions:

- Objective: what the user or product needs to achieve.
- Technical context: platform, system, integration, data, or environment constraints.
- Constraints: functional, business, UX, legal, operational, timing, or product limits.
- Definition of done: how the user will know the spec or feature is complete.

The ideal input is a user story, usually in this format:

```text
As a <type of user>, I want <action or capability>, so that <benefit or goal>.
```

The user may also provide:

- Change objective.
- Available technical context.
- Product context.
- Known business rules.
- Functional constraints.
- Definition of done.
- Expected edge cases.
- Existing acceptance criteria.
- Rejected assumption numbers.
- Answers to refinement questions using `A`, `B`, `C`, `D`, `E`, `Other`, or free text.

If the user has not provided a story, ask for it in the user's language with one short message.

## Procedure

### 1. Create The Initial Spec

When the user provides the story, produce a concise first-pass specification. Fill missing information with reasonable assumptions instead of blocking, unless the story is impossible to interpret.

Use `assets/spec-template.md` as the canonical base format.

The spec must contain these sections:

- Context
- Objective
- Scope
- Functional requirements
- Technical requirements
- Acceptance criteria
- Risks / tradeoffs
- Applicable skills
- Skill-based validation

Keep the spec proportional to the story. Do not over-engineer small stories.

### 2. List Assumptions

After the draft, show a section titled `Assumptions made` translated into the user's language.

Use `references/assumption-checklist.md` to decide which assumptions to include and how to phrase them.

Then ask the user, in their language, to indicate the assumption numbers they dislike. If all are acceptable, they can say that all are fine.

### 3. Interpret Rejected Assumptions

When the user sends assumption numbers, treat them as the assumptions to refine.

If the user says all assumptions are acceptable, move to the readiness message.

If the user sends an invalid number, ask for correction before continuing.

Track these items during the interaction:

- Original user story.
- Current spec draft.
- Full numbered assumption list.
- Rejected assumption numbers.
- Replacement selected or provided for each rejected assumption.
- Current refinement question.
- Total refinement questions.

### 4. Refine One Assumption At A Time

Ask exactly one refinement question at a time and wait for the user's answer before continuing.

Use `references/refinement-options-guide.md` to generate refinement questions and options.

Every refinement question must include progress, the original rejected assumption, one direct question, four concrete options, and `E. Other` translated into the user's language.

Progress bar format:

```text
Progress: 2/5 [████░░░░░░]
```

If the user chooses `A`, `B`, `C`, or `D`, replace the original assumption with that option.

If the user chooses `E`, `Other`, or provides a custom answer, use the custom answer as the replacement. If they choose `E` or `Other` without providing the definition, ask for their custom definition.

Then continue with the next rejected assumption.

### 5. Finish Refinement

After all rejected assumptions have replacements, respond in the user's language with the readiness message and ask whether they want the final spec generated.

Equivalent English content:

```text
I am ready to create the specification.
I updated the rejected assumptions with your definitions.
Do you want me to generate the final specification now?
```

Do not regenerate the full final specification unless the user says yes, explicitly asks for it, or previously requested automatic generation after refinement.

### 6. Validate Agreement With The Final Spec

When the user asks to generate the final spec, show the complete specification using `assets/spec-template.md` and the shared formal output contract.

After the final spec, always ask in the user's language:

```text
Do you agree with this final spec?
```

If the user says they do not agree, start a new adjustment cycle until full agreement is reached.

In each adjustment cycle:

- Ask what part they want to change.
- Offer concrete section options when possible: `Context`, `Objective`, `Scope`, `Functional requirements`, `Technical requirements`, `Acceptance criteria`, `Risks / tradeoffs`, `Applicable skills`, `Skill-based validation`, and `Other`.
- If the user chooses `Other`, ask for their custom definition.
- Update the spec with the requested change.
- Show the updated spec again.
- Ask again whether they agree with the final spec.

Do not exit this cycle until the user confirms agreement.

### 7. Full Confirmation And Final Options

When the user confirms agreement with the final spec, show these final options in the user's language:

```text
Perfect, the final spec is confirmed.

What do you want to do now?

A. Only create the spec.
B. Create the spec and apply it.
C. Only show it.
```

Interpret equivalent answers as valid, for example `A`, `only create`, `B`, `apply it`, `C`, `only show`.

If the user chooses `A. Only create the spec` or `B. Create the spec and apply it`, follow `references/spec-file-output-rules.md`:

- Create the spec inside `docs/`.
- Create `docs/` if it does not exist.
- Use an English, lowercase, kebab-case filename related to the spec objective or behavior.
- Do not create spec files in the project root.

If the user chooses `C. Only show it`, do not create or modify files.

## References

- Use `references/` for supporting documentation the skill may need when reasoning, validating, or deciding.
- If knowledge is needed to reason or validate the output, it belongs in `references/` instead of `SKILL.md`.
- Keep documentation decoupled from `SKILL.md`. Do not paste large guides into this file.
- See `references/README.md` for the folder convention.
- See `references/spec-workflow.md` for the compact spec workflow and standard output areas.
- See `references/execution-rules.md` for required and recommended behavior.
- See `references/assumption-checklist.md` before listing assumptions.
- See `references/spec-quality-checklist.md` before returning the initial spec.
- See `references/refinement-options-guide.md` when generating options for rejected assumptions.
- See `references/applicable-skills-rules.md` when completing `Applicable skills` and `Skill-based validation`.
- See `references/final-approval-loop.md` after generating the final spec.
- See `references/spec-file-output-rules.md` when the user chooses to create the spec as a file.

## Examples

- Use `examples/` for examples that show how the skill should behave.
- If an example clarifies expected behavior, input shape, output shape, correct usage, incorrect usage, or edge-case handling, it belongs in `examples/`.
- Prefer paired files named `<scenario>.input.md` and `<scenario>.output.md` when the example has both sides.
- See `examples/README.md` for the folder convention.
- See `examples/favorites-happy-path.input.md` and `examples/favorites-happy-path.output.md` for a normal story-to-spec flow.
- See `examples/invalid-assumption-number.input.md` and `examples/invalid-assumption-number.output.md` for invalid refinement input.
- See `examples/custom-other-refinement.input.md` and `examples/custom-other-refinement.output.md` for custom `Other` handling.
- See `examples/refinement-question.output.md` for the expected shape of a refinement question.
- See `examples/refinement-complete.output.md` for the expected readiness question after refinement.
- See `examples/final-spec.output.md` for the expected final spec shape.
- See `examples/final-spec-approval.output.md` for the approval question after showing the final spec.
- See `examples/final-spec-adjustment-loop.output.md` for the cycle when the user is not satisfied.
- See `examples/final-options.output.md` for the options after full confirmation.
- See `examples/spec-file-created.output.md` for the expected confirmation after creating the spec file.

## Assets

- Use `assets/` for reusable files the skill can copy, reuse, or transform as part of its output.
- If a file is a template or base output format, it belongs in `assets/`.
- See `assets/README.md` for the folder convention.
- Use `assets/spec-template.md` as the canonical template for final specifications.

## Output Contract

Use `.agents/skills/_shared/assets/standard-output-contract.md` as the default output contract for formal outputs.

This skill adds the following domain-specific requirements.

### Initial Spec Output

Must include:

- A structured specification based on `assets/spec-template.md`.
- The sections `Context`, `Objective`, `Scope`, `Functional requirements`, `Technical requirements`, `Acceptance criteria`, `Risks / tradeoffs`, `Applicable skills`, and `Skill-based validation`.
- A section for assumptions made.
- A numbered assumption list.
- A prompt asking the user which assumption numbers they dislike.

### Verifiable Output Requirements

Must include:

- Checklist: explicit acceptance criteria or `Skill-based validation` checklist items.
- Actions: concrete user decisions or review actions.
- Validations: observable checks that can pass or fail.
- Risks: explicit risks, tradeoffs, or open decisions.
- Verifiable steps: numbered or checkbox steps when validation is expected.

Must not include:

- Ambiguous actions like "review later" without a specific decision.
- Hidden assumptions embedded only in prose.
- Acceptance criteria that cannot be verified.

### Refinement Question Output

Must include:

- `Progress: <current>/<total> [<10-slot-bar>]`, translated into the user's language.
- `Original assumption: <number>. <text>`, translated into the user's language.
- One direct question.
- Options `A`, `B`, `C`, `D`, and `E. Other`, translated into the user's language.

Must not include:

- More than one refinement question at the same time.
- A regenerated full spec unless explicitly requested.
- Unnumbered replacement choices.

### Final Readiness Output

Must include the user's-language equivalent of:

```text
I am ready to create the specification.
I updated the rejected assumptions with your definitions.
Do you want me to generate the final specification now?
```

If there were no rejected assumptions, omit the update sentence and keep the final question.

### Final Spec Output

Must include:

- The complete spec using the sections from `assets/spec-template.md`.
- The formal contract from `.agents/skills/_shared/assets/standard-output-contract.md`.
- The final question `Do you agree with this final spec?`, translated into the user's language.

Must not include final action options until the user confirms agreement with the spec.

### Final Spec Adjustment Output

Must include:

- A clear question about which part of the spec the user wants to change.
- Concrete options for sections or decisions to adjust.
- An `Other` option for a custom definition.
- An updated spec after receiving the change.
- The question `Do you agree with this final spec?` after showing the updated spec.

### Full Confirmation Output

Must include the user's-language equivalent of:

```text
Perfect, the final spec is confirmed.

What do you want to do now?

A. Only create the spec.
B. Create the spec and apply it.
C. Only show it.
```

### Spec File Creation Output

When the user chooses to create the spec, the assistant must:

- Create `docs/` if it does not exist.
- Create the file at `docs/<english-kebab-case-name>.md`.
- Use an English, lowercase, kebab-case name related to the spec.
- Inform the exact created file path.

Do not create the spec in the project root.
