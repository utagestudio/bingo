import type {
  AppState,
  BingoCell,
  BingoItem,
  BoardId,
  BoardState,
  DisplayScale,
  Locale,
  Theme,
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
      displayScale: "compact",
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

export function parseTheme(value: unknown): Theme {
  return value === "dark" ? "dark" : "light";
}

export function parseDisplayScale(value: unknown): DisplayScale {
  if (value === "standard" || value === "fit") {
    return value;
  }

  return "compact";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function sanitizeItems(value: unknown): BingoItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is Record<string, unknown> => isRecord(item))
    .filter((item) => typeof item.id === "string" && typeof item.label === "string")
    .map((item) => ({
      id: item.id as string,
      label: item.label as string,
    }));
}

function sanitizeLayout(value: unknown): BingoCell[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((cell): cell is Record<string, unknown> => isRecord(cell))
    .filter(
      (cell) =>
        (cell.type === "item" || cell.type === "free") &&
        typeof cell.id === "string" &&
        typeof cell.label === "string",
    )
    .map((cell) => ({
      id: cell.id as string,
      type: cell.type as "item" | "free",
      itemId: typeof cell.itemId === "string" ? cell.itemId : undefined,
      label: cell.label as string,
      marked: typeof cell.marked === "boolean" ? cell.marked : false,
    }));
}

function sanitizeBoard(
  value: unknown,
  fallback: BoardState,
): BoardState {
  if (!isRecord(value)) {
    return fallback;
  }

  const rawInput =
    typeof value.rawInput === "string" ? value.rawInput : fallback.rawInput;
  const items = sanitizeItems(value.items);
  const previousLayout = sanitizeLayout(value.layout);
  const layout = buildLayout(items, previousLayout);
  const appearance = isRecord(value.appearance) ? value.appearance : {};

  return {
    ...fallback,
    name: typeof value.name === "string" ? value.name : fallback.name,
    rawInput,
    items,
    layout,
    updatedAt:
      typeof value.updatedAt === "string"
        ? value.updatedAt
        : fallback.updatedAt,
    appearance: {
      transparentBackground:
        typeof appearance.transparentBackground === "boolean"
          ? appearance.transparentBackground
          : fallback.appearance.transparentBackground,
      theme: parseTheme(appearance.theme),
      displayScale: parseDisplayScale(appearance.displayScale),
    },
  };
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
    boards: {
      "board-1": sanitizeBoard(value.boards["board-1"], fallback.boards["board-1"]),
      "board-2": sanitizeBoard(value.boards["board-2"], fallback.boards["board-2"]),
      "board-3": sanitizeBoard(value.boards["board-3"], fallback.boards["board-3"]),
    },
  };
}

export function loadState(
  storage: Storage | undefined,
  fallback: AppState,
): AppState {
  if (!storage) {
    return fallback;
  }

  try {
    const storedValue = storage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return fallback;
    }

    return sanitizeState(JSON.parse(storedValue), fallback);
  } catch {
    return fallback;
  }
}

export function saveState(storage: Storage | undefined, state: AppState): void {
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
