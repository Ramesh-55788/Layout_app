import { useState, useEffect, useCallback } from 'react';
import { Panel } from '../components/types';

export const useResize = (
  panels: Panel[], 
  setPanels: React.Dispatch<React.SetStateAction<Panel[]>>, 
  selectedPanel: string | null, 
  canvasWidth: number, 
  canvasHeight: number, 
  saveToHistory: () => void
) => {
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [resizeStartPanel, setResizeStartPanel] = useState<Panel | null>(null);

  const handleResizeStart = (handle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedPanel) return;

    const panel = panels.find(p => p.id === selectedPanel);
    if (!panel) return;

    setIsResizing(true);
    setResizeHandle(handle);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeStartPanel({ ...panel });
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeHandle || !selectedPanel || !resizeStartPanel) return;

    const deltaX = e.clientX - resizeStartPos.x;
    const deltaY = e.clientY - resizeStartPos.y;

    let newWidth = resizeStartPanel.width;
    let newHeight = resizeStartPanel.height;
    let newX = resizeStartPanel.x;
    let newY = resizeStartPanel.y;

    switch (resizeHandle) {
      case 'se': 
        newWidth = resizeStartPanel.width + deltaX;
        newHeight = resizeStartPanel.height + deltaY;
        break;
      case 'sw':
        newWidth = resizeStartPanel.width - deltaX;
        newHeight = resizeStartPanel.height + deltaY;
        newX = resizeStartPanel.x + deltaX;
        break;
      case 'ne': 
        newWidth = resizeStartPanel.width + deltaX;
        newHeight = resizeStartPanel.height - deltaY;
        newY = resizeStartPanel.y + deltaY;
        break;
      case 'nw': 
        newWidth = resizeStartPanel.width - deltaX;
        newHeight = resizeStartPanel.height - deltaY;
        newX = resizeStartPanel.x + deltaX;
        newY = resizeStartPanel.y + deltaY;
        break;
      case 'n': 
        newHeight = resizeStartPanel.height - deltaY;
        newY = resizeStartPanel.y + deltaY;
        break;
      case 's': 
        newHeight = resizeStartPanel.height + deltaY;
        break;
      case 'w': 
        newWidth = resizeStartPanel.width - deltaX;
        newX = resizeStartPanel.x + deltaX;
        break;
      case 'e': 
        newWidth = resizeStartPanel.width + deltaX;
        break;
    }

    const minSize = 50;
    newWidth = Math.max(minSize, newWidth);
    newHeight = Math.max(minSize, newHeight);

    if (resizeStartPanel.shape === 'circle') {
      const size = Math.min(newWidth, newHeight);
      newWidth = size;
      newHeight = size;
    }

    if (['sw', 'nw', 'w'].includes(resizeHandle)) {
      const minX = 0;
      const maxX = resizeStartPanel.x + resizeStartPanel.width - minSize;
      newX = Math.max(minX, Math.min(newX, maxX));
      newWidth = resizeStartPanel.x + resizeStartPanel.width - newX;
    }

    if (['ne', 'nw', 'n'].includes(resizeHandle)) {
      const minY = 0;
      const maxY = resizeStartPanel.y + resizeStartPanel.height - minSize;
      newY = Math.max(minY, Math.min(newY, maxY));
      newHeight = resizeStartPanel.y + resizeStartPanel.height - newY;
    }

    newWidth = Math.min(newWidth, canvasWidth - newX);
    newHeight = Math.min(newHeight, canvasHeight - newY);

    setPanels(prev => prev.map(p =>
      p.id === selectedPanel
        ? { ...p, width: newWidth, height: newHeight, x: newX, y: newY }
        : p
    ));
  }, [isResizing, resizeHandle, selectedPanel, resizeStartPanel, resizeStartPos, canvasWidth, canvasHeight]);

  const handleResizeEnd = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      setResizeStartPanel(null);
      saveToHistory();
    }
  }, [isResizing, saveToHistory]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = `${resizeHandle}-resize`;

      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd, resizeHandle]);

  return {
    isResizing,
    resizeHandle,
    handleResizeStart
  };
};