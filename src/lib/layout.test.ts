import { describe, expect, it } from "vitest";
import type { BingoItem } from "../types/bingo";
import {
  buildLayout,
  reorderItemCells,
  shuffleItemCells,
  toggleCellMarked,
} from "./layout";

function createItems(count: number): BingoItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }));
}

describe("layout", () => {
  it("builds a layout with center-biased fixed Free Space cells", () => {
    const layout = buildLayout(createItems(8));

    expect(layout).toHaveLength(9);
    expect(layout[4]).toMatchObject({
      type: "free",
      label: "Free Space",
      marked: true,
    });
  });

  it("preserves marked state and label updates by item id", () => {
    const items = createItems(4);
    const layout = toggleCellMarked(buildLayout(items), "cell-item-2");
    const nextLayout = buildLayout(
      [
        items[0],
        { ...items[1], label: "Updated" },
        items[2],
        items[3],
      ],
      layout,
    );

    expect(nextLayout[1]).toMatchObject({
      itemId: "item-2",
      label: "Updated",
      marked: true,
    });
  });

  it("does not reorder when a Free Space is dragged or targeted", () => {
    const layout = buildLayout(createItems(8));

    expect(reorderItemCells(layout, "free-4", "cell-item-1")).toBe(layout);
    expect(reorderItemCells(layout, "cell-item-1", "free-4")).toBe(layout);
  });

  it("keeps Free Space fixed while shuffling item cells", () => {
    const layout = buildLayout(createItems(8));
    const shuffled = shuffleItemCells(layout);

    expect(shuffled[4].type).toBe("free");
    expect(shuffled.filter((cell) => cell.type === "item")).toHaveLength(8);
  });

  it("does not unmark Free Space cells", () => {
    const layout = buildLayout(createItems(8));
    const nextLayout = toggleCellMarked(layout, "free-4");

    expect(nextLayout[4].marked).toBe(true);
  });
});
