import type { TranslationKey } from "../../lib/i18n";

type FooterProps = {
  t: (key: TranslationKey) => string;
};

export function Footer({ t }: FooterProps) {
  return (
    <footer className="site-footer">
      <a href="https://utage.games/" target="_blank" rel="noreferrer">
        &copy;UTAGE.GAMES
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
