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
  const baseStyle = {
    width: panel.width,
    height: panel.height,
    backgroundColor: panel.bgColor || '#ffffff',
    border: `2px solid ${panel.borderColor || '#000000'}`,
  };

  switch (panel.shape) {
    case 'rectangle':
    case 'square':
      return (
        <div
          className={`${roundedCorners ? 'rounded-lg' : ''} relative transition-colors duration-200`}
          style={baseStyle}
        >
          <EditablePanelText
            panel={panel}
            isEditing={editingId === panel.id}
            setEditingId={setEditingId}
            updatePanelText={updatePanelText}
          />
        </div>
      );

    case 'circle':
      return (
        <div
          className="relative transition-colors duration-200"
          style={{
            ...baseStyle,
            borderRadius: '50%',
          }}
        >
          <EditablePanelText
            panel={panel}
            isEditing={editingId === panel.id}
            setEditingId={setEditingId}
            updatePanelText={updatePanelText}
          />
        </div>
      );

    case 'triangle':
      return (
        <div style={{ position: 'relative', width: panel.width, height: panel.height }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              borderLeft: `${panel.width / 2 + 3}px solid transparent`,
              borderRight: `${panel.width / 2 + 3}px solid transparent`,
              borderBottom: `${panel.height + 4}px solid ${panel.borderColor || '#D4D4D4'}`,
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: '50%',
              transform: 'translateX(-50%)',
              borderLeft: `${panel.width / 2}px solid transparent`,
              borderRight: `${panel.width / 2}px solid transparent`,
              borderBottom: `${panel.height}px solid ${panel.bgColor || '#ffffff'}`,
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
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
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: panel.width,
              height: panel.height,
              backgroundColor: panel.borderColor || '#000000',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: panel.width - 4,
              height: panel.height - 4,
              backgroundColor: panel.bgColor || '#ffffff',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              borderRadius: roundedCorners ? '8px' : '0',
              zIndex: 1,
            }}
            className="transition-colors duration-200"
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
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
      return (
        <div style={{ position: 'relative', width: panel.width, height: panel.height }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: panel.width,
              height: panel.height,
              backgroundColor: panel.borderColor || '#000000',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: panel.width - 4,
              height: panel.height - 4,
              backgroundColor: panel.bgColor || '#ffffff',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
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
        <div
          className={`${roundedCorners ? 'rounded-lg' : ''} shadow-xl transition-colors duration-200`}
          style={baseStyle}
        />
      );
  }
}

export default ShapeRenderer;
