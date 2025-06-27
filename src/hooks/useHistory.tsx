import { useState, useEffect, useCallback } from 'react';
import { Panel } from '../components/types';

interface HistoryState {
  panels: Panel[];
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
}

export const useHistory = (
  panels: Panel[],
  setPanels: React.Dispatch<React.SetStateAction<Panel[]>>,
  canvasWidth: number,
  setCanvasWidth: React.Dispatch<React.SetStateAction<number>>,
  canvasHeight: number,
  setCanvasHeight: React.Dispatch<React.SetStateAction<number>>,
  canvasBgColor: string,
  setCanvasBgColor: React.Dispatch<React.SetStateAction<string>>,
  canvasFgColor: string,
  setCanvasFgColor: React.Dispatch<React.SetStateAction<string>>,
  roundedCorners: boolean,
  setRoundedCorners: React.Dispatch<React.SetStateAction<boolean>>,
  showGrid: boolean,
  setShowGrid: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedPanel: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const saveToHistory = useCallback(() => {
    const currentState: HistoryState = {
      panels: JSON.parse(JSON.stringify(panels)),
      canvasWidth,
      canvasHeight,
      canvasBgColor,
      canvasFgColor,
      roundedCorners,
      showGrid
    };

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      const last = newHistory[newHistory.length - 1];
      const isDuplicate = last && JSON.stringify(last) === JSON.stringify(currentState);

      if (isDuplicate) return prev;

      newHistory.push(currentState);
      const trimmed = newHistory.length > 50 ? newHistory.slice(1) : newHistory;
      setHistoryIndex(trimmed.length - 1);

      return trimmed;
    });
  }, [
    panels,
    canvasWidth,
    canvasHeight,
    canvasBgColor,
    canvasFgColor,
    roundedCorners,
    showGrid,
    historyIndex
  ]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = 'Changes you made may not be saved.';
    };

    const shouldWarn = panels.length > 0 || history.length > 0;

    if (shouldWarn) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [panels.length, history.length]);

  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, [saveToHistory, history.length]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setPanels(JSON.parse(JSON.stringify(prevState.panels)));
      setCanvasWidth(prevState.canvasWidth);
      setCanvasHeight(prevState.canvasHeight);
      setCanvasBgColor(prevState.canvasBgColor);
      setCanvasFgColor(prevState.canvasFgColor);
      setRoundedCorners(prevState.roundedCorners);
      setShowGrid(prevState.showGrid);
      setHistoryIndex(prev => {
        const newIndex = prev - 1;
        return newIndex;
      });
      setSelectedPanel(null);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setPanels(JSON.parse(JSON.stringify(nextState.panels)));
      setCanvasWidth(nextState.canvasWidth);
      setCanvasHeight(nextState.canvasHeight);
      setCanvasBgColor(nextState.canvasBgColor);
      setCanvasFgColor(nextState.canvasFgColor);
      setRoundedCorners(nextState.roundedCorners);
      setShowGrid(nextState.showGrid);
      setHistoryIndex(prev => {
        const newIndex = prev + 1;
        return newIndex;
      });
      setSelectedPanel(null);
    }
  }, [history, historyIndex]);

  return {
    history,
    historyIndex,
    saveToHistory,
    undo,
    redo
  };
};
