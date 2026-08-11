import { describe, expect, it } from "vitest";
import { parseInputLines, parseItemLine, reconcileItems } from "./items";

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

  it("parses a trailing count target from x notation", () => {
    expect(parseItemLine("挨拶をもらう x10")).toEqual({
      label: "挨拶をもらう",
      targetCount: 10,
    });
    expect(parseItemLine("挨拶をもらう ×3")).toEqual({
      label: "挨拶をもらう",
      targetCount: 3,
    });
  });

  it("keeps invalid or inline x notation as normal text", () => {
    expect(parseItemLine("Xtreeemeを決める")).toEqual({
      label: "Xtreeemeを決める",
    });
    expect(parseItemLine("挨拶をもらう x1")).toEqual({
      label: "挨拶をもらう x1",
    });
    expect(parseItemLine("挨拶をもらう xabc")).toEqual({
      label: "挨拶をもらう xabc",
    });
  });

  it("keeps item ids while updating count targets", () => {
    const items = reconcileItems("Greeting x10", []);
    const nextItems = reconcileItems("Greeting x12", items);

    expect(nextItems).toEqual([
      { id: items[0].id, label: "Greeting", targetCount: 12 },
    ]);
  });
});
