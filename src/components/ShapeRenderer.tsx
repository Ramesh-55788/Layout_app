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

  const getScaleFactor = (width: number, height: number, rotation: number) => {
    if (panel.shape === 'circle') return 1;

    const radians = (rotation * Math.PI) / 180;
    const cos = Math.abs(Math.cos(radians));
    const sin = Math.abs(Math.sin(radians));

    const rotatedWidth = width * cos + height * sin;
    const rotatedHeight = width * sin + height * cos;

    const scaleX = width / rotatedWidth;
    const scaleY = height / rotatedHeight;

    return Math.min(scaleX, scaleY, 1);
  };

  const rotation = panel.rotation || 0;
  const scaleFactor = getScaleFactor(panel.width, panel.height, rotation);

  const containerStyle = {
    position: 'relative' as const,
    width: panel.width,
    height: panel.height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };

  const shapeContainerStyle = {
    transform: `rotate(${rotation}deg) scale(${scaleFactor})`,
    transformOrigin: 'center center',
  };

  const svgStyle = {
    position: 'relative' as const,
    zIndex: 1,
  };

  const textLayerStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scaleFactor})`,
    transformOrigin: 'center center',
    zIndex: 2,
    pointerEvents: 'auto' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: `${panel.width}px`,
    maxHeight: `${panel.height}px`,
  };

  const renderShape = () => {
    const effectiveWidth = panel.width;
    const effectiveHeight = panel.height;

    switch (panel.shape) {
      case 'rectangle':
      case 'square':
        return (
          <rect
            x={borderWidth / 2}
            y={borderWidth / 2}
            width={effectiveWidth - borderWidth}
            height={effectiveHeight - borderWidth}
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
            cx={effectiveWidth / 2}
            cy={effectiveHeight / 2}
            r={Math.min(effectiveWidth, effectiveHeight) / 2 - borderWidth / 2}
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
          />
        );

      case 'triangle':
        return (
          <polygon
            points={`${effectiveWidth / 2},${borderWidth / 2} ${effectiveWidth - borderWidth / 2},${effectiveHeight - borderWidth / 2} ${borderWidth / 2},${effectiveHeight - borderWidth / 2}`}
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
            strokeLinejoin="round"
          />
        );

      case 'diamond':
        return (
          <polygon
            points={`${effectiveWidth / 2},${borderWidth / 2} ${effectiveWidth - borderWidth / 2},${effectiveHeight / 2} ${effectiveWidth / 2},${effectiveHeight - borderWidth / 2} ${borderWidth / 2},${effectiveHeight / 2}`}
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
            strokeLinejoin="round"
          />
        );

      case 'hexagon':
        const bw = borderWidth / 2;
        const hexPoints = [
          [effectiveWidth * 0.5, bw],
          [effectiveWidth - bw, effectiveHeight * 0.25],
          [effectiveWidth - bw, effectiveHeight * 0.75],
          [effectiveWidth * 0.5, effectiveHeight - bw],
          [bw, effectiveHeight * 0.75],
          [bw, effectiveHeight * 0.25]
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
            x={borderWidth / 2}
            y={borderWidth / 2}
            width={effectiveWidth - borderWidth}
            height={effectiveHeight - borderWidth}
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
      <div style={shapeContainerStyle}>
        <svg width={panel.width} height={panel.height} style={svgStyle}>
          {renderShape()}
        </svg>
      </div>
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