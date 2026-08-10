import { describe, expect, it } from "vitest";
import { calculateBoardSize, calculateFreeSpaceCount } from "./boardSize";

describe("boardSize", () => {
  it("calculates a square board size from item count", () => {
    expect(calculateBoardSize(0)).toBe(1);
    expect(calculateBoardSize(1)).toBe(1);
    expect(calculateBoardSize(2)).toBe(2);
    expect(calculateBoardSize(4)).toBe(2);
    expect(calculateBoardSize(5)).toBe(3);
    expect(calculateBoardSize(17)).toBe(5);
  });

  it("calculates missing Free Space count", () => {
    expect(calculateFreeSpaceCount(8)).toBe(1);
    expect(calculateFreeSpaceCount(12)).toBe(4);
    expect(calculateFreeSpaceCount(16)).toBe(0);
  });
});
