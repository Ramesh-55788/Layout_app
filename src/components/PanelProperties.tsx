import { useEffect, useState } from 'react';
import { PanelPropertiesProps } from './types.ts';
import FontStyleSelector from './FontStyleSelector.tsx';

function PanelProperties({ panel, theme, onUpdateProperties, onClose }: PanelPropertiesProps) {
  const [editWidth, setEditWidth] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#000000');
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#000000');
  const [borderWidth, setBorderWidth] = useState('1');
  const [isEditing, setIsEditing] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState<'normal' | 'bold'>('normal');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>('normal');
  const [textDecoration, setTextDecoration] = useState<'none' | 'underline'>('none');

  useEffect(() => {
    if (panel) {
      setEditWidth(panel.width.toString());
      setEditHeight(panel.height.toString());
      setBgColor(panel.bgColor || '#ffffff');
      setBorderColor(panel.borderColor || '#000000');
      setText(panel.text || '');
      setTextColor(panel.textColor || '#000000');
      setBorderWidth((panel.borderWidth || 1).toString());
      setFontSize(panel.fontSize || 16);
      setFontWeight(panel.fontWeight || 'normal');
      setFontStyle(panel.fontStyle || 'normal');
      setTextDecoration(panel.textDecoration || 'none');
      setIsEditing(true);
    }
  }, [panel]);

  if (!panel) return null;

  const handleColorChange = (color: string, type: 'background' | 'border') => {
    if (type === 'background') {
      setBgColor(color);
      onUpdateProperties(parseInt(editWidth), parseInt(editHeight), color, borderColor, text, parseInt(borderWidth), textColor, fontSize,
        fontWeight,
        fontStyle,
        textDecoration);
    } else {
      setBorderColor(color);
      onUpdateProperties(parseInt(editWidth), parseInt(editHeight), bgColor, color, text, parseInt(borderWidth), textColor, fontSize,
        fontWeight,
        fontStyle,
        textDecoration);
    }
  };

  const handleUpdate = () => {
    const width = Math.min(1280, Math.max(50, parseInt(editWidth) || 0));
    const height = Math.min(720, Math.max(50, parseInt(editHeight) || 0));

    const parsed = parseInt(borderWidth);
    const borderW = !isNaN(parsed) ? Math.min(100, Math.max(0, parsed)) : 1;
    const clampedFontSize = fontSize < 8 ? 8 : fontSize > 100 ? 100 : fontSize;

    setEditWidth(width.toString());
    setEditHeight(height.toString());
    setBorderWidth(borderW.toString());
    setFontSize(clampedFontSize);

    onUpdateProperties(width, height, bgColor, borderColor, text, borderW, textColor, clampedFontSize,
      fontWeight,
      fontStyle,
      textDecoration);
  };

  const handleZIndexUpdate = (action: 'bringToFront' | 'sendToBack' | 'moveForward' | 'moveBackward') => {
    const width = Math.min(1280, Math.max(50, parseInt(editWidth) || 0));
    const height = Math.min(720, Math.max(50, parseInt(editHeight) || 0));
    const borderW = Math.max(0, Math.min(100, parseInt(borderWidth) || 1));
    const clampedFontSize = Math.max(8, Math.min(100, fontSize));

    onUpdateProperties(
      width,
      height,
      bgColor,
      borderColor,
      text,
      borderW,
      textColor,
      clampedFontSize,
      fontWeight,
      fontStyle,
      textDecoration,
      action
    );
  };
  return (
    <div className={`fixed top-20 right-3 z-50 p-4 rounded-xl shadow-xl border w-[300px] font-sans transition-all duration-300 overflow-hidden
      ${theme === 'dark' ? 'bg-[#2b2b2b] border-[#3f3f3f] text-white' : 'bg-[#f3f3f3] border-[#d0d0d0] text-[#323130]'}`}>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide">Properties</h3>
        <button
          onClick={() => {
            onClose();
            setIsEditing(false);
          }}
          className="w-6 h-6 flex items-center justify-center text-base rounded hover:bg-gray-400 hover:text-white transition"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
        <button
          onClick={handleUpdate}
          className="w-full py-2 rounded bg-[#0078d4] hover:bg-[#106ebe] text-white text-sm font-semibold"
        >
          Apply
        </button>

        {isEditing && (
          <>
            <details className="group rounded border transition-all" open>
              <summary className="cursor-pointer text-xs font-semibold py-2 px-3 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]">
                Dimensions
              </summary>
              <div className="px-3 pb-3 pt-2 space-y-2">
                {panel.shape === 'circle' ? (
                  <div>
                    <label className="text-xs">Radius</label>
                    <input
                      type="number"
                      value={editWidth}
                      onChange={(e) => {
                        setEditWidth(e.target.value);
                        setEditHeight(e.target.value);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                      className="w-full px-2 py-1 border rounded text-sm bg-white text-black"
                      min="50"
                      max="720"
                    />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-xs">Width</label>
                      <input
                        type="number"
                        value={editWidth}
                        onChange={(e) => setEditWidth(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                        className="w-full px-2 py-1 border rounded text-sm bg-white text-black"
                        min="50"
                        max="1280"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs">Height</label>
                      <input
                        type="number"
                        value={editHeight}
                        onChange={(e) => setEditHeight(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                        className="w-full px-2 py-1 border rounded text-sm bg-white text-black"
                        min="50"
                        max="720"
                      />
                    </div>
                  </div>
                )}
              </div>
            </details>

            <details className="group rounded border transition-all">
              <summary className="cursor-pointer text-xs font-semibold py-2 px-3 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]">
                Text & Font
              </summary>
              <div className="px-3 pb-3 pt-2 space-y-2">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="text-xs">Text</label>
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') handleUpdate();
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="w-full px-2 py-1 border rounded text-sm bg-white text-black"
                      placeholder="Enter text"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs">Font Size</label>
                    <input
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                      className="w-full px-2 py-1 border rounded text-sm bg-white text-black"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs">Text Color</label>
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => {
                      const newColor = e.target.value;
                      setTextColor(newColor);
                      onUpdateProperties(
                        parseInt(editWidth),
                        parseInt(editHeight),
                        bgColor,
                        borderColor,
                        text,
                        parseInt(borderWidth),
                        newColor,
                        fontSize,
                        fontWeight,
                        fontStyle,
                        textDecoration
                      );
                    }}
                    className="w-full h-8 border rounded cursor-pointer"
                  />
                </div>
                <FontStyleSelector
                  fontWeight={fontWeight}
                  fontStyle={fontStyle}
                  textDecoration={textDecoration}
                  theme={theme}
                  onChange={(styles: string[]) => {
                    const weight = styles.includes('bold') ? 'bold' : 'normal';
                    const italic = styles.includes('italic') ? 'italic' : 'normal';
                    const underline = styles.includes('underline') ? 'underline' : 'none';
                    setFontWeight(weight);
                    setFontStyle(italic);
                    setTextDecoration(underline);
                    handleUpdate();
                    onUpdateProperties(
                      parseInt(editWidth),
                      parseInt(editHeight),
                      bgColor,
                      borderColor,
                      text,
                      parseInt(borderWidth),
                      textColor,
                      fontSize,
                      weight,
                      italic,
                      underline
                    );
                  }}
                />
              </div>
            </details>

            <details className="group rounded border transition-all">
              <summary className="cursor-pointer text-xs font-semibold py-2 px-3 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]">
                Background & Border
              </summary>
              <div className="px-3 pb-3 pt-2 space-y-2">
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="text-xs">Background</label>
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => handleColorChange(e.target.value, 'background')}
                      className="w-full h-8 border rounded cursor-pointer"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="text-xs">Border Color</label>
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => handleColorChange(e.target.value, 'border')}
                      className="w-full h-8 border rounded cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs">Border Width</label>
                  <input
                    type="number"
                    value={borderWidth}
                    onChange={(e) => setBorderWidth(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                    className="w-full px-2 py-1 border rounded text-sm bg-white text-black"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </details>

            <details className="group rounded border transition-all">
              <summary className="cursor-pointer text-xs font-semibold py-2 px-3 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]">
                Z-Order
              </summary>
              <div className="px-3 pb-3 pt-2 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleZIndexUpdate('bringToFront')}
                  className="px-2 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Bring to Front
                </button>
                <button
                  onClick={() => handleZIndexUpdate('sendToBack')}
                  className="px-2 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Send to Back
                </button>
                <button
                  onClick={() => handleZIndexUpdate('moveForward')}
                  className="px-2 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Forward
                </button>
                <button
                  onClick={() => handleZIndexUpdate('moveBackward')}
                  className="px-2 py-1 text-sm rounded bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Backward
                </button>
              </div>
            </details>
          </>
        )}
      </div>
    </div>
  );
}

export default PanelProperties;
