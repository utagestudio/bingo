import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core";
import type { CSSProperties } from "react";
import type { BingoCell, CellVisualStatus } from "../../types/bingo";
import { BoardCell } from "../BoardCell/BoardCell";

type BingoBoardProps = {
  boardSize: number;
  cells: BingoCell[];
  visualStatuses: Record<string, CellVisualStatus>;
  arrangeMode: boolean;
  onReorder: (activeCellId: string, overCellId: string) => void;
  onToggleMarked: (cell: BingoCell) => void;
};

function getFontSettings(boardSize: number): { fontSize: number; maxLines: number } {
  if (boardSize <= 1) {
    return { fontSize: 48, maxLines: 3 };
  }

  if (boardSize === 2) {
    return { fontSize: 38, maxLines: 3 };
  }

  if (boardSize === 3) {
    return { fontSize: 30, maxLines: 3 };
  }

  if (boardSize === 4) {
    return { fontSize: 24, maxLines: 3 };
  }

  if (boardSize === 5) {
    return { fontSize: 20, maxLines: 3 };
  }

  return { fontSize: 16, maxLines: 2 };
}

export function BingoBoard({
  boardSize,
  cells,
  visualStatuses,
  arrangeMode,
  onReorder,
  onToggleMarked,
}: BingoBoardProps) {
  const { fontSize, maxLines } = getFontSettings(boardSize);
  const boardStyle = {
    "--board-size": boardSize,
  } as CSSProperties;

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over || event.active.id === event.over.id) {
      return;
    }

    onReorder(String(event.active.id), String(event.over.id));
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <section
        className="bingo-board"
        style={boardStyle}
        aria-label="Bingo board"
      >
        {cells.map((cell) => (
          <BoardCell
            key={cell.id}
            cell={cell}
            visualStatus={visualStatuses[cell.id] ?? "normal"}
            arrangeMode={arrangeMode}
            fontSize={fontSize}
            maxLines={maxLines}
            onToggleMarked={onToggleMarked}
          />
        ))}
      </section>
    </DndContext>
  );
}
