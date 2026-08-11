import type { TranslationKey } from "../../lib/i18n";

type EditorPanelProps = {
  boardName: string;
  rawInput: string;
  arrangeMode: boolean;
  itemCount: number;
  boardSize: number;
  savedLabel: string;
  t: (key: TranslationKey) => string;
  onBoardNameChange: (name: string) => void;
  onRawInputChange: (rawInput: string) => void;
  onArrangeModeChange: (arrangeMode: boolean) => void;
  onShuffle: () => void;
  onClearMarks: () => void;
  onResetBoard: () => void;
};

export function EditorPanel({
  boardName,
  rawInput,
  arrangeMode,
  itemCount,
  boardSize,
  savedLabel,
  t,
  onBoardNameChange,
  onRawInputChange,
  onArrangeModeChange,
  onShuffle,
  onClearMarks,
  onResetBoard,
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
      <div className="editor-panel__layout-actions">
        <button
          className="editor-panel__shuffle"
          type="button"
          onClick={onShuffle}
        >
          {t("shuffle")}
        </button>
        <button
          className="editor-panel__arrange-toggle"
          type="button"
          aria-pressed={arrangeMode}
          onClick={() => onArrangeModeChange(!arrangeMode)}
        >
          {t("arrangeMode")}
        </button>
      </div>
      <div className="editor-panel__meta">
        <span>
          {t("itemCount")}: {itemCount}
        </span>
        <span>
          {t("boardSize")}: {boardSize} x {boardSize}
        </span>
        <span>{savedLabel}</span>
      </div>
      <section className="editor-panel__guide" aria-labelledby="quick-guide-title">
        <h2 id="quick-guide-title">{t("quickGuideTitle")}</h2>
        <p>{t("quickGuideNormal")}</p>
        <p>{t("quickGuideCounter")}</p>
        <p>{t("quickGuideDrag")}</p>
      </section>
      <div className="editor-panel__bottom-actions">
        <button
          className="editor-panel__secondary-action"
          type="button"
          onClick={onClearMarks}
        >
          {t("clearMarks")}
        </button>
        <button
          className="editor-panel__reset"
          type="button"
          onClick={onResetBoard}
        >
          {t("resetBoard")}
        </button>
      </div>
    </aside>
  );
}
