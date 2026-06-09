# Light/Dark Theme

## Context

The Planning Poker app currently uses a strongly dark visual style. Users may need a lighter interface in bright environments or prefer dark mode in low-light environments.

## Objective

Allow users to switch between light and dark themes so they can use the app comfortably in different environments.

## Scope

- Add a visible theme toggle in the app UI.
- Support light and dark themes.
- Persist the selected theme locally.
- Apply the selected theme across the active app screens.
- Keep the implementation compatible with the existing component structure and Tailwind v4 setup.
- Avoid introducing external theme dependencies.

## Functional Requirements

1. The app must provide a theme toggle visible from the main room UI.
2. The app should also make the selected theme apply to the entry screen.
3. The user must be able to switch between light and dark themes at any time.
4. The selected theme must persist locally across refreshes.
5. On first visit, the app should default to the user's system preference when available.
6. If no system preference is available, the app should default to dark mode to preserve the current visual baseline.
7. Theme changes must update backgrounds, text, cards, borders, buttons, and status surfaces enough to keep the UI readable.
8. The toggle must communicate the current theme with visible text or an accessible label, not icon-only.
9. Theme state should be managed in presentation/application UI state, not in domain rules.
10. The implementation should use small reusable components and avoid duplicating theme logic across screens.
11. A manually selected theme must override system preference on subsequent visits.
12. The implementation must not add Tailwind v3 configuration or external theme packages.

## Technical Requirements

1. Add a focused theme hook, for example `use-theme-preference`.
2. Store the selected theme in `localStorage`.
3. Apply the theme using a root class or data attribute.
4. Keep theme styling centralized in `app/globals.css` or small shared style conventions.
5. Do not introduce a Tailwind v3-style config.
6. Do not place theme behavior in planning poker domain/application business rules.
7. Avoid external theme dependencies.
8. Validate with `npm run lint` and `npm run build`.

## Acceptance Criteria

1. Given the user opens the app for the first time, the theme follows system preference when available.
2. Given no system preference is available, the app starts in dark mode.
3. Given the user toggles to light mode, the UI changes to a readable light theme.
4. Given the user toggles to dark mode, the UI changes to a readable dark theme.
5. Given the user refreshes, the previously selected theme is restored.
6. Given the user is on the entry screen, the selected theme is applied.
7. Given the user is inside a room, the selected theme is applied.
8. The theme toggle is visible and operable by keyboard.
9. The theme toggle has visible text or an accessible name.
10. `npm run lint` passes.
11. `npm run build` passes.

## Risks / Tradeoffs

- The current UI uses many explicit dark Tailwind classes, so light mode may require either CSS variable refactoring or targeted class updates.
- A full design-system theme refactor may be larger than this story requires.
- Persisting explicit user choice should override system preference after the first toggle.
- If theme is applied only after hydration, there may be a brief flash of the default theme.

## Applicable Skills

- `frontend-design`: Useful if the light theme needs polished visual treatment instead of only inverting colors.
- `accessibility`: Useful for checking contrast in both themes.
- `vercel-react-best-practices`: Useful for keeping theme state centralized and avoiding unnecessary re-renders.

## Skill-Based Validation

- Accessibility validation: Check contrast and keyboard operability for the theme toggle.
- React validation: Confirm the toggle is presentational and theme logic is centralized in a hook/provider.
- Design validation: Confirm light and dark themes are both readable and visually coherent.
- Build validation: Run `npm run lint` and `npm run build`.
