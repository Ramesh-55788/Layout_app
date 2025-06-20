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
      newHistory.push(currentState);
      const trimmedHistory =
        newHistory.length > 50 ? newHistory.slice(1) : newHistory;
      setHistoryIndex(trimmedHistory.length - 1);
      return trimmedHistory;
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
      setHistoryIndex(prev => prev - 1);
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
      setHistoryIndex(prev => prev + 1);
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
