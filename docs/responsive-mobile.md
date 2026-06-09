# Responsive Mobile

## Context

Participants may join planning poker sessions from phones during meetings. The app already has some responsive classes, but the mobile experience should be explicitly specified to ensure joining, voting, viewing room state, and facilitator/spectator-related elements remain comfortable on small screens.

## Objective

Make the Planning Poker app comfortable and reliable to use from mobile devices so participants can join, vote, and follow a session without opening a desktop computer.

## Scope

- Improve mobile layout for entry, room header, voting deck, player/spectator lists, story panels, results, and actions.
- Ensure touch targets are comfortable.
- Keep core voting flow accessible on narrow screens.
- Avoid requiring horizontal scrolling.
- Preserve desktop layout behavior.
- Validate the experience around common mobile widths such as 375px.

## Functional Requirements

1. The app must be usable on common mobile viewport widths.
2. The entry screen must fit comfortably on mobile without clipped controls.
3. The room header must remain readable on mobile.
4. Primary voting cards must be easy to tap on mobile.
5. Voting must remain visible without excessive scrolling after entering a room.
6. Player and spectator lists must be accessible on mobile without crowding the voting area.
7. Facilitator controls must remain usable on mobile when the user is a facilitator.
8. Results summary must stack cleanly on mobile.
9. The leave-room modal must fit within mobile viewport height.
10. The theme toggle and connection indicator must remain accessible on mobile.
11. The layout must not introduce horizontal scrolling.
12. Existing desktop layout must remain intact.

## Technical Requirements

1. Use responsive CSS/Tailwind utilities; do not add a separate mobile route.
2. Keep components small and presentational.
3. Prefer progressive responsive improvements over duplicating entire screen structures.
4. Maintain minimum interactive target size of at least 44px for key actions.
5. Ensure viewport height uses mobile-safe units where appropriate.
6. Validate with `npm run lint` and `npm run build`.
7. Where possible, manually verify a narrow viewport around 375px width.

## Acceptance Criteria

1. Given a participant opens the app at mobile width, the entry form is readable and usable.
2. Given a participant enters a room on mobile, they can see room context and vote without horizontal scrolling.
3. Given a participant taps a voting card on mobile, the card is easy to select.
4. Given the sidebar/player list is needed on mobile, it can be opened or viewed without permanently occupying too much vertical space.
5. Given results are revealed on mobile, the results summary stacks cleanly.
6. Given a modal opens on mobile, it fits the viewport and actions remain reachable.
7. Given the theme toggle is used on mobile, it remains tappable and understandable.
8. Given the connection indicator is shown on mobile, it remains readable.
9. Desktop layout remains visually and functionally intact.
10. `npm run lint` passes.
11. `npm run build` passes.

## Risks / Tradeoffs

- Some panels may still require vertical scrolling because the app has many controls.
- Optimizing mobile layout may require prioritizing voting controls over secondary configuration panels.
- Manual mobile viewport verification is still important because automated build/lint cannot prove usability.
- Existing visual classes may need careful adjustment to avoid regressing desktop layout.

## Applicable Skills

- `frontend-design`: Useful for mobile layout refinement and avoiding cramped generic responsive behavior.
- `accessibility`: Useful for touch target size, focus visibility, modal usability, and no horizontal scrolling.
- `webapp-testing`: Useful for manually inspecting the app at mobile viewport sizes.

## Skill-Based Validation

- Design validation: Check visual rhythm, spacing, and hierarchy at mobile widths.
- Accessibility validation: Check tap targets and keyboard/focus behavior where applicable.
- Browser validation: Inspect a mobile viewport around 375px width.
- Build validation: Run `npm run lint` and `npm run build`.
