import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Plus, Trash2, Move, Settings, Download, Upload, Save } from 'lucide-react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import { Panel } from './types';
import DimensionsPanel from './DimensionsPanel';
import ShapeDropdown from './ShapeDropdown';
import ShapeRenderer from './ShapeRenderer';
import UndoRedo from './UndoRedo';

interface CanvasConfig {
  panels: Panel[];
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
}

interface HistoryState {
  panels: Panel[];
  canvasWidth: number;
  canvasHeight: number;
  canvasBgColor: string;
  canvasFgColor: string;
  roundedCorners: boolean;
  showGrid: boolean;
}

export default function DrawingCanvas() {
  const { theme, toggleTheme } = useTheme();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [moveMode, setMoveMode] = useState(false);
  const [canvasWidth, setCanvasWidth] = useState(1280);
  const [canvasHeight, setCanvasHeight] = useState(720);
  const [isEditingCanvas, setIsEditingCanvas] = useState(false);
  const [newCanvasWidth, setNewCanvasWidth] = useState('');
  const [newCanvasHeight, setNewCanvasHeight] = useState('');
  const [canvasBgColor, setCanvasBgColor] = useState('#ffffff');
  const [canvasFgColor, setCanvasFgColor] = useState('#000000');
  const [roundedCorners, setRoundedCorners] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [showShapeDropdown, setShowShapeDropdown] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const updatePanelText = (id: string, newText: string) => {
    setPanels(prev =>
      prev.map(panel =>
        panel.id === id ? { ...panel, text: newText } : panel
      )
    );
  };

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

  const updateSelectedPanelDimensions = (
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

  const clearSelection = () => {
    setSelectedPanel(null);
  };

  const selectedPanelData = panels.find(panel => panel.id === selectedPanel);

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
  }, [showShapeDropdown, undo, redo]);

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

  const handleDragStop = (id: string, e: any, data: { x: number; y: number }) => {
    setPanels(prev => prev.map(panel =>
      panel.id === id ? { ...panel, x: data.x, y: data.y } : panel
    ));
    saveToHistory();
  };

  const toggleMoveMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMoveMode(!moveMode);
  };

  const handleCanvasDimensionSubmit = () => {
    const width = parseInt(newCanvasWidth);
    const height = parseInt(newCanvasHeight);

    if (!isNaN(width) && !isNaN(height) && width >= 200 && height >= 200) {
      setCanvasWidth(width);
      setCanvasHeight(height);
      saveToHistory();
    }
    setIsEditingCanvas(false);
  };

  const handleCanvasKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCanvasDimensionSubmit();
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
    // Save to history after a short delay
    setTimeout(saveToHistory, 500);
  };

  const handleToggleChange = (setter: (value: boolean) => void, currentValue: boolean) => {
    setter(!currentValue);
    setTimeout(saveToHistory, 100);
  };

  const exportToPNG = () => {
    const canvas = document.querySelector('.canvas-container');
    if (canvas) {
      html2canvas(canvas as HTMLElement, {
        backgroundColor: canvasBgColor,
        scale: 2,
        logging: false,
      }).then((canvas: HTMLCanvasElement) => {
        const link = document.createElement('a');
        link.download = 'panel-drawing.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const exportConfig = () => {
    const config: CanvasConfig = {
      panels,
      canvasWidth,
      canvasHeight,
      canvasBgColor,
      canvasFgColor,
      roundedCorners,
      showGrid
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'panel-layout.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config: CanvasConfig = JSON.parse(e.target?.result as string);
          setPanels(config.panels);
          setCanvasWidth(config.canvasWidth);
          setCanvasHeight(config.canvasHeight);
          setCanvasBgColor(config.canvasBgColor);
          setCanvasFgColor(config.canvasFgColor);
          setRoundedCorners(config.roundedCorners);
          setShowGrid(config.showGrid);
          saveToHistory();
        } catch (error) {
          console.error('Error importing configuration:', error);
          alert('Error importing configuration. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          theme === 'dark'
            ? '#111827'
            : 'linear-gradient(221deg,rgba(238, 174, 199, 1) 17%, rgba(148, 165, 233, 1) 100%)',
      }}
    >

      <DimensionsPanel
        panel={selectedPanelData || null}
        theme={theme}
        onUpdateDimensions={updateSelectedPanelDimensions}
        onClose={clearSelection}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold text-white`}>
            Layout Designer
          </h1>
          <div className="flex gap-4">
            <UndoRedo
              onUndo={undo}
              onRedo={redo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < history.length - 1}
              theme={theme}
            />
            <div className="relative shape-dropdown-container">
              <button
                onClick={() => setShowShapeDropdown(!showShapeDropdown)}
                className={`p-2 rounded-lg ${theme === 'dark'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-green-500 hover:bg-green-600'
                  } text-white transition-colors`}
              >
                <div className="flex items-center gap-2">
                  <Plus size={20} />
                  <span>Add</span>
                </div>
              </button>
              <ShapeDropdown
                isOpen={showShapeDropdown}
                onClose={() => setShowShapeDropdown(false)}
                onSelectShape={addPanel}
                theme={theme}
              />
            </div>
            <button
              onClick={exportConfig}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
            >
              <Save size={20} />
            </button>
            <label
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors cursor-pointer`}
            >
              <Upload size={20} />
              <input
                type="file"
                accept=".json"
                onChange={importConfig}
                className="hidden"
              />
            </label>
            <button
              onClick={exportToPNG}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-purple-500 hover:bg-purple-600'
                } text-white transition-colors`}
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => setIsEditingCanvas(!isEditingCanvas)}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-gray-600 hover:bg-gray-700'
                : 'bg-gray-500 hover:bg-gray-600'
                } text-white transition-colors`}
            >
              <Settings size={20} />
            </button>
            <button
              onClick={clearPanels}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-red-500 hover:bg-red-600'
                } text-white transition-colors`}
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${theme === 'dark'
                ? 'bg-yellow-600 hover:bg-yellow-700'
                : 'bg-blue-500 hover:bg-blue-600'
                } text-white transition-colors`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div
            className={`relative border-2 canvas-container transition-colors duration-200 overflow-hidden ${roundedCorners ? 'rounded-xl' : ''
              } ${showGrid ? 'grid-background' : ''}`}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor: canvasBgColor,
              color: canvasFgColor,
              backgroundImage: showGrid ? `linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px),
                linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 1px, transparent 1px)` : 'none',
              backgroundSize: showGrid ? '20px 20px' : 'auto'
            }}
          >
            {isEditingCanvas && (
              <div className="absolute top-4 right-4 z-30 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={newCanvasWidth}
                      onChange={(e) => setNewCanvasWidth(e.target.value)}
                      onKeyDown={handleCanvasKeyDown}
                      className={`w-16 h-8 text-sm font-mono rounded px-2 ${theme === 'dark'
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                        } border`}
                      min="200"
                      max="1200"
                    />
                    <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>×</span>
                    <input
                      type="number"
                      value={newCanvasHeight}
                      onChange={(e) => setNewCanvasHeight(e.target.value)}
                      onKeyDown={handleCanvasKeyDown}
                      className={`w-16 h-8 text-sm font-mono rounded px-2 ${theme === 'dark'
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                        } border`}
                      min="200"
                      max="1200"
                    />
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-1">
                      <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Background</label>
                      <input
                        type="color"
                        value={canvasBgColor}
                        onChange={(e) => handleCanvasColorChange(e.target.value, 'bg')}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>Foreground</label>
                      <input
                        type="color"
                        value={canvasFgColor}
                        onChange={(e) => handleCanvasColorChange(e.target.value, 'fg')}
                        className="w-8 h-8 rounded cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>Rounded Corners</label>
                    <button
                      onClick={() => handleToggleChange(setRoundedCorners, roundedCorners)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${roundedCorners
                        ? theme === 'dark'
                          ? 'bg-blue-600'
                          : 'bg-blue-500'
                        : theme === 'dark'
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${roundedCorners ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>Show Grid</label>
                    <button
                      onClick={() => handleToggleChange(setShowGrid, showGrid)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${showGrid
                        ? theme === 'dark'
                          ? 'bg-blue-600'
                          : 'bg-blue-500'
                        : theme === 'dark'
                          ? 'bg-gray-600'
                          : 'bg-gray-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showGrid ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {panels.map(panel => (
              <Draggable
                key={panel.id}
                position={{ x: panel.x, y: panel.y }}
                onStop={(e, data) => handleDragStop(panel.id, e, data)}
                bounds="parent"
                disabled={!isCtrlPressed && !moveMode}
              >
                <div
                  className={`absolute ${selectedPanel === panel.id ? 'z-10' : 'z-0'
                    }`}
                  style={{ zIndex: panel.zIndex }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPanel(panel.id);
                  }}
                >
                  <div className="relative group">
                    <ShapeRenderer
                      panel={panel}
                      roundedCorners={roundedCorners}
                      editingId={editingId}
                      setEditingId={setEditingId}
                      updatePanelText={updatePanelText}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removePanel(panel.id);
                        }}
                        className={`p-1.5 rounded-md ${theme === 'dark'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-red-500 hover:bg-red-600'
                          } text-white shadow-lg`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                      <button
                        onClick={toggleMoveMode}
                        className={`p-1.5 rounded-md ${moveMode
                          ? theme === 'dark'
                            ? 'bg-blue-600'
                            : 'bg-blue-500'
                          : theme === 'dark'
                            ? 'bg-gray-600'
                            : 'bg-gray-300'
                          } text-white shadow-lg cursor-move transition-colors`}
                      >
                        <Move size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}