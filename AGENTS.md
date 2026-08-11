# AGENTS.md

## Project Overview

This repository contains Achievement Bingo, an OBS-friendly web bingo board tool for tracking game goals. The app is intended to run as a client-side web application, be captured primarily by OBS window capture from a normal browser window, and deploy cleanly to Cloudflare.

Primary requirements are documented in [SPEC.md](./SPEC.md).

## Current Product Requirements

- Build a web bingo board that can be displayed in OBS.
- Accept newline-separated user-entered items.
- Automatically choose a square board size from the number of items.
- Fill missing cells with `Free Space`, biased toward the center of the board.
- Allow random item shuffling.
- Allow cells to be opened/closed and highlighted through the `marked` state in the normal state.
- Allow drag-and-drop rearrangement only while `arrangeMode` is enabled.
- Show reach lines when a row, column, or diagonal is one cell away from bingo.
- Show bingo lines when a row, column, or diagonal is fully marked.
- Support Japanese and English UI text.
- Support light and dark themes, with light as the default.
- Support per-board bingo cell font size scaling with a range control.
- Include a localized Faaast Penguin bingo sample as the default Board 1 state.
- Keep Board 1 default title localized as `Faaast Penguin （サンプル）` or `Faaast Penguin (Sample)`.
- Auto-save state to LocalStorage.
- Restore saved state after reload.
- Support up to 3 saved boards and one-click board switching.
- Support normal window-capture operation where the visible browser page is captured and unnecessary UI is cropped in OBS.
- Provide a clear-all-selections action that unmarks item cells while keeping Free Space marked.
- Provide a reset-current-board action that rebuilds the active board from the current locale's default state.
- Include a footer with `©UTAGE.GAMES` and a localized feedback link.
- Optionally install Google Analytics only when `VITE_GA_MEASUREMENT_ID` is provided at build time.
- Include Japanese OGP metadata and `public/ogp.png` for SNS sharing.
- Keep `?view=overlay` as a secondary browser-source-oriented mode, with clear awareness that LocalStorage may not be shared with OBS browser sources.
- Target Cloudflare deployment.

## Recommended Stack

Prefer this stack unless the repository already contains a different implemented direction:

- Vite
- TypeScript
- React
- CSS Modules or plain CSS
- `@dnd-kit` for drag-and-drop
- Vitest for unit tests
- Playwright for browser-level checks when UI behavior is involved

Keep the first implementation client-only. Do not add a server, database, authentication, or external persistence unless explicitly requested.

## React File Organization

When implementing in React, split files by responsibility rather than concentrating logic in `App.tsx`.

Preferred organization:

```text
src/
  components/
    BingoBoard/
    BoardCell/
    BoardSwitcher/
    EditorPanel/
    DisplayShell/
    Toolbar/
  hooks/
    useAppState.ts
    useLocalStorageState.ts
  lib/
    boardSize.ts
    freeSpace.ts
    layout.ts
    lineStatus.ts
    shuffle.ts
    storage.ts
    i18n.ts
  types/
    bingo.ts
```

Keep pure behavior in `src/lib/` so it can be unit tested without rendering React. Keep React components focused on rendering and user interaction.

## Development Principles

- Keep behavior deterministic except for the explicit shuffle action.
- Treat `rawInput` as the source of truth for entered item text.
- Preserve the user-arranged layout when edits do not require a full layout rebuild.
- Preserve `marked` state for existing items when regenerating layouts.
- Preserve count cell `currentCount` and `targetCount` for existing items when regenerating layouts.
- Treat Free Space cells as marked by default.
- Treat Free Space cells as fixed: do not make them draggable, droppable, clickable to unmark, or part of shuffle.
- Compute reach and bingo line status from the current layout instead of storing derived line state.
- Resolve visual state priority as `bingo > reach > marked > normal`.
- Make LocalStorage parsing defensive and versioned.
- Avoid writing unrelated refactors while implementing product features.
- Treat the normal state as the primary bingo operation state.
- Keep `arrangeMode` narrowly scoped to drag-and-drop rearrangement.
- Design the normal browser page for OBS window capture with stable board position, app-owned background, and easy OBS cropping.
- Keep overlay mode as a secondary path for browser sources, and do not assume it can read LocalStorage written by a normal browser profile.
- Keep overlay mode interactive for cell marking unless a future explicit read-only option is added.
- Keep user-entered bingo item labels untranslated; localize only UI chrome and built-in labels.
- Store theme per board and do not let theme changes alter item text, layout, or marked state.
- Store cell font scale per board and do not let font size changes alter item text, layout, or marked state.
- When resetting a board, use the current locale for built-in sample titles and sample item labels.
- Do not auto-overwrite valid existing LocalStorage data when defaults change; apply new defaults through explicit reset or fresh storage only.
- Keep the clear-all-selections action scoped to item cells; Free Space must remain marked and count cells should reset `currentCount` to 0.
- Prefer small, focused modules over large files.
- Avoid putting board generation, storage migration, line detection, and translation dictionaries directly in React components.
- Add concise Japanese comments where the intent may not be obvious to the project owner.
- Comments should explain why the code exists or which product rule it protects, not restate simple syntax.
- Prefer accessible HTML controls and clear button labels.
- Keep CSS responsive across 1920x1080, 1280x720, and mobile widths.

