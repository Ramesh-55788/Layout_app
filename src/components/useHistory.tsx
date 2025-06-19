import { useState, useEffect, useCallback } from 'react';
import { Panel } from './types';

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
      panels,
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
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [panels, canvasWidth, canvasHeight, canvasBgColor, canvasFgColor, roundedCorners, showGrid, historyIndex]);

  useEffect(() => {
    if (history.length === 0) {
      saveToHistory();
    }
  }, []);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setPanels(prevState.panels);
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
      setPanels(nextState.panels);
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