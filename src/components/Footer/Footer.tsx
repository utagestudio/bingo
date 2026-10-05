import type { TranslationKey } from "../../lib/i18n";
import type { Locale } from "../../types/bingo";

const contactUrls: Record<Locale, string> = {
  ja: "https://tally.so/r/kdVdDR?product=Achievement%20Bingo",
  en: "https://tally.so/r/KYqY78?product=Achievement%20Bingo",
};

type FooterProps = {
  locale: Locale;
  t: (key: TranslationKey) => string;
};

export function Footer({ locale, t }: FooterProps) {
  return (
    <footer className="site-footer">
      <a href="https://utage.games/" target="_blank" rel="noreferrer">
        &copy;UTAGE.GAMES
      </a>
      <span aria-hidden="true">/</span>
      <a href={contactUrls[locale]} target="_blank" rel="noreferrer">
        {t("contact")}
      </a>
      <span aria-hidden="true">/</span>
      <a
        href="https://github.com/utagestudio/bingo/issues"
        target="_blank"
        rel="noreferrer"
      >
        {t("feedback")}
      </a>
    </footer>
  );
}
