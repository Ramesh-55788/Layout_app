import { useEffect, useState } from 'react';
import { DimensionsPanelProps } from './types.ts';

function DimensionsPanel({ panel, theme, onUpdateDimensions, onClose }: DimensionsPanelProps) {
  const [editWidth, setEditWidth] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#000000');
  const [text, setText] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (panel) {
      setEditWidth(panel.width.toString());
      setEditHeight(panel.height.toString());
      setBgColor(panel.bgColor || '#ffffff');
      setBorderColor(panel.borderColor || '#000000');
      setText(panel.text || '');
      setIsEditing(true);
    }
  }, [panel]);

  if (!panel) return null;

  const handleColorChange = (color: string, type: 'background' | 'border') => {
    if (type === 'background') {
      setBgColor(color);
      onUpdateDimensions(parseInt(editWidth), parseInt(editHeight), color, borderColor, text);
    } else {
      setBorderColor(color);
      onUpdateDimensions(parseInt(editWidth), parseInt(editHeight), bgColor, color, text);
    }
  };

  const handleUpdate = () => {
    const width = Math.min(1280, Math.max(50, parseInt(editWidth) || 0));
    const height = Math.min(720, Math.max(50, parseInt(editHeight) || 0));

    setEditWidth(width.toString());
    setEditHeight(height.toString());

    onUpdateDimensions(width, height, bgColor, borderColor, text);
  };

  return (
    <div className={`fixed top-28 right-10 z-50 p-4 rounded-xl shadow-2xl border-2 min-w-60 ${theme === 'dark'
      ? 'bg-gray-800 border-gray-600 text-white'
      : 'bg-white border-gray-300 text-gray-900'
      }`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold">Dimensions</h3>
        <button
          onClick={() => {
            onClose();
            setIsEditing(false);
          }}
          className="p-1 rounded-md hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
        >
          ✕
        </button>
      </div>
      <button
        onClick={handleUpdate}
        className={`w-full py-2 mb-2 rounded text-sm font-medium transition-colors ${theme === 'dark'
          ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
      >
        Save
      </button>

      {isEditing && (
        <div className="space-y-4">
          {panel.shape === 'circle' ? (
            <div className="flex flex-col items-start">
              <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Radius</label>
              <input
                type="number"
                value={editWidth}
                onChange={(e) => {
                  setEditWidth(e.target.value);
                  setEditHeight(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdate();
                }}
                className={`w-20 h-8 text-center font-mono rounded border ${theme === 'dark'
                  ? 'bg-gray-600 text-white border-gray-500'
                  : 'bg-white text-gray-900 border-gray-300'
                  }`}
                min="50"
                max="720"
              />
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <div>
                <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Width</label>
                <input
                  type="number"
                  value={editWidth}
                  onChange={(e) => setEditWidth(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate();
                  }}
                  className={`w-20 h-8 text-center font-mono rounded border ${theme === 'dark'
                    ? 'bg-gray-600 text-white border-gray-500'
                    : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  min="50"
                  max="1280"
                />
              </div>
              <span className={`text-lg font-bold mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>×</span>
              <div>
                <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Height</label>
                <input
                  type="number"
                  value={editHeight}
                  onChange={(e) => setEditHeight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate();
                  }}
                  className={`w-20 h-8 text-center font-mono rounded border ${theme === 'dark'
                    ? 'bg-gray-600 text-white border-gray-500'
                    : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  min="50"
                  max="720"
                />
              </div>
            </div>
          )}

          <div>
            <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdate();
              }}
              placeholder="Text"
              className={`w-full h-8 px-2 text-center font-mono rounded border ${theme === 'dark'
                ? 'bg-gray-600 text-white border-gray-500'
                : 'bg-white text-gray-900 border-gray-300'
                }`}
            />
          </div>

          <div className="flex gap-4 items-center">
            <div>
              <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => handleColorChange(e.target.value, 'background')}
                className="w-10 h-8 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className={`block text-xs mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Border</label>
              <input
                type="color"
                value={borderColor}
                onChange={(e) => handleColorChange(e.target.value, 'border')}
                className="w-10 h-8 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DimensionsPanel;