## Design Principles

- Prioritize readability on stream over decoration.
- Default to a light-leaning visual theme with clear borders and dark readable text.
- Provide a dark theme for darker stream layouts while preserving clear state contrast.
- Treat the normal state as the main bingo operation surface: cell marking works immediately on first load.
- Provide a range control for bingo cell font size, with 100% as the default for new or reset boards.
- Keep the browser page as a compact work surface: board preview plus practical controls for slots, input, shuffle, theme, and language.
- Place theme, language, and transparent background controls as a separate appearance/environment group.
- Place font size in the right-aligned display group.
- Use icon-plus-text option button groups instead of dropdowns for theme and language; show every option and highlight the selected one with background color rather than heavy borders or shadows.
- Place the shuffle action near the item input area because it acts on entered bingo items.
- Include a short guide in the editor panel explaining that normal use opens/closes cells and arrange mode allows drag rearrangement.
- Keep destructive or broad actions visually subdued, especially reset-current-board.
- Place clear-all-selections directly above reset-current-board in the editor panel.
- Use clear state styling for normal, Free Space, marked, reach, bingo, dragging, and drop-target states.
- When arrange mode is enabled, show the state on the board itself with subtle board-base coloring and item-cell affordance, not only on the toggle button.
- Do not rely on color alone for important states; combine color with border, icon, shadow, or line emphasis.
- Keep animations subtle and brief so they do not distract on stream.
- Use restrained border radii and avoid overly decorative card-heavy layouts.
- Ensure Japanese and English labels fit without clipping.
- Keep line-height generous enough that English descenders such as `g` and `y` are not clipped in titles, controls, or board cells.
- Avoid board-cell text clipping techniques that cut tightly at the final line, such as `-webkit-line-clamp`; prefer max-height with explicit bottom breathing room.
- Use board-size-based font steps and line clamps so long labels remain contained.

## Data Contract

Use this LocalStorage key unless deliberately migrating:

```text
achievement-bingo:v1
```

Expected shape:

```ts
type AppState = {
  version: 4;
  activeBoardId: "board-1" | "board-2" | "board-3";
  arrangeMode: boolean;
  locale: "ja" | "en";
  boards: Record<BoardId, BoardState>;
};
```

When changing the schema, increment the version and add a migration path. Never silently discard valid user board data.

## Board Generation Rules

Board size:

```text
boardSize = max(1, ceil(sqrt(itemCount)))
```

Free Space count:

```text
freeSpaceCount = boardSize * boardSize - itemCount
```

Free Space placement:

- Compute every board coordinate.
- Sort by squared distance from board center.
- Use the nearest coordinates for Free Space cells.
- Fill all other cells with item cells in the current item order.

This behavior should be covered by unit tests.

Default boards:

- Board 1 should initialize as a localized Faaast Penguin bingo sample with 24 item cells and one centered Free Space.
- In the English Faaast Penguin sample, translate Japanese `スペシャル` as `Ultimate Ride`.
- Board 2 and Board 3 should initialize as empty boards.
- Resetting the active board should recreate that board's default for the current locale.
- Existing saved LocalStorage should take precedence over changed defaults until the user explicitly resets.

## Marking, Reach, and Bingo Rules

Cell marking is part of the initial scope.

- Clicking or tapping an item cell toggles its `marked` state while `arrangeMode` is off.
- Item input lines ending with ` x<number>` or ` ×<number>` where number is greater than 1 create count cells.
- Count cells increment `currentCount` by 1 per click while `arrangeMode` is off and become marked only when `currentCount >= targetCount`.
- Count cells show progress and a small decrement button; decrementing below target clears `marked`.
- Count progress and decrement controls should sit together at the bottom right, ordered as progress then decrement.
- Count progress and decrement controls should use matching visual heights.
- Count decrement buttons remain visible in a subdued disabled state at 0 and must stop propagation so they never increment the parent cell.
- Marked cells are visually highlighted.
- Free Space cells start as `marked: true` and cannot be unmarked.
- Rows, columns, and the two diagonals are bingo line candidates.
- A line is `bingo` when every cell in it is marked.
- A line is `reach` when exactly one cell is unmarked and the line is not already bingo.
- Derived line status should not be persisted; recompute it from `layout`.
- Visual priority is `bingo > reach > marked > normal`.

