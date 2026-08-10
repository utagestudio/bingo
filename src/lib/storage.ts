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

export const STORAGE_KEY = "achievement-bing:v1";

const DEFAULT_BOARD_1_SAMPLES: Record<
  Locale,
  { name: string; lines: readonly string[] }
> = {
  ja: {
    name: "マインクラフトビンゴ（サンプル）",
    lines: [
      "木を1スタック集める",
      "石の道具を一式作る",
      "鉄インゴットを入手する",
      "防具を1部位作る",
      "ベッドを作る",
      "村を見つける",
      "村人と取引する",
      "動物を2匹繁殖させる",
      "畑を作る",
      "食料を1スタック用意する",
      "洞窟を探検する",
      "ダイヤを見つける",
      "レッドストーンを入手する",
      "モンスターに不意打ちされる",
      "クリーパーに爆破される",
      "スケルトンに撃たれる",
      "ネザーゲートを作る",
      "ネザーに入る",
      "要塞または構造物を見つける",
      "エンチャントをする",
      "釣りをする",
      "名札またはレアアイテムを見つける",
      "高い場所から落ちる",
      "今日の拠点を完成させる",
    ],
  },
  en: {
    name: "Minecraft Bingo (Sample)",
    lines: [
      "Collect a stack of wood",
      "Craft a full set of stone tools",
      "Get an iron ingot",
      "Craft one piece of armor",
      "Make a bed",
      "Find a village",
      "Trade with a villager",
      "Breed two animals",
      "Build a farm",
      "Prepare a stack of food",
      "Explore a cave",
      "Find diamonds",
      "Get redstone",
      "Get ambushed by a mob",
      "Get blown up by a creeper",
      "Get shot by a skeleton",
      "Build a Nether portal",
      "Enter the Nether",
      "Find a fortress or structure",
      "Enchant an item",
      "Go fishing",
      "Find a name tag or rare item",
      "Fall from a high place",
      "Finish today's base",
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
