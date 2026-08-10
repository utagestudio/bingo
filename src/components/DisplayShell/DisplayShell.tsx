import type { ReactNode } from "react";

type DisplayShellProps = {
  children: ReactNode;
  editMode: boolean;
  overlayMode: boolean;
  transparentBackground: boolean;
  onReturnToEdit: () => void;
  returnLabel: string;
};

export function DisplayShell({
  children,
  editMode,
  overlayMode,
  transparentBackground,
  onReturnToEdit,
  returnLabel,
}: DisplayShellProps) {
  return (
    <main
      className="display-shell"
      data-edit-mode={editMode ? "true" : "false"}
      data-overlay-mode={overlayMode ? "true" : "false"}
      data-transparent={transparentBackground ? "true" : "false"}
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
