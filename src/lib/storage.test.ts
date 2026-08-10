import { describe, expect, it } from "vitest";
import { createDefaultBoard, createDefaultState } from "./storage";

describe("storage defaults", () => {
  it("creates a Japanese Minecraft sample for Board 1 by default locale", () => {
    const board = createDefaultBoard("board-1", "ja");

    expect(board.name).toBe("マインクラフトビンゴ（サンプル）");
    expect(board.items).toHaveLength(24);
    expect(board.rawInput).toContain("木を1スタック集める");
    expect(board.layout).toHaveLength(25);
    expect(board.layout[12]).toMatchObject({ type: "free", marked: true });
    expect(board.appearance.displayScale).toBe("standard");
  });

  it("creates an English Minecraft sample when the locale is English", () => {
    const state = createDefaultState("en");
    const board = state.boards["board-1"];

    expect(board.name).toBe("Minecraft Bingo (Sample)");
    expect(board.items).toHaveLength(24);
    expect(board.rawInput).toContain("Collect a stack of wood");
    expect(board.layout[12]).toMatchObject({ type: "free", marked: true });
  });
});
