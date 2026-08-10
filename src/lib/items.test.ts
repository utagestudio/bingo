import { describe, expect, it } from "vitest";
import { parseInputLines, reconcileItems } from "./items";

describe("items", () => {
  it("parses non-empty trimmed input lines", () => {
    expect(parseInputLines(" Alpha \n\nBeta\r\n Gamma ")).toEqual([
      "Alpha",
      "Beta",
      "Gamma",
    ]);
  });

  it("preserves item ids by row position when labels change", () => {
    const items = reconcileItems("Alpha\nBeta", []);
    const nextItems = reconcileItems("Alpha\nBravo", items);

    expect(nextItems).toEqual([
      { id: items[0].id, label: "Alpha" },
      { id: items[1].id, label: "Bravo" },
    ]);
  });
});
