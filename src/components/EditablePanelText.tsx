import { Panel } from './types';

interface EditablePanelTextProps {
  panel: Panel;
  isEditing: boolean;
  setEditingId: (id: string | null) => void;
  updatePanelText: (id: string, text: string) => void;
}

function EditablePanelText({
  panel
}: EditablePanelTextProps) {
  const fontSize = panel.fontSize || Math.max(12, Math.min(panel.width, panel.height) / 10);
  const textColor = panel.textColor || '#000000';

  const shapeBoundRatio = {
    rectangle: { w: 0.9, h: 0.9 },
    square: { w: 0.85, h: 0.85 },
    circle: { w: 0.75, h: 0.75 },
    triangle: { w: 0.6, h: 0.35 },
    diamond: { w: 0.6, h: 0.45 },
    hexagon: { w: 0.75, h: 0.6 },
  };

  const ratio = shapeBoundRatio[panel.shape] || { w: 0.7, h: 0.7 };
  const maxTextWidth = panel.width * ratio.w;
  const maxTextHeight = panel.height * ratio.h;

  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: maxTextWidth,
          maxHeight: maxTextHeight,
          padding: '2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            fontSize,
            color: textColor,
            fontWeight: panel.fontWeight || 'normal',
            fontStyle: panel.fontStyle || 'normal',
            textDecoration: panel.textDecoration || 'none',
            textAlign: 'center',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            lineHeight: 1.2,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {panel.text?.trim()}
        </div>
      </div>
    </div>
  );
}

export default EditablePanelText;
