import type {
  AppState,
  BingoItem,
  BoardId,
  BoardState,
  Locale,
} from "../types/bingo";
import { BOARD_IDS } from "../types/bingo";
import { buildLayout } from "./layout";

export const STORAGE_KEY = "obs-bingo-tool:v1";

export function createDefaultBoard(id: BoardId): BoardState {
  const now = new Date().toISOString();
  const items: BingoItem[] = [];

  return {
    id,
    name: `Board ${id.split("-")[1]}`,
    rawInput: "",
    items,
    layout: buildLayout(items),
    updatedAt: now,
    appearance: {
      transparentBackground: false,
      theme: "light",
    },
  };
}

export function createDefaultState(locale: Locale): AppState {
  return {
    version: 1,
    activeBoardId: "board-1",
    editMode: true,
    locale,
    boards: {
      "board-1": createDefaultBoard("board-1"),
      "board-2": createDefaultBoard("board-2"),
      "board-3": createDefaultBoard("board-3"),
    },
  };
}

export function getInitialLocale(language: string | undefined): Locale {
  return language?.toLowerCase().startsWith("ja") ? "ja" : "en";
}

export function parseLocale(value: string | null | undefined): Locale | null {
  if (value === "ja" || value === "en") {
    return value;
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function sanitizeState(value: unknown, fallback: AppState): AppState {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.boards)) {
    return fallback;
  }

  const activeBoardId = BOARD_IDS.includes(value.activeBoardId as BoardId)
    ? (value.activeBoardId as BoardId)
    : fallback.activeBoardId;
  const locale = parseLocale(value.locale as string) ?? fallback.locale;

  return {
    ...fallback,
    activeBoardId,
    editMode:
      typeof value.editMode === "boolean" ? value.editMode : fallback.editMode,
    locale,
    boards: fallback.boards,
  };
}
