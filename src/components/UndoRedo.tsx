import { Undo, Redo } from 'lucide-react';

interface UndoRedoProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  theme: 'light' | 'dark';
}

export default function UndoRedo({ onUndo, onRedo, canUndo, canRedo, theme }: UndoRedoProps) {
  return (
    <div className="flex gap-2">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`p-2 rounded-lg transition-colors ${
          canUndo
            ? theme === 'dark'
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
            : theme === 'dark'
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-300 text-gray-400 cursor-not-allowed'
        }`}
        title="Undo (Ctrl+Z)"
      >
        <Undo size={20} />
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`p-2 rounded-lg transition-colors ${
          canRedo
            ? theme === 'dark'
              ? 'bg-gray-600 hover:bg-gray-700 text-white'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
            : theme === 'dark'
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-gray-300 text-gray-400 cursor-not-allowed'
        }`}
        title="Redo (Ctrl+Y)"
      >
        <Redo size={20} />
      </button>
    </div>
  );
}