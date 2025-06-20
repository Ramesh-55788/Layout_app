import React, { useState, useEffect } from 'react';
import { Panel } from './types';

interface EditablePanelTextProps {
  panel: Panel;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
  updatePanelText: (id: string, text: string) => void;
}

function EditablePanelText({
  panel,
  isEditing,
  setEditingId,
  updatePanelText,
}: EditablePanelTextProps) {
  const [text, setText] = useState(panel.text || '');

  useEffect(() => {
    setText(panel.text || '');
  }, [panel.text]);

  const handleBlur = () => {
    updatePanelText(panel.id, text.trim());
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
  };

  const fontSize = Math.max(12, Math.min(panel.width, panel.height) / 10);
  const textColor = panel.textColor || '#000000';

  const shapeBoundRatio = {
    rectangle: 0.9,
    square: 0.9,
    circle: 0.75,
    triangle: 0.4,
    diamond: 0.5,
    hexagon: 0.7,
  };

  const widthRatio = shapeBoundRatio[panel.shape] || 0.7;
  const heightRatio = shapeBoundRatio[panel.shape] || 0.7;

  const maxTextWidth = panel.width * widthRatio;
  const maxLines = Math.floor((panel.height * heightRatio) / ((panel.fontSize || 16) * 1.2));

  return (
    <div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize,
        color: textColor,
        width: `${maxTextWidth}px`,
        maxHeight: `${panel.height * heightRatio}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'auto',
        overflow: 'hidden',
        textAlign: 'center',
        wordBreak: 'break-word',
        lineHeight: 1.2,
      }}
      onDoubleClick={() => setEditingId(panel.id)}
    >
      {isEditing ? (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="bg-transparent text-center outline-none w-full h-full resize-none"
          style={{ fontSize, color: textColor }}
        />
      ) : (
        <span
          className="select-text cursor-text w-full"
          style={{
            width: '100%',
            height: '100%',
            color: panel.textColor || '#000',
            fontSize: panel.fontSize || 16,
            fontWeight: panel.fontWeight || 'normal',
            fontStyle: panel.fontStyle || 'normal',
            textDecoration: panel.textDecoration || 'none',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            textAlign: 'center',
            userSelect: 'text',
            lineHeight: 1.2,
            display: '-webkit-box',
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {text.trim() || ''}
        </span>
      )}
    </div>
  );
}

export default EditablePanelText;
