import type { ReactNode } from "react";
import type { Theme } from "../../types/bingo";

type DisplayShellProps = {
  children: ReactNode;
  overlayMode: boolean;
  transparentBackground: boolean;
  theme: Theme;
};

export function DisplayShell({
  children,
  overlayMode,
  transparentBackground,
  theme,
}: DisplayShellProps) {
  return (
    <main
      className="display-shell"
      data-overlay-mode={overlayMode ? "true" : "false"}
      data-transparent={transparentBackground ? "true" : "false"}
      data-theme={theme}
    >
      {children}
    </main>
  );
}
