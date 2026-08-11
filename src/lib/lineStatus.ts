import type {
  BingoCell,
  CellVisualStatus,
  LineKind,
  LineStatus,
} from "../types/bingo";
import { calculateBoardSize } from "./boardSize";

type LineCandidate = {
  kind: LineKind;
  index: number;
  indexes: number[];
};

function getLineCandidates(boardSize: number): LineCandidate[] {
  const rows = Array.from({ length: boardSize }, (_, row) => ({
    kind: "row" as const,
    index: row,
    indexes: Array.from(
      { length: boardSize },
      (_unused, column) => row * boardSize + column,
    ),
  }));
  const columns = Array.from({ length: boardSize }, (_, column) => ({
    kind: "column" as const,
    index: column,
    indexes: Array.from(
      { length: boardSize },
      (_unused, row) => row * boardSize + column,
    ),
  }));
  const diagonals = [
    {
      kind: "diagonal" as const,
      index: 0,
      indexes: Array.from(
        { length: boardSize },
        (_unused, index) => index * boardSize + index,
      ),
    },
    {
      kind: "diagonal" as const,
      index: 1,
      indexes: Array.from(
        { length: boardSize },
        (_unused, index) => index * boardSize + (boardSize - 1 - index),
      ),
    },
  ];

  return [...rows, ...columns, ...diagonals];
}

export function getLineStatuses(layout: BingoCell[]): LineStatus[] {
  const boardSize = calculateBoardSize(
    layout.filter((cell) => cell.type === "item").length,
  );
  const candidates = getLineCandidates(boardSize);

  return candidates.map((candidate) => {
    const cells = candidate.indexes.map((index) => layout[index]);
    const markedCount = cells.filter((cell) => cell?.marked).length;
    const status =
      markedCount === boardSize
        ? "bingo"
        : markedCount === boardSize - 1
          ? "reach"
          : "none";

    return {
      kind: candidate.kind,
      index: candidate.index,
      cellIds: cells.map((cell) => cell.id),
      status,
    };
  });
}

export function getCellVisualStatuses(
  layout: BingoCell[],
  lineStatuses: LineStatus[],
): Record<string, CellVisualStatus> {
  const visualStatuses = Object.fromEntries(
    layout.map((cell) => [cell.id, cell.marked ? "marked" : "normal"]),
  ) as Record<string, CellVisualStatus>;

  // reachを先に反映し、bingoが後から上書きすることで仕様の優先順位を守る。
  for (const lineStatus of lineStatuses) {
    if (lineStatus.status !== "reach") {
      continue;
    }

    for (const cellId of lineStatus.cellIds) {
      const cell = layout.find((candidate) => candidate.id === cellId);

      // リーチ時は「あと1つ」の未開封マスだけを強調し、開封済みマスはmarked表示を保つ。
      if (cell && !cell.marked && visualStatuses[cellId] !== "bingo") {
        visualStatuses[cellId] = "reach";
      }
    }
  }

  for (const lineStatus of lineStatuses) {
    if (lineStatus.status !== "bingo") {
      continue;
    }

    for (const cellId of lineStatus.cellIds) {
      visualStatuses[cellId] = "bingo";
    }
  }

  return visualStatuses;
}
