import type { Locale, Theme } from "../../types/bingo";
import type { TranslationKey } from "../../lib/i18n";

type ToolbarProps = {
  editMode: boolean;
  theme: Theme;
  locale: Locale;
  transparentBackground: boolean;
  t: (key: TranslationKey) => string;
  onEditModeChange: (editMode: boolean) => void;
  onShuffle: () => void;
  onThemeChange: (theme: Theme) => void;
  onLocaleChange: (locale: Locale) => void;
  onTransparentBackgroundChange: (enabled: boolean) => void;
};

export function Toolbar({
  editMode,
  theme,
  locale,
  transparentBackground,
  t,
  onEditModeChange,
  onShuffle,
  onThemeChange,
  onLocaleChange,
  onTransparentBackgroundChange,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <button
        className="toolbar__button toolbar__button--primary"
        type="button"
        aria-pressed={editMode}
        onClick={() => onEditModeChange(!editMode)}
      >
        {editMode ? t("displayMode") : t("editMode")}
      </button>
      <button
        className="toolbar__button"
        type="button"
        disabled={!editMode}
        onClick={onShuffle}
      >
        {t("shuffle")}
      </button>
      <label className="toolbar__field">
        <span>{t("theme")}</span>
        <select
          value={theme}
          disabled={!editMode}
          onChange={(event) => onThemeChange(event.target.value as Theme)}
        >
          <option value="light">{t("light")}</option>
          <option value="dark">{t("dark")}</option>
        </select>
      </label>
      <label className="toolbar__field">
        <span>{t("language")}</span>
        <select
          value={locale}
          disabled={!editMode}
          onChange={(event) => onLocaleChange(event.target.value as Locale)}
        >
          <option value="ja">日本語</option>
          <option value="en">English</option>
        </select>
      </label>
      <label className="toolbar__check">
        <input
          type="checkbox"
          checked={transparentBackground}
          disabled={!editMode}
          onChange={(event) =>
            onTransparentBackgroundChange(event.currentTarget.checked)
          }
        />
        <span>{t("transparent")}</span>
      </label>
    </div>
  );
}
