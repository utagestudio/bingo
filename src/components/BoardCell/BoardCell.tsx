import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties } from "react";
import type { BingoCell, CellVisualStatus } from "../../types/bingo";

type BoardCellProps = {
  cell: BingoCell;
  visualStatus: CellVisualStatus;
  editMode: boolean;
  fontSize: number;
  maxLines: number;
  onToggleMarked: (cell: BingoCell) => void;
};

export function BoardCell({
  cell,
  visualStatus,
  editMode,
  fontSize,
  maxLines,
  onToggleMarked,
}: BoardCellProps) {
  const dndEnabled = editMode && cell.type === "item";
  const { attributes, listeners, setNodeRef: setDraggableRef, transform } =
    useDraggable({
      id: cell.id,
      disabled: !dndEnabled,
    });
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: cell.id,
    disabled: !dndEnabled,
  });
  const cellStyle = {
    transform: CSS.Translate.toString(transform),
    "--cell-font-size": `${fontSize}px`,
    "--cell-max-lines": maxLines,
  } as CSSProperties;

  function setCellRef(node: HTMLButtonElement | null) {
    setDraggableRef(node);
    setDroppableRef(node);
  }

  return (
    <button
      ref={setCellRef}
      className="board-cell"
      data-cell-type={cell.type}
      data-visual-status={visualStatus}
      data-dragging-over={isOver ? "true" : "false"}
      type="button"
      style={cellStyle}
      onClick={() => onToggleMarked(cell)}
      {...attributes}
      {...listeners}
    >
      <span className="board-cell__label">{cell.label}</span>
      {cell.type === "free" ? (
        <span className="board-cell__badge">FREE</span>
      ) : null}
    </button>
  );
}
