import type { Locale } from "../types/bingo";

export type TranslationKey =
  | "appTitle"
  | "editMode"
  | "displayMode"
  | "items"
  | "itemsPlaceholder"
  | "shuffle"
  | "theme"
  | "light"
  | "dark"
  | "language"
  | "slotName"
  | "saved"
  | "returnToEdit"
  | "freeSpace"
  | "transparent"
  | "itemCount"
  | "boardSize"
  | "feedback"
  | "displaySize"
  | "compact"
  | "standard"
  | "fit"
  | "resetBoard"
  | "clearMarks"
  | "quickGuideTitle"
  | "quickGuideDisplayMode"
  | "quickGuideDrag";

const dictionaries: Record<Locale, Record<TranslationKey, string>> = {
  ja: {
    appTitle: "OBSビンゴ",
    editMode: "編集モード",
    displayMode: "表示モード",
    items: "項目",
    itemsPlaceholder: "1行に1項目ずつ入力",
    shuffle: "ビンゴのセルの位置をシャッフルする",
    theme: "テーマ",
    light: "ライト",
    dark: "ダーク",
    language: "言語",
    slotName: "盤面名",
    saved: "保存済み",
    returnToEdit: "編集",
    freeSpace: "Free Space",
    transparent: "透過",
    itemCount: "項目数",
    boardSize: "盤面",
    feedback: "バグ報告・機能要望",
    displaySize: "表示サイズ",
    compact: "小さめ",
    standard: "通常",
    fit: "ブラウザ合わせ",
    resetBoard: "初期状態に戻す",
    clearMarks: "選択状態を全解除する",
    quickGuideTitle: "使い方",
    quickGuideDisplayMode:
      "ビンゴとして使うときは、上部の表示モードボタンで表示モードに切り替えます。",
    quickGuideDrag:
      "編集モードでは、盤面のセルをドラッグして位置を入れ替えられます。",
  },
  en: {
    appTitle: "OBS Bingo",
    editMode: "Edit mode",
    displayMode: "Display mode",
    items: "Items",
    itemsPlaceholder: "Enter one item per line",
    shuffle: "Shuffle bingo cell positions",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    language: "Language",
    slotName: "Board name",
    saved: "Saved",
    returnToEdit: "Edit",
    freeSpace: "Free Space",
    transparent: "Transparent",
    itemCount: "Items",
    boardSize: "Board",
    feedback: "Bug Reports & Feature Requests",
    displaySize: "Display size",
    compact: "Compact",
    standard: "Standard",
    fit: "Fit browser",
    resetBoard: "Reset board",
    clearMarks: "Clear all selections",
    quickGuideTitle: "Quick guide",
    quickGuideDisplayMode:
      "To use the board as bingo, switch to display mode with the button in the top bar.",
    quickGuideDrag:
      "In edit mode, drag board cells to rearrange their positions.",
  },
};

export function createTranslator(locale: Locale) {
  return (key: TranslationKey): string => dictionaries[locale][key];
}
