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
    updatePanelText(panel.id, text);
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
      className="absolute top-1/2 left-1/2 px-2 text-center pointer-events-auto overflow-hidden"
      style={{
        transform: 'translate(-50%, -50%)',
        fontSize,
        width: panel.width - 12,
        maxHeight: panel.height - 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflowWrap: 'break-word',
        wordBreak: 'break-word',
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
        <span className="text-gray-700 select-none w-full break-words overflow-hidden">
          {panel.text !== undefined && panel.text !== null ? panel.text : 'Text'}
        </span>
      )}
    </div>
  );
}

export default EditablePanelText;
