export const useCanvasControls = (
    canvasWidth: number, 
    setCanvasWidth: React.Dispatch<React.SetStateAction<number>>,
    canvasHeight: number, 
    setCanvasHeight: React.Dispatch<React.SetStateAction<number>>,
    canvasBgColor: string, 
    setCanvasBgColor: React.Dispatch<React.SetStateAction<string>>,
    canvasFgColor: string, 
    setCanvasFgColor: React.Dispatch<React.SetStateAction<string>>,
    saveToHistory: () => void
  ) => {
    const handleCanvasDimensionSubmit = (
      newCanvasWidth: string, 
      newCanvasHeight: string, 
      setIsEditingCanvas: React.Dispatch<React.SetStateAction<boolean>>
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
      e: React.KeyboardEvent, 
      newCanvasWidth: string, 
      newCanvasHeight: string, 
      setIsEditingCanvas: React.Dispatch<React.SetStateAction<boolean>>
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
      } else {
        setCanvasFgColor(color);
      }
      setTimeout(saveToHistory, 500);
    };
  
    const handleToggleChange = (
      setter: React.Dispatch<React.SetStateAction<boolean>>, 
      currentValue: boolean
    ) => {
      setter(!currentValue);
      setTimeout(saveToHistory, 100);
    };
  
    return {
      handleCanvasDimensionSubmit,
      handleCanvasKeyDown,
      handleCanvasColorChange,
      handleToggleChange
    };
  };