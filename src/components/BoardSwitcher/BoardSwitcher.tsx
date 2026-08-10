import type { BoardId, BoardState } from "../../types/bingo";
import { BOARD_IDS } from "../../types/bingo";

type BoardSwitcherProps = {
  boards: Record<BoardId, BoardState>;
  activeBoardId: BoardId;
  onChange: (boardId: BoardId) => void;
};

export function BoardSwitcher({
  boards,
  activeBoardId,
  onChange,
}: BoardSwitcherProps) {
  return (
    <div className="segmented-control" aria-label="Board slots">
      {BOARD_IDS.map((boardId) => (
        <button
          key={boardId}
          className="segmented-control__button"
          type="button"
          aria-pressed={activeBoardId === boardId}
          onClick={() => onChange(boardId)}
        >
          {boards[boardId].name}
        </button>
      ))}
    </div>
  );
}
