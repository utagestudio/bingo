export const BOARD_IDS = ["board-1", "board-2", "board-3"] as const;
export const LOCALES = ["ja", "en"] as const;
export const THEMES = ["light", "dark"] as const;
export const CELL_FONT_SCALE_MIN = 80;
export const CELL_FONT_SCALE_MAX = 140;
export const CELL_FONT_SCALE_STEP = 5;
export const CELL_FONT_SCALE_DEFAULT = 100;

export type BoardId = (typeof BOARD_IDS)[number];
export type Locale = (typeof LOCALES)[number];
export type Theme = (typeof THEMES)[number];

export type AppState = {
  version: 3;
  activeBoardId: BoardId;
  arrangeMode: boolean;
  locale: Locale;
  boards: Record<BoardId, BoardState>;
};

export type BoardState = {
  id: BoardId;
  name: string;
  rawInput: string;
  items: BingoItem[];
  layout: BingoCell[];
  updatedAt: string;
  appearance: BoardAppearance;
};

export type BingoItem = {
  id: string;
  label: string;
};

export type BingoCell = {
  id: string;
  type: "item" | "free";
  itemId?: string;
  label: string;
  marked: boolean;
};

export type BoardAppearance = {
  transparentBackground: boolean;
  theme: Theme;
  cellFontScale: number;
};

export type LineKind = "row" | "column" | "diagonal";
export type LineVisualStatus = "none" | "reach" | "bingo";

export type LineStatus = {
  kind: LineKind;
  index: number;
  cellIds: string[];
  status: LineVisualStatus;
};

export type CellVisualStatus = "normal" | "marked" | "reach" | "bingo";
