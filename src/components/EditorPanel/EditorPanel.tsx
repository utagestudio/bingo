import type { TranslationKey } from "../../lib/i18n";

type EditorPanelProps = {
  boardName: string;
  rawInput: string;
  itemCount: number;
  boardSize: number;
  savedLabel: string;
  t: (key: TranslationKey) => string;
  onBoardNameChange: (name: string) => void;
  onRawInputChange: (rawInput: string) => void;
  onShuffle: () => void;
};

export function EditorPanel({
  boardName,
  rawInput,
  itemCount,
  boardSize,
  savedLabel,
  t,
  onBoardNameChange,
  onRawInputChange,
  onShuffle,
}: EditorPanelProps) {
  return (
    <aside className="editor-panel">
      <label className="editor-panel__field">
        <span>{t("slotName")}</span>
        <input
          value={boardName}
          onChange={(event) => onBoardNameChange(event.currentTarget.value)}
        />
      </label>
      <label className="editor-panel__field editor-panel__field--textarea">
        <span>{t("items")}</span>
        <textarea
          value={rawInput}
          placeholder={t("itemsPlaceholder")}
          onChange={(event) => onRawInputChange(event.currentTarget.value)}
        />
      </label>
      <button
        className="editor-panel__shuffle"
        type="button"
        onClick={onShuffle}
      >
        {t("shuffle")}
      </button>
      <div className="editor-panel__meta">
        <span>
          {t("itemCount")}: {itemCount}
        </span>
        <span>
          {t("boardSize")}: {boardSize} x {boardSize}
        </span>
        <span>{savedLabel}</span>
      </div>
    </aside>
  );
}
