import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Plus, Trash2, Settings, Download, Upload, Save } from 'lucide-react';
import { Panel } from './types';
import PanelProperties from './PanelProperties';
import ShapeDropdown from './ShapeDropdown';
import UndoRedo from './UndoRedo';
import DraggablePanel from './DraggablePanel';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useResize } from '../hooks/useResize';
import { useHistory } from '../hooks/useHistory';
import { usePanelOperations } from '../hooks/usePanelOperations';
import { useCanvasControls } from '../hooks/useCanvasControls';
import { useExportImport } from '../hooks/useExportImport';
import { useClipboard } from '../hooks/useClipboard';

export default function DrawingCanvas() {
  const { theme, toggleTheme } = useTheme();
  const [panels, setPanels] = useState<Panel[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [moveMode, setMoveMode] = useState<boolean>(false);
  const [canvasWidth, setCanvasWidth] = useState<number>(1280);
  const [canvasHeight, setCanvasHeight] = useState<number>(720);
  const [isEditingCanvas, setIsEditingCanvas] = useState<boolean>(false);
  const [newCanvasWidth, setNewCanvasWidth] = useState<string>('');
  const [newCanvasHeight, setNewCanvasHeight] = useState<string>('');
  const [canvasBgColor, setCanvasBgColor] = useState<string>('#ffffff');
  const [canvasFgColor, setCanvasFgColor] = useState<string>('#000000');
  const [roundedCorners, setRoundedCorners] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showShapeDropdown, setShowShapeDropdown] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { saveToHistory, undo, redo, history, historyIndex } = useHistory(
    panels, setPanels,
    canvasWidth, setCanvasWidth,
    canvasHeight, setCanvasHeight,
    canvasBgColor, setCanvasBgColor,
    canvasFgColor, setCanvasFgColor,
    roundedCorners, setRoundedCorners,
    showGrid, setShowGrid, setSelectedPanel
  );

  const { cut, copy, paste } = useClipboard(
    panels, setPanels, selectedPanel, setSelectedPanel
  );

  const { isCtrlPressed } = useKeyboardControls(
    showShapeDropdown, setShowShapeDropdown, undo, redo, cut, copy, paste
  );

  const { isResizing, handleResizeStart } = useResize(
    panels, setPanels, selectedPanel, canvasWidth, canvasHeight, saveToHistory
  );

  const { updatePanelText, updateSelectedPanelProperties, addPanel, removePanel, clearPanels, handleDragStop } = usePanelOperations(
    panels, setPanels, setSelectedPanel, saveToHistory
  );

  const { handleCanvasKeyDown, handleCanvasColorChange, handleToggleChange } = useCanvasControls(
    setCanvasWidth, setCanvasHeight, setCanvasBgColor, setCanvasFgColor, saveToHistory
  );

  const { exportToPNG, exportConfig, importConfig } = useExportImport(
    panels, setPanels,
    canvasWidth, setCanvasWidth,
    canvasHeight, setCanvasHeight,
    canvasBgColor, setCanvasBgColor,
    canvasFgColor, setCanvasFgColor,
    roundedCorners, setRoundedCorners,
    showGrid, setShowGrid,
    saveToHistory
  );

  const clearSelection = () => {
    setSelectedPanel(null);
  };

  const selectedPanelData = panels.find(panel => panel.id === selectedPanel);

  const toggleMoveMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMoveMode(!moveMode);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedPanel(null);
      setEditingId(null);
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
      <PanelProperties
        panel={selectedPanelData || null}
        theme={theme}
        onUpdateProperties={(width, height, bgColor, borderColor, text, borderWidth, textColor, fontSize,
          fontWeight, fontStyle, textDecoration, zAction) =>
            updateSelectedPanelProperties(selectedPanel, width, height, bgColor, borderColor, text, borderWidth, textColor, fontSize,
            fontWeight, fontStyle, textDecoration, zAction)
        }
        onClose={clearSelection}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">
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
              backgroundImage: showGrid
                ? `linear-gradient(${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                } 1px, transparent 1px),
                   linear-gradient(90deg, ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                } 1px, transparent 1px)`
                : 'none',
              backgroundSize: showGrid ? '20px 20px' : 'auto'
            }}
            onClick={handleCanvasClick}
          >
            {isEditingCanvas && (
              <div className="absolute top-4 right-4 z-30 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl border dark:border-gray-700">
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={newCanvasWidth}
                      onChange={(e) => setNewCanvasWidth(e.target.value)}
                      onKeyDown={(e) => handleCanvasKeyDown(e, newCanvasWidth, newCanvasHeight, setIsEditingCanvas)}
                      className={`w-16 h-8 text-sm font-mono rounded px-2 ${theme === 'dark'
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                        } border`}
                      min="200"
                      max="1200"
                      placeholder={canvasWidth.toString()}
                    />
                    <span className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>×</span>
                    <input
                      type="number"
                      value={newCanvasHeight}
                      onChange={(e) => setNewCanvasHeight(e.target.value)}
                      onKeyDown={(e) => handleCanvasKeyDown(e, newCanvasWidth, newCanvasHeight, setIsEditingCanvas)}
                      className={`w-16 h-8 text-sm font-mono rounded px-2 ${theme === 'dark'
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                        } border`}
                      min="200"
                      max="1200"
                      placeholder={canvasHeight.toString()}
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
              <DraggablePanel
                key={panel.id}
                panel={panel}
                selectedPanel={selectedPanel}
                isCtrlPressed={isCtrlPressed}
                moveMode={moveMode}
                isResizing={isResizing}
                roundedCorners={roundedCorners}
                editingId={editingId}
                theme={theme}
                onDragStop={handleDragStop}
                onSelectPanel={setSelectedPanel}
                onRemovePanel={removePanel}
                onToggleMoveMode={toggleMoveMode}
                onResizeStart={handleResizeStart}
                setEditingId={setEditingId}
                updatePanelText={updatePanelText}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}