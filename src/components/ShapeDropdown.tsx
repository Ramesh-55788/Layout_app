import { Panel } from './types';

interface ShapeDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectShape: (shape: Panel['shape']) => void;
  theme: string;
}

function ShapeDropdown({ isOpen, onClose, onSelectShape, theme }: ShapeDropdownProps) {
  const shapes = [
    { name: 'Rectangle', value: 'rectangle' as const },
    { name: 'Square', value: 'square' as const },
    { name: 'Circle', value: 'circle' as const },
    { name: 'Triangle', value: 'triangle' as const },
    { name: 'Diamond', value: 'diamond' as const },
    { name: 'Hexagon', value: 'hexagon' as const },
  ];

  const renderShapePreview = (shape: Panel['shape']) => {
    const background = theme === 'dark' ? '#374151' : '#f3f4f6';
    const borderColor = 'black';

    const wrapperStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
    };

    const innerBase = {
      width: '24px',
      height: '24px',
      backgroundColor: background,
      border: `1px solid ${borderColor}`,
    };

    switch (shape) {
      case 'rectangle':
        return <div className="shadow-sm" style={{ ...innerBase, width: '32px' }} />;
      case 'square':
        return <div className="shadow-sm" style={innerBase} />;
      case 'circle':
        return <div className="shadow-sm" style={{ ...innerBase, borderRadius: '50%' }} />;
      case 'triangle':
        return (
          <div className="shadow-sm" style={wrapperStyle}>
            <svg width="24" height="20" viewBox="0 0 24 20">
              <path
                d="M12 2 L2 18 L22 18 Z"
                fill={background}
                stroke={borderColor}
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      case 'diamond':
        return (
          <div className="shadow-sm" style={wrapperStyle}>
            <div
              style={{
                width: '16px',
                height: '16px',
                backgroundColor: background,
                border: `1px solid ${borderColor}`,
                transform: 'rotate(45deg)',
              }}
            />
          </div>
        );
      case 'hexagon':
        return (
          <div className="shadow-sm" style={wrapperStyle}>
            <svg width="24" height="24" viewBox="0 0 24 24">
              <polygon
                points="6,2 18,2 23,12 18,22 6,22 1,12"
                fill={background}
                stroke={borderColor}
                strokeWidth="1"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      default:
        return <div className="shadow-sm" style={innerBase} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-12 left-0 z-50 rounded-lg shadow-2xl border-2 p-4 grid grid-cols-3 ${theme === 'dark'
        ? 'bg-gray-800 border-gray-600 text-white'
        : 'bg-white border-gray-300 text-gray-900'
        }`}
      style={{ minWidth: '220px', maxWidth: '260px' }}
    >
      {shapes.map((shape) => (
        <button
          key={shape.value}
          onClick={() => {
            onSelectShape(shape.value);
            onClose();
          }}
          className={`w-full flex flex-col items-center justify-center pt-3 pb-2 rounded-md transition-colors hover:shadow-md ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
        >
          {renderShapePreview(shape.value)}
          <span className="text-xs mt-1">{shape.name}</span>
        </button>
      ))}
    </div>
  );
}

export default ShapeDropdown;
