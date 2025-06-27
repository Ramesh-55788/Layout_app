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

  const containerStyle = {
    position: 'relative' as const,
    width: panel.width,
    height: panel.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const svgStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    zIndex: 1,
  };

  const textLayerStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    pointerEvents: 'auto' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const renderShape = () => {
    switch (panel.shape) {
      case 'rectangle':
      case 'square':
        return (
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
        );

      case 'circle':
        return (
          <circle
            cx={panel.width / 2}
            cy={panel.height / 2}
            r={Math.min(panel.width, panel.height) / 2 - borderWidth / 2}
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
          />
        );

      case 'triangle':
        return (
          <polygon
            points={`${panel.width / 2},${borderWidth / 2} ${panel.width - borderWidth / 2},${panel.height - borderWidth / 2} ${borderWidth / 2},${panel.height - borderWidth / 2}`}
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
            strokeLinejoin="round"
          />
        );

      case 'diamond':
        return (
          <polygon
            points={`${panel.width / 2},${borderWidth / 2} ${panel.width - borderWidth / 2},${panel.height / 2} ${panel.width / 2},${panel.height - borderWidth / 2} ${borderWidth / 2},${panel.height / 2}`}
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
            strokeLinejoin="round"
          />
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
          <polygon
            points={hexPoints.map(p => p.join(',')).join(' ')}
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
            strokeLinejoin="round"
          />
        );

      default:
        return (
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
        );
    }
  };

  return (
    <div style={containerStyle}>
      <svg width={panel.width} height={panel.height} style={svgStyle}>
        {renderShape()}
      </svg>
      <div style={textLayerStyle}>
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

export default ShapeRenderer;
