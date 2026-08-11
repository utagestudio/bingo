import type { Locale, Theme } from "../../types/bingo";
import type { TranslationKey } from "../../lib/i18n";
import {
  CELL_FONT_SCALE_MAX,
  CELL_FONT_SCALE_MIN,
  CELL_FONT_SCALE_STEP,
} from "../../types/bingo";

type ToolbarProps = {
  theme: Theme;
  cellFontScale: number;
  locale: Locale;
  transparentBackground: boolean;
  t: (key: TranslationKey) => string;
  onThemeChange: (theme: Theme) => void;
  onCellFontScaleChange: (cellFontScale: number) => void;
  onLocaleChange: (locale: Locale) => void;
  onTransparentBackgroundChange: (enabled: boolean) => void;
};

function ToolbarIcon({ kind }: { kind: "theme" | "language" | "font" }) {
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
      <path d="M4 19l5-14 5 14M6 14h6" />
      <path d="M15 19l2.5-7 2.5 7M16 16h3" />
    </svg>
  );
}

export function Toolbar({
  theme,
  cellFontScale,
  locale,
  transparentBackground,
  t,
  onThemeChange,
  onCellFontScaleChange,
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
          className="toolbar__range-group"
          aria-label={t("cellFontSize")}
        >
          <ToolbarIcon kind="font" />
          <label className="toolbar__range-label" htmlFor="cell-font-scale">
            {t("cellFontSize")}
          </label>
          <input
            id="cell-font-scale"
            className="toolbar__range"
            type="range"
            min={CELL_FONT_SCALE_MIN}
            max={CELL_FONT_SCALE_MAX}
            step={CELL_FONT_SCALE_STEP}
            value={cellFontScale}
            onChange={(event) =>
              onCellFontScaleChange(Number(event.currentTarget.value))
            }
          />
          <output className="toolbar__range-value" htmlFor="cell-font-scale">
            {cellFontScale}%
          </output>
        </div>
      </div>
    </div>
  );
}
