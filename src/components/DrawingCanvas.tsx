import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Trash2, Download, Upload, Save, Undo, Redo, Copy, Scissors, Clipboard, Home, Palette, Wrench, ChevronDown } from 'lucide-react';
import { Panel } from './types';
import PanelProperties from './PanelProperties';
import ShapeDropdown from './ShapeDropdown';
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
  const [newCanvasWidth, setNewCanvasWidth] = useState<string>('');
  const [newCanvasHeight, setNewCanvasHeight] = useState<string>('');
  const [canvasBgColor, setCanvasBgColor] = useState<string>('#ffffff');
  const [canvasFgColor, setCanvasFgColor] = useState<string>('#000000');
  const [roundedCorners, setRoundedCorners] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showShapeDropdown, setShowShapeDropdown] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [propertiesPanelId, setPropertiesPanelId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'view', label: 'View', icon: Palette },
    { id: 'format', label: 'Format', icon: Wrench }
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: theme === 'dark' ? '#1f1f1f' : '#fafafa',
      }}
    >
      <div>
        <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} border-b border-gray-300 shadow-sm`}>
          <div className="flex items-center justify-between px-4">
            {/* Tab Headers */}
            <div className="flex">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors relative ${activeTab === tab.id
                      ? theme === 'dark'
                        ? 'bg-gray-700 text-yellow-400 border-b-2 border-yellow-400'
                        : 'bg-gray-50 text-orange-600 border-b-2 border-orange-500'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    <IconComponent size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Right-aligned Theme Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors"
              >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Ribbon Content */}
        <div className={`px-4 py-3 mt-1 rounded-b-md border ${theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-gray-50 border-gray-300'}`}>
          {/* Home Tab */}
          {activeTab === 'home' && (
            <div className="flex items-start gap-6">
              {/* File Group */}
              <div className="flex flex-col items-center">
                <div className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  File
                </div>
                <div className="flex gap-1">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={exportConfig}
                      className={`flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      title="Save Project"
                    >
                      <Save size={24} />
                      <span className="text-xs">Save</span>
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <label className={`flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`} title="Open Project">
                      <Upload size={24} />
                      <span className="text-xs">Open</span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={importConfig}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={exportToPNG}
                      className={`flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      title="Export as PNG"
                    >
                      <Download size={24} />
                      <span className="text-xs">Export</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className={`w-px h-20 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

              {/* Clipboard Group */}
              <div className="flex flex-col items-center">
                <div className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Clipboard
                </div>
                <div className="flex gap-1">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={cut}
                      disabled={!selectedPanel}
                      className={`flex flex-col items-center gap-1 p-2 rounded transition-colors ${!selectedPanel
                        ? theme === 'dark' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : theme === 'dark' ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                        }`}
                      title="Cut"
                    >
                      <Scissors size={20} />
                      <span className="text-xs">Cut</span>
                    </button>

                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={copy}
                      disabled={!selectedPanel}
                      className={`flex flex-col items-center gap-1 p-2 rounded transition-colors ${!selectedPanel
                        ? theme === 'dark' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : theme === 'dark' ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                        }`}
                      title="Copy"
                    >
                      <Copy size={20} />
                      <span className="text-xs">Copy</span>
                    </button>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={paste}
                      className={`flex flex-col items-center gap-1 p-2 rounded transition-colors ${theme === 'dark'
                        ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                        }`}
                      title="Paste"
                    >
                      <Clipboard size={20} />
                      <span className="text-xs">Paste</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className={`w-px h-20 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

              <div className="flex flex-col items-center">
                <div className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Actions
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className={`flex flex-col items-center gap-1 p-2 rounded transition-colors ${historyIndex <= 0
                        ? theme === 'dark' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : theme === 'dark' ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                        }`}
                      title="Undo"
                    >
                      <Undo size={20} />
                      <span className="text-xs">Undo</span>
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className={`flex flex-col items-center gap-1 p-2 rounded transition-colors ${historyIndex >= history.length - 1
                        ? theme === 'dark' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : theme === 'dark' ? 'text-white bg-gray-700 hover:bg-gray-600' : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                        }`}
                      title="Redo"
                    >
                      <Redo size={20} />
                      <span className="text-xs">Redo</span>
                    </button>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <button
                      onClick={clearPanels}
                      className={`flex flex-col items-center gap-1 p-2 rounded transition-colors ${theme === 'dark'
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      title="Clear All"
                    >
                      <Trash2 size={20} color="red" />
                      <span className={`text-xs ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                        Clear
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className={`w-px h-20 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

              <div className="flex flex-col items-center">
                <div className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Shapes
                </div>
                <div className="relative shape-dropdown-container">
                  <button
                    onClick={() => setShowShapeDropdown(!showShapeDropdown)}
                    className={`flex items-center justify-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${theme === 'dark' ? 'text-white' : 'text-black'
                      }`}
                    title="Add Shape"
                  >
                    <div className="relative w-8 h-8">
                      <div className="absolute w-7 h-7 bg-blue-400 border border-blue-800 top-0 left-0" />
                      <div className="absolute w-7 h-7 bg-white border border-black rounded-full top-1 left-2" />
                    </div>
                    <ChevronDown size={20} className="ml-1" />
                  </button>
                  <div className="relative z-50">
                    <ShapeDropdown
                      isOpen={showShapeDropdown}
                      onClose={() => setShowShapeDropdown(false)}
                      onSelectShape={addPanel}
                      theme={theme}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Tab */}
          {activeTab === 'view' && (
            <div className="flex items-start gap-6">
              {/* Canvas Theme Group */}
              <div className="flex flex-col items-center">
                <div className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Canvas Theme
                </div>
                <div className="flex gap-4 items-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <label className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Background</label>
                      <input type="color"
                        value={canvasBgColor}
                        onChange={(e) => handleCanvasColorChange(e.target.value, 'bg')}
                        onMouseUp={saveToHistory}
                        onBlur={saveToHistory}
                        className="w-12 h-8 rounded cursor-pointer border border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex flex-col items-center gap-1">
                      <label className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Foreground</label>
                      <input type="color"
                        value={canvasFgColor}
                        onChange={(e) => handleCanvasColorChange(e.target.value, 'fg')}
                        onMouseUp={saveToHistory}
                        onBlur={saveToHistory}
                        className="w-12 h-8 rounded cursor-pointer border border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={`w-px h-20 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'}`}></div>

              {/* Display Options Group */}
              <div className="flex flex-col items-center">
                <div className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Display Options
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <label className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Rounded Corners</label>
                    <button
                      onClick={() => handleToggleChange(setRoundedCorners, roundedCorners)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${roundedCorners
                        ? theme === 'dark' ? 'bg-yellow-600' : 'bg-orange-500'
                        : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${roundedCorners ? 'translate-x-5' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Show Grid</label>
                    <button
                      onClick={() => handleToggleChange(setShowGrid, showGrid)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showGrid
                        ? theme === 'dark' ? 'bg-yellow-600' : 'bg-orange-500'
                        : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-700'
                        }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showGrid ? 'translate-x-5' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Format Tab */}
          {activeTab === 'format' && (
            <div className="flex items-start gap-6">
              {/* Canvas Size Group */}
              <div className="flex flex-col items-center">
                <div className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Canvas Size
                </div>
                <div className="flex gap-2 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <label className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Width</label>
                    <input
                      type="number"
                      value={newCanvasWidth}
                      onChange={(e) => setNewCanvasWidth(e.target.value)}
                      onKeyDown={(e) => handleCanvasKeyDown(e, newCanvasWidth, newCanvasHeight)}
                      className={`w-20 h-8 text-sm text-center rounded border ${theme === 'dark'
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                        }`}
                      min="200"
                      max="1200"
                      placeholder={canvasWidth.toString()}
                    />
                  </div>
                  <span className={`text-lg font-bold mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>×</span>
                  <div className="flex flex-col items-center gap-1">
                    <label className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Height</label>
                    <input
                      type="number"
                      value={newCanvasHeight}
                      onChange={(e) => setNewCanvasHeight(e.target.value)}
                      onKeyDown={(e) => handleCanvasKeyDown(e, newCanvasWidth, newCanvasHeight)}
                      className={`w-20 h-8 text-sm text-center rounded border ${theme === 'dark'
                        ? 'bg-gray-600 text-white border-gray-500'
                        : 'bg-white text-gray-900 border-gray-300'
                        }`}
                      min="200"
                      max="720"
                      placeholder={canvasHeight.toString()}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div >

      {/* Panel Properties */}
      {propertiesPanelId && (
        <PanelProperties
          panel={panels.find(p => p.id === propertiesPanelId)!}
          theme={theme}
          onUpdateProperties={(width, height, bgColor, borderColor, text, borderWidth, textColor, fontSize,
            fontWeight, fontStyle, textDecoration, zAction, rotation) =>
            updateSelectedPanelProperties(
              propertiesPanelId, width, height, bgColor, borderColor, text, borderWidth, textColor, fontSize,
              fontWeight, fontStyle, textDecoration, zAction, rotation
            )
          }
          onClose={() => {
            setPropertiesPanelId(null);
            setIsEditing(false);
          }}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      )}

      {/* Main Canvas Area */}
      < div className="flex-1 px-8 py-6" >
        <div className="flex justify-center items-center h-full">
          <div
            className={`relative border-2 canvas-container transition-colors duration-200 overflow-hidden ${roundedCorners ? 'rounded-xl' : ''
              } ${showGrid ? 'grid-background' : ''} ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
              }`}
            style={{
              width: canvasWidth,
              height: canvasHeight,
              backgroundColor: canvasBgColor,
              color: canvasFgColor,
              backgroundImage: showGrid
                ? `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                     linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`
                : 'none',
              backgroundSize: showGrid ? '20px 20px' : 'auto'
            }}
            onClick={handleCanvasClick}
          >
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
                propertiesPanelId={propertiesPanelId}
                setPropertiesPanelId={setPropertiesPanelId}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
              />
            ))}
          </div>
        </div>
      </div >
    </div >
  );
}