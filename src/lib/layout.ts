import type { BingoCell, BingoItem } from "../types/bingo";
import { calculateBoardSize } from "./boardSize";
import { getCenterBiasedFreeIndexes } from "./freeSpace";

function createFreeCell(index: number): BingoCell {
  return {
    id: `free-${index}`,
    type: "free",
    label: "Free Space",
    marked: true,
  };
}

function createItemCell(item: BingoItem, previous?: BingoCell): BingoCell {
  const currentCount =
    item.targetCount && previous?.targetCount === item.targetCount
      ? Math.min(previous.currentCount ?? 0, item.targetCount)
      : 0;

  return {
    id: previous?.id ?? `cell-${item.id}`,
    type: "item",
    itemId: item.id,
    label: item.label,
    marked: item.targetCount
      ? currentCount >= item.targetCount
      : previous?.marked ?? false,
    targetCount: item.targetCount,
    currentCount: item.targetCount ? currentCount : undefined,
  };
}

export function getOrderedItemCells(
  items: BingoItem[],
  previousLayout: BingoCell[],
): BingoCell[] {
  const itemById = new Map(items.map((item) => [item.id, item]));
  const previousItemCells = previousLayout.filter(
    (cell) => cell.type === "item" && cell.itemId && itemById.has(cell.itemId),
  );
  const usedItemIds = new Set(previousItemCells.map((cell) => cell.itemId));
  const appendedItems = items.filter((item) => !usedItemIds.has(item.id));

  const preservedCells = previousItemCells.map((cell) => {
    const item = itemById.get(cell.itemId as string);
    return createItemCell(item as BingoItem, cell);
  });

  return [
    ...preservedCells,
    ...appendedItems.map((item) => createItemCell(item)),
  ];
}

export function buildLayout(
  items: BingoItem[],
  previousLayout: BingoCell[] = [],
): BingoCell[] {
  const boardSize = calculateBoardSize(items.length);
  const cellCount = boardSize * boardSize;
  const freeIndexes = getCenterBiasedFreeIndexes(
    boardSize,
    cellCount - items.length,
  );
  const itemCells = getOrderedItemCells(items, previousLayout);
  let nextItemIndex = 0;

  return Array.from({ length: cellCount }, (_, index) => {
    if (freeIndexes.has(index)) {
      return createFreeCell(index);
    }

    const itemCell = itemCells[nextItemIndex];
    nextItemIndex += 1;

    return itemCell;
  });
}

export function shuffleItemCells(layout: BingoCell[]): BingoCell[] {
  const itemCells = layout.filter((cell) => cell.type === "item");
  const shuffled = [...itemCells];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ];
  }

  let nextItemIndex = 0;

  // Free Spaceは固定位置のまま、項目セルだけを入れ替える。
  return layout.map((cell) => {
    if (cell.type === "free") {
      return cell;
    }

    const nextCell = shuffled[nextItemIndex];
    nextItemIndex += 1;
    return nextCell;
  });
}

export function reorderItemCells(
  layout: BingoCell[],
  activeCellId: string,
  overCellId: string,
): BingoCell[] {
  const activeCell = layout.find((cell) => cell.id === activeCellId);
  const overCell = layout.find((cell) => cell.id === overCellId);

  if (!activeCell || !overCell) {
    return layout;
  }

  if (activeCell.type === "free" || overCell.type === "free") {
    return layout;
  }

  const activeIndex = layout.findIndex((cell) => cell.id === activeCellId);
  const overIndex = layout.findIndex((cell) => cell.id === overCellId);
  const nextLayout = [...layout];

  [nextLayout[activeIndex], nextLayout[overIndex]] = [
    nextLayout[overIndex],
    nextLayout[activeIndex],
  ];

  return nextLayout;
}

export function advanceCellProgress(
  layout: BingoCell[],
  cellId: string,
): BingoCell[] {
  return layout.map((cell) => {
    if (cell.id !== cellId || cell.type === "free") {
      return cell;
    }

    if (cell.targetCount) {
      const currentCount = Math.min(
        cell.targetCount,
        (cell.currentCount ?? 0) + 1,
      );

      return {
        ...cell,
        currentCount,
        marked: currentCount >= cell.targetCount,
      };
    }

    return {
      ...cell,
      marked: !cell.marked,
    };
  });
}

export function decrementCellProgress(
  layout: BingoCell[],
  cellId: string,
): BingoCell[] {
  return layout.map((cell) => {
    if (cell.id !== cellId || cell.type === "free" || !cell.targetCount) {
      return cell;
    }

    const currentCount = Math.max(0, (cell.currentCount ?? 0) - 1);

    return {
      ...cell,
      currentCount,
      marked: currentCount >= cell.targetCount,
    };
  });
}
