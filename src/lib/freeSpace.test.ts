import { describe, expect, it } from "vitest";
import { getCenterBiasedFreeIndexes } from "./freeSpace";

describe("freeSpace", () => {
  it("places one Free Space in the center of an odd board", () => {
    expect([...getCenterBiasedFreeIndexes(3, 1)]).toEqual([4]);
  });

  it("places four Free Spaces in the center of an even board", () => {
    expect([...getCenterBiasedFreeIndexes(4, 4)]).toEqual([5, 6, 9, 10]);
  });
});
