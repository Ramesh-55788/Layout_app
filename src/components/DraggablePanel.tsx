import React from 'react';
import Draggable from 'react-draggable';
import { Trash2, Move } from 'lucide-react';
import { Panel } from './types';
import ShapeRenderer from './ShapeRenderer';

interface ResizeHandlesProps {
  panel: Panel;
  isSelected: boolean;
  onResizeStart: (handle: string, e: React.MouseEvent) => void;
}

interface DraggablePanelProps {
  panel: Panel;
  selectedPanel: string | null;
  isCtrlPressed: boolean;
  moveMode: boolean;
  isResizing: boolean;
  roundedCorners: boolean;
  editingId: string | null;
  theme: string;
  onDragStop: (id: string, e: any, data: { x: number; y: number }) => void;
  onSelectPanel: (id: string) => void;
  onRemovePanel: (id: string) => void;
  onToggleMoveMode: (e: React.MouseEvent) => void;
  onResizeStart: (handle: string, e: React.MouseEvent) => void;
  setEditingId: (id: string | null) => void;
  updatePanelText: (id: string, text: string) => void;
}

function ResizeHandles({ isSelected, onResizeStart }: ResizeHandlesProps) {
  if (!isSelected) return null;

  const handleStyle = "absolute w-2 h-2 bg-gray-400 border border-white rounded-sm cursor-pointer hover:bg-blue-600 z-30";

  return (
    <>
      {/* Corner handles */}
      <div
        className={`${handleStyle} -top-1 -left-1 cursor-nw-resize`}
        onMouseDown={(e) => onResizeStart('nw', e)}
      />
      <div
        className={`${handleStyle} -top-1 -right-1 cursor-ne-resize`}
        onMouseDown={(e) => onResizeStart('ne', e)}
      />
      <div
        className={`${handleStyle} -bottom-1 -left-1 cursor-sw-resize`}
        onMouseDown={(e) => onResizeStart('sw', e)}
      />
      <div
        className={`${handleStyle} -bottom-1 -right-1 cursor-se-resize`}
        onMouseDown={(e) => onResizeStart('se', e)}
      />

      {/* Edge handles */}
      <div
        className={`${handleStyle} -top-1 left-1/2 -translate-x-1/2 cursor-n-resize`}
        onMouseDown={(e) => onResizeStart('n', e)}
      />
      <div
        className={`${handleStyle} -bottom-1 left-1/2 -translate-x-1/2 cursor-s-resize`}
        onMouseDown={(e) => onResizeStart('s', e)}
      />
      <div
        className={`${handleStyle} -left-1 top-1/2 -translate-y-1/2 cursor-w-resize`}
        onMouseDown={(e) => onResizeStart('w', e)}
      />
      <div
        className={`${handleStyle} -right-1 top-1/2 -translate-y-1/2 cursor-e-resize`}
        onMouseDown={(e) => onResizeStart('e', e)}
      />
    </>
  );
}

export default function DraggablePanel({
  panel,
  selectedPanel,
  isCtrlPressed,
  moveMode,
  isResizing,
  roundedCorners,
  editingId,
  theme,
  onDragStop,
  onSelectPanel,
  onRemovePanel,
  onToggleMoveMode,
  onResizeStart,
  setEditingId,
  updatePanelText
}: DraggablePanelProps) {
  return (
    <Draggable
      position={{ x: panel.x, y: panel.y }}
      onStop={(e, data) => onDragStop(panel.id, e, data)}
      bounds="parent"
      disabled={(!isCtrlPressed && !moveMode) || isResizing}
    >
      <div
        className={`absolute ${selectedPanel === panel.id ? 'z-10' : 'z-0'}`}
        style={{ zIndex: panel.zIndex }}
        onClick={(e) => {
          e.stopPropagation();
          onSelectPanel(panel.id);
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

          <ResizeHandles
            panel={panel}
            isSelected={selectedPanel === panel.id}
            onResizeStart={onResizeStart}
          />

          {/* Delete button */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemovePanel(panel.id);
              }}
              className={`p-1.5 rounded-md ${theme === 'dark'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-red-500 hover:bg-red-600'
                } text-white shadow-lg`}
            >
              <Trash2 size={14} />
            </button>
          </div>

          {/* Move button */}
          <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
            <button
              onClick={onToggleMoveMode}
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
  );
}