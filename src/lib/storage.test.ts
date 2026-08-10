import { describe, expect, it } from "vitest";
import { createDefaultBoard, createDefaultState } from "./storage";

describe("storage defaults", () => {
  it("creates a Japanese Faaast Penguin sample for Board 1 by default locale", () => {
    const board = createDefaultBoard("board-1", "ja");

    expect(board.name).toBe("Faaast Penguin （サンプル）");
    expect(board.items).toHaveLength(24);
    expect(board.rawInput).toContain("ツアーに1位になる");
    expect(board.rawInput).toContain("缶詰を10個集めないでゴールする");
    expect(board.layout).toHaveLength(25);
    expect(board.layout[12]).toMatchObject({ type: "free", marked: true });
    expect(board.appearance.displayScale).toBe("standard");
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
  });
});
