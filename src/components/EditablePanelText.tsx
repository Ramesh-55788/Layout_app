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

  return (
    <div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize,
        width: `${panel.width * 0.9}px`,
        maxHeight: `${panel.height * 0.9}px`,
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
          style={{ fontSize }}
        />
      ) : (
        <span
          className="text-gray-700 select-none w-full"
          style={{
            display: 'block',
            width: '100%',
            whiteSpace: 'pre-wrap',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            textAlign: 'center',
          }}
        >
          {text.trim() || ''}
        </span>
      )}
    </div>
  );
}

export default EditablePanelText;
