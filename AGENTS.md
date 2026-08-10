# AGENTS.md

## Project Overview

This repository contains an OBS-friendly web bingo board tool. The app is intended to run as a client-side web application, be captured primarily by OBS window capture from a normal browser window, and deploy cleanly to Cloudflare.

Primary requirements are documented in [SPEC.md](./SPEC.md).

## Current Product Requirements

- Build a web bingo board that can be displayed in OBS.
- Accept newline-separated user-entered items.
- Automatically choose a square board size from the number of items.
- Fill missing cells with `Free Space`, biased toward the center of the board.
- Allow random item shuffling.
- Allow drag-and-drop rearrangement only in edit mode.
- Allow cells to be opened/closed and highlighted through the `marked` state.
- Show reach lines when a row, column, or diagonal is one cell away from bingo.
- Show bingo lines when a row, column, or diagonal is fully marked.
- Support Japanese and English UI text.
- Auto-save state to LocalStorage.
- Restore saved state after reload.
- Support up to 3 saved boards and one-click board switching.
- Support a display mode for OBS window capture where editing UI is hidden.
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
- Treat Free Space cells as marked by default.
- Compute reach and bingo line status from the current layout instead of storing derived line state.
- Make LocalStorage parsing defensive and versioned.
- Avoid writing unrelated refactors while implementing product features.
- Treat edit mode OFF as the primary OBS capture presentation state.
- Keep display mode visually clean: no editing controls should appear except a minimal way to return to editing.
- Design display mode for OBS window capture: stable board position, stable outer spacing, app-owned background, and easy OBS cropping.
- Keep overlay mode as a secondary path for browser sources, and do not assume it can read LocalStorage written by a normal browser profile.
- Keep overlay mode interactive for cell marking unless a future explicit read-only option is added.
- Keep user-entered bingo item labels untranslated; localize only UI chrome and built-in labels.
- Prefer small, focused modules over large files.
- Avoid putting board generation, storage migration, line detection, and translation dictionaries directly in React components.
- Add concise Japanese comments where the intent may not be obvious to the project owner.
- Comments should explain why the code exists or which product rule it protects, not restate simple syntax.
- Prefer accessible HTML controls and clear button labels.
- Keep CSS responsive across 1920x1080, 1280x720, and mobile widths.

## Data Contract

Use this LocalStorage key unless deliberately migrating:

```text
obs-bingo-tool:v1
```

Expected shape:

```ts
type AppState = {
  version: 1;
  activeBoardId: "board-1" | "board-2" | "board-3";
  editMode: boolean;
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

## Marking, Reach, and Bingo Rules

Cell marking is part of the initial scope.

- Clicking or tapping a cell toggles its `marked` state.
- Marked cells are visually highlighted.
- Free Space cells start as `marked: true`.
- Rows, columns, and the two diagonals are bingo line candidates.
- A line is `bingo` when every cell in it is marked.
- A line is `reach` when exactly one cell is unmarked and the line is not already bingo.
- Derived line status should not be persisted; recompute it from `layout`.

This behavior should be covered by unit tests.

## Internationalization Rules

Japanese and English are part of the initial scope.

- Supported locales are `ja` and `en`.
- Use a small typed dictionary or equivalent local translation module.
- Default to Japanese when `navigator.language` starts with `ja`; otherwise default to English.
- Allow URL query overrides with `?lang=ja` and `?lang=en`.
- Store the selected locale in LocalStorage.
- Do not translate user-entered board item text.

## Edit Mode Rules

Editing is only allowed when edit mode is enabled.

Allowed in edit mode:

- Text input edits
- Random shuffle
- Drag-and-drop
- Slot name edits
- Appearance changes

Disabled or hidden outside edit mode:

- Text input
- Shuffle
- Drag-and-drop
- Layout-changing controls

Edit mode OFF must behave like the primary OBS display mode.

Display mode requirements:

- Hide the editor panel and layout-changing controls.
- Keep the board centered and large.
- Keep app background visible for capture.
- Keep spacing stable so OBS cropping remains reliable.
- Provide a minimal edit-return affordance or shortcut.

Overlay mode is secondary and must default to display-only chrome, but browser-source LocalStorage isolation means it may start empty unless the state was created in the same browser context.

## Testing Expectations

For logic changes, add or update unit tests for:

- item parsing
- board size calculation
- center-biased Free Space placement
- layout regeneration
- marked state preservation during layout regeneration
- reach and bingo line detection
- LocalStorage encode/decode or migration helpers
- locale initialization, persistence, and URL query override

For UI changes, manually or automatically verify:

- edit mode gates layout-changing actions
- cell marking works outside edit mode
- board switching works for all 3 slots
- reload restores state
- edit mode OFF hides editing controls and is suitable for OBS window capture
- display mode remains easy to crop in OBS
- overlay URL hides controls
- overlay still renders marked, reach, and bingo states correctly
- Japanese and English UI can be switched
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

Do not add Cloudflare KV, D1, Durable Objects, or Workers API routes unless the user asks for shared online persistence or server-side features.

## Documentation

Keep [SPEC.md](./SPEC.md) aligned with product behavior. If implementation decisions differ from the current spec, update the spec in the same change.

When adding setup commands, deployment commands, or environment requirements, document them in `README.md` once a runnable app exists.

## Commit Message Rules

When making commits for this project:

- Write the commit subject in English.
- Add the detailed commit body in Japanese.
- Do not insert unnecessary blank lines in the commit body.
- Keep the Japanese body concise but specific enough to explain what changed and why.
