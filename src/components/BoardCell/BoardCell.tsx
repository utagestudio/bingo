import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, KeyboardEvent } from "react";
import type { BingoCell, CellVisualStatus } from "../../types/bingo";

type BoardCellProps = {
  cell: BingoCell;
  visualStatus: CellVisualStatus;
  arrangeMode: boolean;
  fontSize: number;
  maxLines: number;
  onAdvanceCell: (cell: BingoCell) => void;
  onDecrementCell: (cell: BingoCell) => void;
};

export function BoardCell({
  cell,
  visualStatus,
  arrangeMode,
  fontSize,
  maxLines,
  onAdvanceCell,
  onDecrementCell,
}: BoardCellProps) {
  const dndEnabled = arrangeMode && cell.type === "item";
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
      id: cell.id,
      disabled: !dndEnabled,
    });
  const {
    role: _dragRole,
    tabIndex: _dragTabIndex,
    "aria-pressed": _dragAriaPressed,
    ...dragAttributes
  } = attributes;
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: cell.id,
    disabled: !dndEnabled,
  });
  const cellStyle = {
    transform: CSS.Translate.toString(transform),
    "--cell-font-size": `${fontSize}px`,
    "--cell-max-lines": maxLines,
  } as CSSProperties;

  const hasCounter = cell.type === "item" && Boolean(cell.targetCount);
  const canShowDecrement = !arrangeMode && hasCounter;
  const canDecrement = canShowDecrement && (cell.currentCount ?? 0) > 0;
  const progressLabel = hasCounter
    ? `${cell.currentCount ?? 0}/${cell.targetCount}`
    : null;
  const ariaLabel = progressLabel
    ? `${cell.label} ${progressLabel}`
    : cell.label;

  function setCellRef(node: HTMLDivElement | null) {
    setDraggableRef(node);
    setDroppableRef(node);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    onAdvanceCell(cell);
  }

  return (
    <div
      ref={setCellRef}
      className="board-cell"
      {...dragAttributes}
      {...listeners}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-pressed={cell.type === "item" ? cell.marked : undefined}
      data-cell-type={cell.type}
      data-visual-status={visualStatus}
      data-dragging={isDragging ? "true" : "false"}
      data-dragging-over={isOver ? "true" : "false"}
      style={cellStyle}
      onClick={() => onAdvanceCell(cell)}
      onKeyDown={handleKeyDown}
    >
      <span className="board-cell__label">{cell.label}</span>
      {progressLabel || canShowDecrement ? (
        <span className="board-cell__counter-controls">
          {progressLabel ? (
            <span className="board-cell__progress">{progressLabel}</span>
          ) : null}
          {canShowDecrement ? (
            <button
              className="board-cell__decrement"
              type="button"
              aria-disabled={!canDecrement}
              data-disabled={canDecrement ? "false" : "true"}
              aria-label={`${cell.label} -1`}
              onClick={(event) => {
                event.stopPropagation();
                if (!canDecrement) {
                  return;
                }

                onDecrementCell(cell);
              }}
            >
              <svg
                className="board-cell__decrement-icon"
                viewBox="0 0 12 12"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M3 6h6" />
              </svg>
            </button>
          ) : null}
        </span>
      ) : null}
      {cell.type === "free" ? (
        <span className="board-cell__badge">FREE</span>
      ) : null}
    </div>
  );
}
