export function calculateBoardSize(itemCount: number): number {
  return Math.max(1, Math.ceil(Math.sqrt(Math.max(0, itemCount))));
}

export function calculateCellCount(boardSize: number): number {
  return boardSize * boardSize;
}

export function calculateFreeSpaceCount(itemCount: number): number {
  const boardSize = calculateBoardSize(itemCount);
  return calculateCellCount(boardSize) - Math.max(0, itemCount);
}
