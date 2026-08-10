import type { BoardId, Locale } from "../types/bingo";
import { BOARD_IDS } from "../types/bingo";
import { parseLocale } from "./storage";

export type ViewMode = "app" | "overlay";

export type QueryOptions = {
  view: ViewMode;
  boardId: BoardId | null;
  locale: Locale | null;
  transparent: boolean | null;
};

export function parseQuery(search: string): QueryOptions {
  const params = new URLSearchParams(search);
  const board = params.get("board");

  return {
    view: params.get("view") === "overlay" ? "overlay" : "app",
    boardId: BOARD_IDS.includes(board as BoardId) ? (board as BoardId) : null,
    locale: parseLocale(params.get("lang")),
    transparent:
      params.has("transparent") || params.has("transparentBackground")
        ? params.get("transparent") === "1" ||
          params.get("transparentBackground") === "1"
        : null,
  };
}
