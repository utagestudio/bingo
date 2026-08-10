import type { DisplayScale, Locale, Theme } from "../../types/bingo";
import type { TranslationKey } from "../../lib/i18n";

type ToolbarProps = {
  editMode: boolean;
  theme: Theme;
  displayScale: DisplayScale;
  locale: Locale;
  transparentBackground: boolean;
  t: (key: TranslationKey) => string;
  onEditModeChange: (editMode: boolean) => void;
  onThemeChange: (theme: Theme) => void;
  onDisplayScaleChange: (displayScale: DisplayScale) => void;
  onLocaleChange: (locale: Locale) => void;
  onTransparentBackgroundChange: (enabled: boolean) => void;
};

const DISPLAY_SCALE_ORDER: DisplayScale[] = ["compact", "standard", "fit"];

function getNextDisplayScale(displayScale: DisplayScale): DisplayScale {
  const currentIndex = DISPLAY_SCALE_ORDER.indexOf(displayScale);
  return DISPLAY_SCALE_ORDER[(currentIndex + 1) % DISPLAY_SCALE_ORDER.length];
}

function ToolbarIcon({ kind }: { kind: "theme" | "language" | "display" }) {
  if (kind === "theme") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M17.7 6.3l-1.4 1.4M7.7 16.3l-1.4 1.4" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    );
  }

  if (kind === "language") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21M12 3C9.8 5.4 8.7 8.4 8.7 12S9.8 18.6 12 21" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  );
}

export function Toolbar({
  editMode,
  theme,
  displayScale,
  locale,
  transparentBackground,
  t,
  onEditModeChange,
  onThemeChange,
  onDisplayScaleChange,
  onLocaleChange,
  onTransparentBackgroundChange,
}: ToolbarProps) {
  const themeLabel = theme === "light" ? t("light") : t("dark");
  const localeLabel = locale === "ja" ? "日本語" : "English";
  const displayScaleLabel =
    displayScale === "compact"
      ? t("compact")
      : displayScale === "standard"
        ? t("standard")
        : t("fit");

  return (
    <div className="toolbar">
      <div className="toolbar__group toolbar__group--settings">
        <button
          className="toolbar__cycle-button"
          type="button"
          disabled={!editMode}
          aria-label={`${t("theme")}: ${themeLabel}`}
          onClick={() => onThemeChange(theme === "light" ? "dark" : "light")}
        >
          <ToolbarIcon kind="theme" />
          <span>{t("theme")}</span>
          <strong>{themeLabel}</strong>
        </button>
        <button
          className="toolbar__cycle-button"
          type="button"
          disabled={!editMode}
          aria-label={`${t("language")}: ${localeLabel}`}
          onClick={() => onLocaleChange(locale === "ja" ? "en" : "ja")}
        >
          <ToolbarIcon kind="language" />
          <span>{t("language")}</span>
          <strong>{localeLabel}</strong>
        </button>
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
      <div className="toolbar__group toolbar__group--display">
        <button
          className="toolbar__cycle-button"
          type="button"
          disabled={!editMode}
          aria-label={`${t("displaySize")}: ${displayScaleLabel}`}
          onClick={() => onDisplayScaleChange(getNextDisplayScale(displayScale))}
        >
          <ToolbarIcon kind="display" />
          <span>{t("displaySize")}</span>
          <strong>{displayScaleLabel}</strong>
        </button>
        <button
          className="toolbar__button toolbar__button--primary"
          type="button"
          aria-pressed={editMode}
          onClick={() => onEditModeChange(!editMode)}
        >
          {editMode ? t("displayMode") : t("editMode")}
        </button>
      </div>
    </div>
  );
}
