import { Panel } from './types';

export const usePanelOperations = (
  panels: Panel[], 
  setPanels: React.Dispatch<React.SetStateAction<Panel[]>>, 
  setSelectedPanel: React.Dispatch<React.SetStateAction<string | null>>, 
  saveToHistory: () => void
) => {
  const updatePanelText = (id: string, newText: string) => {
    setPanels(prev =>
      prev.map(panel =>
        panel.id === id ? { ...panel, text: newText } : panel
      )
    );
  };

  const updateSelectedPanelDimensions = (
    selectedPanel: string | null,
    width: number,
    height: number,
    bgColor: string,
    borderColor: string,
    text: string
  ) => {
    if (selectedPanel) {
      setPanels(prev =>
        prev.map(panel =>
          panel.id === selectedPanel
            ? { ...panel, width, height, bgColor, borderColor, text }
            : panel
        )
      );
      setTimeout(saveToHistory, 500);
    }
  };

  const addPanel = (shape: Panel['shape']) => {
    const canvas = document.querySelector('.canvas-container');
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = rect.width / 2 - 50;
      const y = rect.height / 2 - 50;
      const maxZIndex = panels.length > 0 ? Math.max(...panels.map(p => p.zIndex)) : 0;

      let width = 200;
      let height = 200;
      switch (shape) {
        case 'rectangle':
          width = 266; height = 200;
          break;
        case 'diamond':
        case 'hexagon':
        case 'triangle':
        case 'circle':
        case 'square':
        default:
          width = 200; height = 200;
          break;
      }

      setPanels(prev => [
        ...prev,
        {
          id: crypto.randomUUID(),
          x,
          y,
          width,
          height,
          zIndex: maxZIndex + 1,
          bgColor: '#ffffff',
          borderColor: '#D4D4D4',
          shape
        }
      ]);
      saveToHistory();
    }
  };

  const removePanel = (id: string) => {
    setPanels(prev => prev.filter(panel => panel.id !== id));
    setSelectedPanel(null);
    saveToHistory();
  };

  const clearPanels = () => {
    setPanels([]);
    setSelectedPanel(null);
    saveToHistory();
  };

  const handleDragStop = (id: string, _e: any, data: { x: number; y: number }) => {
    setPanels(prev => prev.map(panel =>
      panel.id === id ? { ...panel, x: data.x, y: data.y } : panel
    ));
    saveToHistory();
  };

  return {
    updatePanelText,
    updateSelectedPanelDimensions,
    addPanel,
    removePanel,
    clearPanels,
    handleDragStop
  };
};