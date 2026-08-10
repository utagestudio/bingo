import { describe, expect, it } from "vitest";
import type { BingoCell } from "../types/bingo";
import { buildLayout, toggleCellMarked } from "./layout";
import { getCellVisualStatuses, getLineStatuses } from "./lineStatus";

function mark(layout: BingoCell[], cellIds: string[]): BingoCell[] {
  return cellIds.reduce((nextLayout, cellId) => {
    const cell = nextLayout.find((candidate) => candidate.id === cellId);
    if (cell?.marked) {
      return nextLayout;
    }

    return toggleCellMarked(nextLayout, cellId);
  }, layout);
}

describe("lineStatus", () => {
  it("detects reach and bingo lines", () => {
    const layout = mark(buildLayout([]), []);
    const statuses = getLineStatuses(layout);

    expect(statuses.every((line) => line.status === "bingo")).toBe(true);
  });

  it("prioritizes bingo over reach over marked", () => {
    const items = Array.from({ length: 9 }, (_, index) => ({
      id: `item-${index + 1}`,
      label: `Item ${index + 1}`,
    }));
    const layout = mark(buildLayout(items), [
      "cell-item-1",
      "cell-item-2",
      "cell-item-3",
      "cell-item-4",
      "cell-item-7",
    ]);
    const lines = getLineStatuses(layout);
    const visualStatuses = getCellVisualStatuses(layout, lines);

    expect(lines).toContainEqual(
      expect.objectContaining({ kind: "row", index: 0, status: "bingo" }),
    );
    expect(lines).toContainEqual(
      expect.objectContaining({ kind: "column", index: 0, status: "bingo" }),
    );
    expect(lines).toContainEqual(
      expect.objectContaining({ kind: "diagonal", index: 1, status: "reach" }),
    );
    expect(visualStatuses["cell-item-1"]).toBe("bingo");
    expect(visualStatuses["cell-item-5"]).toBe("reach");
  });

  it("keeps marked cells visually distinct from the unmarked reach target", () => {
    const items = Array.from({ length: 9 }, (_, index) => ({
      id: `item-${index + 1}`,
      label: `Item ${index + 1}`,
    }));
    const layout = mark(buildLayout(items), ["cell-item-1", "cell-item-2"]);
    const lines = getLineStatuses(layout);
    const visualStatuses = getCellVisualStatuses(layout, lines);

    expect(lines).toContainEqual(
      expect.objectContaining({ kind: "row", index: 0, status: "reach" }),
    );
    expect(visualStatuses["cell-item-1"]).toBe("marked");
    expect(visualStatuses["cell-item-2"]).toBe("marked");
    expect(visualStatuses["cell-item-3"]).toBe("reach");
  });
});
