import { Dispatch, SetStateAction, KeyboardEvent } from 'react';

export const useCanvasControls = (
  setCanvasWidth: Dispatch<SetStateAction<number>>,
  setCanvasHeight: Dispatch<SetStateAction<number>>,
  setCanvasBgColor: Dispatch<SetStateAction<string>>,
  setCanvasFgColor: Dispatch<SetStateAction<string>>,
  saveToHistory: () => void
) => {
  const handleCanvasDimensionSubmit = (
    newCanvasWidth: string,
    newCanvasHeight: string,
    setIsEditingCanvas: Dispatch<SetStateAction<boolean>>
  ) => {
    const width = parseInt(newCanvasWidth);
    const height = parseInt(newCanvasHeight);
    if (!isNaN(width) && !isNaN(height) && width >= 200 && height >= 200) {
      setCanvasWidth(width);
      setCanvasHeight(height);
      saveToHistory();
    }
    setIsEditingCanvas(false);
  };

  const handleCanvasKeyDown = (
    e: KeyboardEvent,
    newCanvasWidth: string,
    newCanvasHeight: string,
    setIsEditingCanvas: Dispatch<SetStateAction<boolean>>
  ) => {
    if (e.key === 'Enter') {
      handleCanvasDimensionSubmit(newCanvasWidth, newCanvasHeight, setIsEditingCanvas);
    } else if (e.key === 'Escape') {
      setIsEditingCanvas(false);
    }
  };

  const handleCanvasColorChange = (color: string, type: 'bg' | 'fg') => {
    if (type === 'bg') {
      setCanvasBgColor(color);
    } else if (type === 'fg') {
      setCanvasFgColor(color);
    }
    saveToHistory();
  };

  const handleToggleChange = (
    setter: Dispatch<SetStateAction<boolean>>,
    currentValue: boolean
  ) => {
    setter(!currentValue);
    saveToHistory();
  };

  return {
    handleCanvasDimensionSubmit,
    handleCanvasKeyDown,
    handleCanvasColorChange,
    handleToggleChange
  };
};
