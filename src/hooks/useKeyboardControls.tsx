import { useState, useEffect } from 'react';

export const useKeyboardControls = (
  showShapeDropdown: boolean, 
  setShowShapeDropdown: (show: boolean) => void, 
  undo: () => void, 
  redo: () => void,
  cut: () => void,
  copy: () => void,
  paste: () => void
) => {
  const [isCtrlPressed, setIsCtrlPressed] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }

      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (e.ctrlKey && e.key === 'x') {
        e.preventDefault();
        cut();
      } else if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        copy();
      } else if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        paste();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (showShapeDropdown && !(e.target as Element).closest('.shape-dropdown-container')) {
        setShowShapeDropdown(false); 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [
    showShapeDropdown, 
    setShowShapeDropdown, 
    undo, 
    redo,
    cut,
    copy,
    paste
  ]);

  return { isCtrlPressed };
};