This behavior should be covered by unit tests.

## Internationalization Rules

Japanese and English are part of the initial scope.

- Supported locales are `ja` and `en`.
- Use a small typed dictionary or equivalent local translation module.
- Default to Japanese when `navigator.language` starts with `ja`; otherwise default to English.
- Allow URL query overrides with `?lang=ja` and `?lang=en`.
- Store the selected locale in LocalStorage.
- Do not translate user-entered board item text.
- Built-in sample board titles and sample item labels are system-provided content and should be localized.

## Arrange Mode Rules

Cell marking is the default behavior. Drag rearrangement is allowed only when arrange mode is enabled.

Always available on the normal browser page:

- Text input edits
- Random shuffle
- Slot name edits
- Appearance changes
- Cell marking when `arrangeMode` is off

Allowed only while `arrangeMode` is on:

- Drag-and-drop

Cell marking is intentionally disabled while `arrangeMode` is on to avoid conflicts with drag-and-drop.

Overlay mode is secondary and must default to display-only chrome, but browser-source LocalStorage isolation means it may start empty unless the state was created in the same browser context.

## Footer and Links

- Show a subdued footer on the normal browser page.
- Link `©UTAGE.GAMES` to `https://utage.games/`.
- Link feedback to `https://github.com/utagestudio/bingo/issues`.
- Use `バグ報告・機能要望` for Japanese feedback text.
- Use `Bug Reports & Feature Requests` for English feedback text.
- Hide or minimize footer presence in overlay mode so OBS capture stays clean.

## Testing Expectations

For logic changes, add or update unit tests for:

- item parsing
- board size calculation
- center-biased Free Space placement
- Free Space exclusion from drag-and-drop, shuffle, and unmarking
- layout regeneration
- marked state preservation during layout regeneration
- item ID preservation for label edits and predictable row add/delete behavior
- reach and bingo line detection
- visual priority calculation for `bingo > reach > marked > normal`
- LocalStorage encode/decode or migration helpers
- locale initialization, persistence, and URL query override
- theme persistence and restoration
- cell font size persistence and restoration

For UI changes, manually or automatically verify:

- arrange mode gates drag-and-drop
- arrange mode disables cell marking
- cell marking works while arrange mode is off
- Free Space cannot be dragged or unmarked
- board switching works for all 3 slots
- reload restores state
- the normal browser page remains easy to crop in OBS
- overlay URL hides controls
- overlay still renders marked, reach, and bingo states correctly
- Japanese and English UI can be switched
- light and dark themes can be switched and normal/overlay views update immediately
- bingo cell font size can be adjusted and board text updates immediately
- the board remains readable at common OBS sizes

Before handing off implementation work, run the most relevant available checks, such as:

```bash
npm run build
npm test
```

If tests or build commands are not yet available, say so explicitly in the final handoff.

## Cloudflare Notes

The app should build to static assets, normally `dist/`.

If using Workers Static Assets, configure Wrangler so the built static directory is served. For SPA routing, set the assets not-found behavior to serve `index.html`.

For Google Analytics, use the build-time variable `VITE_GA_MEASUREMENT_ID`. In Cloudflare, configure it through Variables and secrets for the build environment. Do not hard-code GA measurement IDs in source files.

Do not add Cloudflare KV, D1, Durable Objects, or Workers API routes unless the user asks for shared online persistence or server-side features.

## Documentation

Keep [SPEC.md](./SPEC.md) aligned with product behavior. If implementation decisions differ from the current spec, update the spec in the same change.

When a product requirement changes or a new behavior is added, update [SPEC.md](./SPEC.md) in the same small unit of work. If the change affects future development rules, implementation conventions, commit policy, or handoff context, update [AGENTS.md](./AGENTS.md) as well.

When adding setup commands, deployment commands, or environment requirements, document them in `README.md` once a runnable app exists.

## Commit Message Rules

When making commits for this project:

- Write the commit subject in English.
- Add the detailed commit body in Japanese.
- Do not insert unnecessary blank lines in the commit body.
- Keep the Japanese body concise but specific enough to explain what changed and why.
- During implementation, commit in small units whenever practical.
- For implementation work, commits may be created as progress is made without waiting for explicit user confirmation each time.
