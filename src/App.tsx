import { useEffect, useMemo } from "react";
import { BingoBoard } from "./components/BingoBoard/BingoBoard";
import { BoardSwitcher } from "./components/BoardSwitcher/BoardSwitcher";
import { DisplayShell } from "./components/DisplayShell/DisplayShell";
import { EditorPanel } from "./components/EditorPanel/EditorPanel";
import { Footer } from "./components/Footer/Footer";
import { Toolbar } from "./components/Toolbar/Toolbar";
import { createTranslator } from "./lib/i18n";
import { getCellVisualStatuses, getLineStatuses } from "./lib/lineStatus";
import { useAppState } from "./hooks/useAppState";

export function App() {
  const {
    state,
    activeBoard,
    boardSize,
    overlayMode,
    storageAvailable,
    setActiveBoardId,
    setEditMode,
    setLocale,
    updateBoardName,
    updateRawInput,
    shuffleBoard,
    reorderCells,
    toggleMarked,
    setTheme,
    setTransparentBackground,
    setDisplayScale,
    resetActiveBoard,
  } = useAppState();
  const t = useMemo(() => createTranslator(state.locale), [state.locale]);
  const lineStatuses = useMemo(
    () => getLineStatuses(activeBoard.layout),
    [activeBoard.layout],
  );
  const visualStatuses = useMemo(
    () => getCellVisualStatuses(activeBoard.layout, lineStatuses),
    [activeBoard.layout, lineStatuses],
  );
  const visibleEditMode = state.editMode && !overlayMode;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "e" && !overlayMode) {
        setEditMode(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [overlayMode, setEditMode]);

  return (
    <DisplayShell
      editMode={visibleEditMode}
      overlayMode={overlayMode}
      transparentBackground={activeBoard.appearance.transparentBackground}
      theme={activeBoard.appearance.theme}
      onReturnToEdit={() => setEditMode(true)}
      returnLabel={t("returnToEdit")}
    >
      <div
        className="app-shell"
        data-theme={activeBoard.appearance.theme}
        data-edit-mode={visibleEditMode ? "true" : "false"}
        data-display-scale={activeBoard.appearance.displayScale}
      >
        {visibleEditMode ? (
          <header className="app-header">
            <div>
              <p className="app-header__eyebrow">{t("appTitle")}</p>
              <h1>{activeBoard.name}</h1>
            </div>
            <BoardSwitcher
              boards={state.boards}
              activeBoardId={state.activeBoardId}
              onChange={setActiveBoardId}
            />
          </header>
        ) : null}
        {visibleEditMode ? (
          <Toolbar
            editMode={visibleEditMode}
            theme={activeBoard.appearance.theme}
            displayScale={activeBoard.appearance.displayScale}
            locale={state.locale}
            transparentBackground={activeBoard.appearance.transparentBackground}
            t={t}
            onEditModeChange={setEditMode}
            onThemeChange={setTheme}
            onDisplayScaleChange={setDisplayScale}
            onLocaleChange={setLocale}
            onTransparentBackgroundChange={setTransparentBackground}
          />
        ) : null}
        <div className="workspace">
          <div className="board-stage">
            <BingoBoard
              boardSize={boardSize}
              cells={activeBoard.layout}
              visualStatuses={visualStatuses}
              editMode={visibleEditMode}
              onReorder={reorderCells}
              onToggleMarked={toggleMarked}
            />
          </div>
          {visibleEditMode ? (
            <EditorPanel
              boardName={activeBoard.name}
              rawInput={activeBoard.rawInput}
              itemCount={activeBoard.items.length}
              boardSize={boardSize}
              savedLabel={storageAvailable ? t("saved") : "Storage unavailable"}
              t={t}
              onBoardNameChange={updateBoardName}
              onRawInputChange={updateRawInput}
              onShuffle={shuffleBoard}
              onResetBoard={resetActiveBoard}
            />
          ) : null}
        </div>
        <Footer t={t} />
      </div>
    </DisplayShell>
  );
}
