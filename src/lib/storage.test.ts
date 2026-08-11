import { describe, expect, it } from "vitest";
import { createDefaultBoard, createDefaultState, sanitizeState } from "./storage";

describe("storage defaults", () => {
  it("creates a Japanese Faaast Penguin sample for Board 1 by default locale", () => {
    const board = createDefaultBoard("board-1", "ja");

    expect(board.name).toBe("Faaast Penguin （サンプル）");
    expect(board.items).toHaveLength(24);
    expect(board.rawInput).toContain("ツアーに1位になる");
    expect(board.rawInput).toContain("缶詰を10個集めないでゴールする");
    expect(board.layout).toHaveLength(25);
    expect(board.layout[12]).toMatchObject({ type: "free", marked: true });
    expect(board.appearance.cellFontScale).toBe(100);
  });

  it("creates an English Faaast Penguin sample when the locale is English", () => {
    const state = createDefaultState("en");
    const board = state.boards["board-1"];

    expect(board.name).toBe("Faaast Penguin (Sample)");
    expect(board.items).toHaveLength(24);
    expect(board.rawInput).toContain("Finish 1st in a Tour");
    expect(board.rawInput).toContain(
      "Use your Ultimate Ride 3 times in one Activity",
    );
    expect(board.rawInput).toContain("Finish without using your Ultimate Ride");
    expect(board.rawInput).toContain("Finish without collecting 10 sardine cans");
    expect(board.layout[12]).toMatchObject({ type: "free", marked: true });
    expect(state.version).toBe(4);
    expect(state.arrangeMode).toBe(false);
  });

  it("migrates v1 edit mode state to v4 arrange mode without losing board data", () => {
    const fallback = createDefaultState("ja");
    const migrated = sanitizeState(
      {
        version: 1,
        activeBoardId: "board-2",
        editMode: true,
        locale: "en",
        boards: {
          "board-1": fallback.boards["board-1"],
          "board-2": {
            ...fallback.boards["board-2"],
            name: "Custom board",
            rawInput: "Alpha\nBeta\nGamma",
            items: [
              { id: "item-a", label: "Alpha" },
              { id: "item-b", label: "Beta" },
              { id: "item-c", label: "Gamma" },
            ],
            layout: [
              {
                id: "cell-item-a",
                type: "item",
                itemId: "item-a",
                label: "Alpha",
                marked: true,
              },
              {
                id: "cell-item-b",
                type: "item",
                itemId: "item-b",
                label: "Beta",
                marked: false,
              },
              {
                id: "cell-item-c",
                type: "item",
                itemId: "item-c",
                label: "Gamma",
                marked: false,
              },
              {
                id: "free-3",
                type: "free",
                label: "Free Space",
                marked: true,
              },
            ],
            appearance: {
              transparentBackground: true,
              theme: "dark",
              displayScale: "compact",
            },
          },
          "board-3": fallback.boards["board-3"],
        },
      },
      fallback,
    );

    expect(migrated.version).toBe(4);
    expect(migrated.activeBoardId).toBe("board-2");
    expect(migrated.locale).toBe("en");
    expect(migrated.arrangeMode).toBe(false);
    expect(migrated.boards["board-2"].name).toBe("Custom board");
    expect(
      migrated.boards["board-2"].layout.find((cell) => cell.itemId === "item-a"),
    ).toMatchObject({
      itemId: "item-a",
      marked: true,
    });
    expect(migrated.boards["board-2"].appearance).toMatchObject({
      transparentBackground: true,
      theme: "dark",
      cellFontScale: 90,
    });
  });

  it("clamps restored cell font scale to the supported range", () => {
    const fallback = createDefaultState("ja");
    const restored = sanitizeState(
      {
        version: 4,
        activeBoardId: "board-1",
        arrangeMode: true,
        locale: "ja",
        boards: {
          "board-1": {
            ...fallback.boards["board-1"],
            appearance: {
              ...fallback.boards["board-1"].appearance,
              cellFontScale: 200,
            },
          },
          "board-2": {
            ...fallback.boards["board-2"],
            appearance: {
              ...fallback.boards["board-2"].appearance,
              cellFontScale: 40,
            },
          },
          "board-3": fallback.boards["board-3"],
        },
      },
      fallback,
    );

    expect(restored.arrangeMode).toBe(true);
    expect(restored.boards["board-1"].appearance.cellFontScale).toBe(140);
    expect(restored.boards["board-2"].appearance.cellFontScale).toBe(80);
  });

  it("restores count cell progress from v4 data", () => {
    const fallback = createDefaultState("ja");
    const restored = sanitizeState(
      {
        version: 4,
        activeBoardId: "board-2",
        arrangeMode: false,
        locale: "ja",
        boards: {
          "board-1": fallback.boards["board-1"],
          "board-2": {
            ...fallback.boards["board-2"],
            rawInput: "Greeting x3",
            items: [{ id: "item-a", label: "Greeting", targetCount: 3 }],
            layout: [
              {
                id: "cell-item-a",
                type: "item",
                itemId: "item-a",
                label: "Greeting",
                marked: false,
                targetCount: 3,
                currentCount: 2,
              },
            ],
          },
          "board-3": fallback.boards["board-3"],
        },
      },
      fallback,
    );

    expect(restored.boards["board-2"].layout[0]).toMatchObject({
      label: "Greeting",
      targetCount: 3,
      currentCount: 2,
      marked: false,
    });
  });
});
