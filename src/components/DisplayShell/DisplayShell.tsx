import type { ReactNode } from "react";
import type { Theme } from "../../types/bingo";

type DisplayShellProps = {
  children: ReactNode;
  editMode: boolean;
  overlayMode: boolean;
  transparentBackground: boolean;
  theme: Theme;
  onReturnToEdit: () => void;
  returnLabel: string;
};

export function DisplayShell({
  children,
  editMode,
  overlayMode,
  transparentBackground,
  theme,
  onReturnToEdit,
  returnLabel,
}: DisplayShellProps) {
  return (
    <main
      className="display-shell"
      data-edit-mode={editMode ? "true" : "false"}
      data-overlay-mode={overlayMode ? "true" : "false"}
      data-transparent={transparentBackground ? "true" : "false"}
      data-theme={theme}
    >
      {children}
      {!editMode && !overlayMode ? (
        <button
          className="return-edit-button"
          type="button"
          onClick={onReturnToEdit}
        >
          {returnLabel}
        </button>
      ) : null}
    </main>
  );
}
