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

export const STORAGE_KEY = "achievement-bingo:v1";

const DEFAULT_BOARD_1_SAMPLES: Record<
  Locale,
  { name: string; lines: readonly string[] }
> = {
  ja: {
    name: "Faaast Penguin （サンプル）",
    lines: [
      "ツアーに1位になる",
      "ツアーに2位になる",
      "ツアーに3位になる",
      "アクティビティで1位になる",
      "アクティビティで2位になる",
      "アクティビティで3位になる",
      "ツアー内の全アクティビティで同じ順位を取る",
      "1アクティビティでスペシャル3回発動",
      "走行中にエモートを使う",
      "他ペンギンに3連続アタックを決める",
      "ジャパンロールで1コース内で火遁水遁風遁の３つを取る",
      "FPXでXtreeemeを決める",
      "イタリアクランチで他ペンギンが開けた扉に入る",
      "ピクセル・レボリューションで1万点とる",
      "スペシャルを使わないでゴールする",
      "パーティーIDでチームを組んで走る",
      "ノックアウト（落下）せずゴールする",
      "ボムザラシで爆破する",
      "パラグライダーを使う",
      "アザラシにアタックを決める",
      "アザラシサンドバックにアタックを決める",
      "カモメにアタックを決める",
      "風船にアタックを決める",
      "缶詰を10個集めないでゴールする",
    ],
  },
  en: {
    name: "Faaast Penguin (Sample)",
    lines: [
      "Finish 1st in a Tour",
      "Finish 2nd in a Tour",
      "Finish 3rd in a Tour",
      "Finish 1st in an Activity",
      "Finish 2nd in an Activity",
      "Finish 3rd in an Activity",
      "Get the same place in every Activity in a Tour",
      "Activate your Special 3 times in one Activity",
      "Use an Emote while racing",
      "Land 3 attacks on other penguins in a row",
      "On Japan Scroll, get Fire, Water, and Wind Techniques in one course",
      "Land an Xtreeeme in FPX: Snowboarding",
      "On Italian Crunch, enter a door opened by another penguin",
      "Score 10,000 points in Pixel Revolution",
      "Finish without using your Special",
      "Team up with a Party ID and race",
      "Finish without dropping out from a fall",
      "Blow up a Bombzarashi",
      "Use a paraglider",
      "Land an attack on a seal",
      "Land an attack on a seal punching bag",
      "Land an attack on a seagull",
      "Land an attack on a balloon",
      "Finish without collecting 10 sardine cans",
    ],
  },
};

function createDefaultItems(id: BoardId, locale: Locale): BingoItem[] {
  if (id !== "board-1") {
    return [];
  }

  return DEFAULT_BOARD_1_SAMPLES[locale].lines.map((label, index) => ({
    id: `default-board-1-item-${index + 1}`,
    label,
  }));
}

export function createDefaultBoard(id: BoardId, locale: Locale): BoardState {
  const now = new Date().toISOString();
  const items = createDefaultItems(id, locale);
  const rawInput = items.map((item) => item.label).join("\n");

  return {
    id,
    name:
      id === "board-1"
        ? DEFAULT_BOARD_1_SAMPLES[locale].name
        : `Board ${id.split("-")[1]}`,
    rawInput,
    items,
    layout: buildLayout(items),
    updatedAt: now,
    appearance: {
      transparentBackground: false,
      theme: "light",
      displayScale: "standard",
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
      "board-1": createDefaultBoard("board-1", locale),
      "board-2": createDefaultBoard("board-2", locale),
      "board-3": createDefaultBoard("board-3", locale),
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

  return "standard";
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
