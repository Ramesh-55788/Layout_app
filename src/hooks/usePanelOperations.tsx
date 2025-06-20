import { Panel } from '../components/types';
import { reorderPanelsByZIndex } from '../utils/zIndexUtils';

export const usePanelOperations = (
  panels: Panel[],
  setPanels: React.Dispatch<React.SetStateAction<Panel[]>>,
  setSelectedPanel: React.Dispatch<React.SetStateAction<string | null>>,
  saveToHistory: () => void
) => {
  let saveHistoryTimeout: number | null = null;

  const debouncedSaveToHistory = () => {
    if (saveHistoryTimeout) {
      clearTimeout(saveHistoryTimeout);
    }
    saveHistoryTimeout = setTimeout(() => {
      saveToHistory();
      saveHistoryTimeout = null;
    }, 500);
  };

  const updatePanelProperties = (panels: Panel[], selectedPanel: string, properties: Partial<Panel>) => {
    return panels.map(panel =>
      panel.id === selectedPanel
        ? { ...panel, ...properties }
        : panel
    );
  };

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
    text: string,
    borderWidth: number,
    textColor: string,
    fontSize: number,
    fontWeight: 'normal' | 'bold',
    fontStyle: 'normal' | 'italic',
    textDecoration: 'none' | 'underline',
    zAction?: 'bringToFront' | 'sendToBack' | 'moveForward' | 'moveBackward'
  ) => {
    if (!selectedPanel) return;

    const properties = {
      width,
      height,
      bgColor,
      borderColor,
      text,
      borderWidth,
      textColor,
      fontSize,
      fontWeight,
      fontStyle,
      textDecoration
    };

    setPanels(prevPanels => {
      const currentIndex = prevPanels.findIndex(p => p.id === selectedPanel);
      if (currentIndex === -1) return prevPanels;

      if (!zAction || prevPanels.length <= 1) {
        return updatePanelProperties(prevPanels, selectedPanel, properties);
      }

      const reordered = reorderPanelsByZIndex(prevPanels, selectedPanel, zAction);
      return updatePanelProperties(reordered, selectedPanel, properties);
    });

    debouncedSaveToHistory();
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
          width = 266; height = 180;
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
          borderWidth: 1,
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
