import type { DisplayScale, Locale, Theme } from "../../types/bingo";
import type { TranslationKey } from "../../lib/i18n";

type ToolbarProps = {
  theme: Theme;
  displayScale: DisplayScale;
  locale: Locale;
  transparentBackground: boolean;
  t: (key: TranslationKey) => string;
  onThemeChange: (theme: Theme) => void;
  onDisplayScaleChange: (displayScale: DisplayScale) => void;
  onLocaleChange: (locale: Locale) => void;
  onTransparentBackgroundChange: (enabled: boolean) => void;
};

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
  theme,
  displayScale,
  locale,
  transparentBackground,
  t,
  onThemeChange,
  onDisplayScaleChange,
  onLocaleChange,
  onTransparentBackgroundChange,
}: ToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar__group toolbar__group--settings">
        <div
          className="toolbar__option-group"
          role="group"
          aria-label={t("theme")}
        >
          <ToolbarIcon kind="theme" />
          <span className="toolbar__option-label">{t("theme")}</span>
          <div className="toolbar__option-list">
            <button
              className="toolbar__option-button"
              type="button"
              aria-pressed={theme === "light"}
              onClick={() => onThemeChange("light")}
            >
              {t("light")}
            </button>
            <button
              className="toolbar__option-button"
              type="button"
              aria-pressed={theme === "dark"}
              onClick={() => onThemeChange("dark")}
            >
              {t("dark")}
            </button>
          </div>
        </div>
        <div
          className="toolbar__option-group"
          role="group"
          aria-label={t("language")}
        >
          <ToolbarIcon kind="language" />
          <span className="toolbar__option-label">{t("language")}</span>
          <div className="toolbar__option-list">
            <button
              className="toolbar__option-button"
              type="button"
              aria-pressed={locale === "ja"}
              onClick={() => onLocaleChange("ja")}
            >
              日本語
            </button>
            <button
              className="toolbar__option-button"
              type="button"
              aria-pressed={locale === "en"}
              onClick={() => onLocaleChange("en")}
            >
              English
            </button>
          </div>
        </div>
        <label className="toolbar__check">
          <input
            type="checkbox"
            checked={transparentBackground}
            onChange={(event) =>
              onTransparentBackgroundChange(event.currentTarget.checked)
            }
          />
          <span>{t("transparent")}</span>
        </label>
      </div>
      <div className="toolbar__group toolbar__group--display">
        <div
          className="toolbar__option-group"
          role="group"
          aria-label={t("displaySize")}
        >
          <ToolbarIcon kind="display" />
          <span className="toolbar__option-label">{t("displaySize")}</span>
          <div className="toolbar__option-list">
            <button
              className="toolbar__option-button"
              type="button"
              aria-pressed={displayScale === "compact"}
              onClick={() => onDisplayScaleChange("compact")}
            >
              {t("compact")}
            </button>
            <button
              className="toolbar__option-button"
              type="button"
              aria-pressed={displayScale === "standard"}
              onClick={() => onDisplayScaleChange("standard")}
            >
              {t("standard")}
            </button>
            <button
              className="toolbar__option-button"
              type="button"
              aria-pressed={displayScale === "fit"}
              onClick={() => onDisplayScaleChange("fit")}
            >
              {t("fit")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
