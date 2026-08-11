import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  AppState,
  BingoCell,
  BoardId,
  BoardState,
  DisplayScale,
  Locale,
  Theme,
} from "../types/bingo";
import { calculateBoardSize } from "../lib/boardSize";
import { reconcileItems } from "../lib/items";
import {
  buildLayout,
  reorderItemCells,
  shuffleItemCells,
  toggleCellMarked,
} from "../lib/layout";
import { parseQuery } from "../lib/query";
import {
  createDefaultBoard,
  createDefaultState,
  getInitialLocale,
  loadState,
  saveState,
} from "../lib/storage";

function getBrowserStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

function withUpdatedBoard(
  state: AppState,
  boardId: BoardId,
  updater: (board: BoardState) => BoardState,
): AppState {
  return {
    ...state,
    boards: {
      ...state.boards,
      [boardId]: {
        ...updater(state.boards[boardId]),
        updatedAt: new Date().toISOString(),
      },
    },
  };
}

export function useAppState() {
  const queryOptions = useMemo(() => parseQuery(window.location.search), []);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [state, setState] = useState<AppState>(() => {
    const fallback = createDefaultState(
      queryOptions.locale ?? getInitialLocale(navigator.language),
    );
    const loadedState = loadState(getBrowserStorage(), fallback);

    return {
      ...loadedState,
      activeBoardId: queryOptions.boardId ?? loadedState.activeBoardId,
      locale: queryOptions.locale ?? loadedState.locale,
      arrangeMode:
        queryOptions.view === "overlay" ? false : loadedState.arrangeMode,
      boards:
        queryOptions.transparent === null
          ? loadedState.boards
          : {
              ...loadedState.boards,
              [queryOptions.boardId ?? loadedState.activeBoardId]: {
                ...loadedState.boards[
                  queryOptions.boardId ?? loadedState.activeBoardId
                ],
                appearance: {
                  ...loadedState.boards[
                    queryOptions.boardId ?? loadedState.activeBoardId
                  ].appearance,
                  transparentBackground: queryOptions.transparent,
                },
              },
            },
    };
  });

  const activeBoard = state.boards[state.activeBoardId];
  const boardSize = calculateBoardSize(activeBoard.items.length);
  const overlayMode = queryOptions.view === "overlay";

  useEffect(() => {
    try {
      saveState(getBrowserStorage(), state);
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [state]);

  const setActiveBoardId = useCallback((boardId: BoardId) => {
    setState((current) => ({
      ...current,
      activeBoardId: boardId,
    }));
  }, []);

  const setArrangeMode = useCallback((arrangeMode: boolean) => {
    setState((current) => ({
      ...current,
      arrangeMode,
    }));
  }, []);

  const setLocale = useCallback((locale: Locale) => {
    setState((current) => ({
      ...current,
      locale,
    }));
  }, []);

  const updateBoardName = useCallback((name: string) => {
    setState((current) =>
      withUpdatedBoard(current, current.activeBoardId, (board) => ({
        ...board,
        name,
      })),
    );
  }, []);

  const updateRawInput = useCallback((rawInput: string) => {
    setState((current) =>
      withUpdatedBoard(current, current.activeBoardId, (board) => {
        const items = reconcileItems(rawInput, board.items);

        return {
          ...board,
          rawInput,
          items,
          layout: buildLayout(items, board.layout),
        };
      }),
    );
  }, []);

  const shuffleBoard = useCallback(() => {
    setState((current) =>
      withUpdatedBoard(current, current.activeBoardId, (board) => ({
        ...board,
        layout: shuffleItemCells(board.layout),
      })),
    );
  }, []);

  const reorderCells = useCallback((activeCellId: string, overCellId: string) => {
    setState((current) =>
      withUpdatedBoard(current, current.activeBoardId, (board) => ({
        ...board,
        layout: reorderItemCells(board.layout, activeCellId, overCellId),
      })),
    );
  }, []);

  const toggleMarked = useCallback((cell: BingoCell) => {
    setState((current) => {
      if (current.arrangeMode || cell.type === "free") {
        return current;
      }

      return withUpdatedBoard(current, current.activeBoardId, (board) => ({
        ...board,
        layout: toggleCellMarked(board.layout, cell.id),
      }));
    });
  }, []);

  const setTheme = useCallback((theme: Theme) => {
    setState((current) =>
      withUpdatedBoard(current, current.activeBoardId, (board) => ({
        ...board,
        appearance: {
          ...board.appearance,
          theme,
        },
      })),
    );
  }, []);

  const setTransparentBackground = useCallback((transparentBackground: boolean) => {
    setState((current) =>
      withUpdatedBoard(current, current.activeBoardId, (board) => ({
        ...board,
        appearance: {
          ...board.appearance,
          transparentBackground,
        },
      })),
    );
  }, []);

  const setDisplayScale = useCallback((displayScale: DisplayScale) => {
    setState((current) =>
      withUpdatedBoard(current, current.activeBoardId, (board) => ({
        ...board,
        appearance: {
          ...board.appearance,
          displayScale,
        },
      })),
    );
  }, []);

  const resetActiveBoard = useCallback(() => {
    setState((current) => ({
      ...current,
      boards: {
        ...current.boards,
        [current.activeBoardId]: createDefaultBoard(
          current.activeBoardId,
          current.locale,
        ),
      },
    }));
  }, []);

  const clearActiveBoardMarks = useCallback(() => {
    setState((current) =>
      withUpdatedBoard(current, current.activeBoardId, (board) => ({
        ...board,
        layout: board.layout.map((cell) => ({
          ...cell,
          marked: cell.type === "free",
        })),
      })),
    );
  }, []);

  return {
    state,
    activeBoard,
    boardSize,
    overlayMode,
    storageAvailable,
    setActiveBoardId,
    setArrangeMode,
    setLocale,
    updateBoardName,
    updateRawInput,
    shuffleBoard,
    reorderCells,
    toggleMarked,
    setTheme,
    setTransparentBackground,
    setDisplayScale,
    clearActiveBoardMarks,
    resetActiveBoard,
  };
}
