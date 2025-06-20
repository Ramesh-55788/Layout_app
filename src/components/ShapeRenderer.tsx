import { Panel } from './types';
import EditablePanelText from './EditablePanelText';

function ShapeRenderer({
  panel,
  roundedCorners,
  editingId,
  setEditingId,
  updatePanelText
}: {
  panel: Panel;
  roundedCorners: boolean;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  updatePanelText: (id: string, text: string) => void;
}) {

  const borderColor = panel.borderColor || '#000000';
  const bgColor = panel.bgColor || '#ffffff';
  const borderWidth = panel.borderWidth ?? 1;

  const textContainerStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    pointerEvents: 'auto' as const,
    padding: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  };

  switch (panel.shape) {
    case 'rectangle':
    case 'square':
      return (
        <div style={{ position: 'relative', width: panel.width, height: panel.height }}>
          <svg width={panel.width} height={panel.height} style={{ position: 'absolute', top: 0, left: 0 }}>
            <rect
              x={borderWidth / 2}
              y={borderWidth / 2}
              width={panel.width - borderWidth}
              height={panel.height - borderWidth}
              fill={bgColor}
              stroke={borderColor}
              strokeWidth={borderWidth}
              rx={roundedCorners ? 8 : 0}
              ry={roundedCorners ? 8 : 0}
            />
          </svg>
          <div style={{ ...textContainerStyle, color: panel.textColor || '#000000' }}>
            <EditablePanelText
              panel={panel}
              isEditing={editingId === panel.id}
              setEditingId={setEditingId}
              updatePanelText={updatePanelText}
            />
          </div>
        </div>
      );

    case 'circle':
      return (
        <div style={{ position: 'relative', width: panel.width, height: panel.height }}>
          <svg width={panel.width} height={panel.height} style={{ position: 'absolute', top: 0, left: 0 }}>
            <circle
              cx={panel.width / 2}
              cy={panel.height / 2}
              r={Math.min(panel.width, panel.height) / 2 - borderWidth / 2}
              fill={bgColor}
              stroke={borderColor}
              strokeWidth={borderWidth}
            />
          </svg>
          <div style={{ ...textContainerStyle, color: panel.textColor || '#000000' }}>
            <EditablePanelText
              panel={panel}
              isEditing={editingId === panel.id}
              setEditingId={setEditingId}
              updatePanelText={updatePanelText}
            />
          </div>
        </div>
      );

    case 'triangle':
      return (
        <div style={{ position: 'relative', width: panel.width, height: panel.height }}>
          <svg width={panel.width} height={panel.height} style={{ position: 'absolute', top: 0, left: 0 }}>
            <polygon
              points={`${panel.width / 2},${borderWidth / 2} ${panel.width - borderWidth / 2},${panel.height - borderWidth / 2} ${borderWidth / 2},${panel.height - borderWidth / 2}`} fill={bgColor}
              stroke={borderColor}
              strokeWidth={borderWidth}
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ ...textContainerStyle, color: panel.textColor || '#000000' }}>
            <EditablePanelText
              panel={panel}
              isEditing={editingId === panel.id}
              setEditingId={setEditingId}
              updatePanelText={updatePanelText}
            />
          </div>
        </div>
      );

    case 'diamond':
      return (
        <div style={{ position: 'relative', width: panel.width, height: panel.height }}>
          <svg width={panel.width} height={panel.height} style={{ position: 'absolute', top: 0, left: 0 }}>
            <polygon
              points={`${panel.width / 2},${borderWidth / 2} ${panel.width - borderWidth / 2},${panel.height / 2} ${panel.width / 2},${panel.height - borderWidth / 2} ${borderWidth / 2},${panel.height / 2}`}
              fill={bgColor}
              stroke={borderColor}
              strokeWidth={borderWidth}
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ ...textContainerStyle, color: panel.textColor || '#000000' }}>
            <EditablePanelText
              panel={panel}
              isEditing={editingId === panel.id}
              setEditingId={setEditingId}
              updatePanelText={updatePanelText}
            />
          </div>
        </div>
      );

    case 'hexagon':
      const bw = borderWidth / 2;
      const hexPoints = [
        [panel.width * 0.5, bw],
        [panel.width - bw, panel.height * 0.25],
        [panel.width - bw, panel.height * 0.75],
        [panel.width * 0.5, panel.height - bw],
        [bw, panel.height * 0.75],
        [bw, panel.height * 0.25]
      ];

      return (
        <div style={{ position: 'relative', width: panel.width, height: panel.height }}>
          <svg width={panel.width} height={panel.height} style={{ position: 'absolute', top: 0, left: 0 }}>
            <polygon
              points={hexPoints.map(point => point.join(',')).join(' ')}
              fill={bgColor}
              stroke={borderColor}
              strokeWidth={borderWidth}
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ ...textContainerStyle, color: panel.textColor || '#000000' }}>
            <EditablePanelText
              panel={panel}
              isEditing={editingId === panel.id}
              setEditingId={setEditingId}
              updatePanelText={updatePanelText}
            />
          </div>
        </div>
      );

    default:
      return (
        <div style={{ position: 'relative', width: panel.width, height: panel.height }}>
          <svg width={panel.width} height={panel.height} style={{ position: 'absolute', top: 0, left: 0 }}>
            <rect
              x={0}
              y={0}
              width={panel.width}
              height={panel.height}
              fill={bgColor}
              stroke={borderColor}
              strokeWidth={borderWidth}
              rx={roundedCorners ? 8 : 0}
              ry={roundedCorners ? 8 : 0}
            />
          </svg>
          <div style={{ ...textContainerStyle, color: panel.textColor || '#000000' }}>
            <EditablePanelText
              panel={panel}
              isEditing={editingId === panel.id}
              setEditingId={setEditingId}
              updatePanelText={updatePanelText}
            />
          </div>
        </div>
      );
  }
}

export default ShapeRenderer;
