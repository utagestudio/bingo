export type BoardCoordinate = {
  row: number;
  column: number;
  index: number;
};

export function getBoardCoordinates(boardSize: number): BoardCoordinate[] {
  return Array.from({ length: boardSize * boardSize }, (_, index) => ({
    row: Math.floor(index / boardSize),
    column: index % boardSize,
    index,
  }));
}

export function getCenterBiasedFreeIndexes(
  boardSize: number,
  freeSpaceCount: number,
): Set<number> {
  const center = (boardSize - 1) / 2;

  const indexes = getBoardCoordinates(boardSize)
    .map((coordinate) => {
      const rowDistance = coordinate.row - center;
      const columnDistance = coordinate.column - center;

      return {
        ...coordinate,
        distance: rowDistance * rowDistance + columnDistance * columnDistance,
      };
    })
    .sort((a, b) => {
      if (a.distance !== b.distance) {
        return a.distance - b.distance;
      }

      if (a.row !== b.row) {
        return a.row - b.row;
      }

      return a.column - b.column;
    })
    .slice(0, Math.max(0, freeSpaceCount))
    .map((coordinate) => coordinate.index);

  return new Set(indexes);
}
