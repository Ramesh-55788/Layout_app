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
    newCanvasHeight: string
  ) => {
    const width = parseInt(newCanvasWidth);
    const height = parseInt(newCanvasHeight);
    if (!isNaN(width) && !isNaN(height) && width >= 200 && height >= 200) {
      setCanvasWidth(width);
      setCanvasHeight(height);
      saveToHistory();
    }
  };

  const handleCanvasKeyDown = (
    e: KeyboardEvent,
    newCanvasWidth: string,
    newCanvasHeight: string
  ) => {
    if (e.key === 'Enter') {
      handleCanvasDimensionSubmit(newCanvasWidth, newCanvasHeight);
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
