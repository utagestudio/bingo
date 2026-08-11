import { useMemo } from "react";
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
    setArrangeMode,
    setLocale,
    updateBoardName,
    updateRawInput,
    shuffleBoard,
    reorderCells,
    toggleMarked,
    setTheme,
    setTransparentBackground,
    setDisplayScale,
    clearActiveBoardMarks,
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
  const visibleControls = !overlayMode;
  const arrangeMode = state.arrangeMode && !overlayMode;

  return (
    <DisplayShell
      overlayMode={overlayMode}
      transparentBackground={activeBoard.appearance.transparentBackground}
      theme={activeBoard.appearance.theme}
    >
      <div
        className="app-shell"
        data-theme={activeBoard.appearance.theme}
        data-arrange-mode={arrangeMode ? "true" : "false"}
        data-overlay-mode={overlayMode ? "true" : "false"}
        data-display-scale={activeBoard.appearance.displayScale}
      >
        {visibleControls ? (
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
        {visibleControls ? (
          <Toolbar
            theme={activeBoard.appearance.theme}
            displayScale={activeBoard.appearance.displayScale}
            locale={state.locale}
            transparentBackground={activeBoard.appearance.transparentBackground}
            t={t}
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
              arrangeMode={arrangeMode}
              onReorder={reorderCells}
              onToggleMarked={toggleMarked}
            />
          </div>
          {visibleControls ? (
            <EditorPanel
              boardName={activeBoard.name}
              rawInput={activeBoard.rawInput}
              arrangeMode={arrangeMode}
              itemCount={activeBoard.items.length}
              boardSize={boardSize}
              savedLabel={storageAvailable ? t("saved") : "Storage unavailable"}
              t={t}
              onBoardNameChange={updateBoardName}
              onRawInputChange={updateRawInput}
              onArrangeModeChange={setArrangeMode}
              onShuffle={shuffleBoard}
              onClearMarks={clearActiveBoardMarks}
              onResetBoard={resetActiveBoard}
            />
          ) : null}
        </div>
        <Footer t={t} />
      </div>
    </DisplayShell>
  );
}
