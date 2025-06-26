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

  const background = theme === 'dark' ? '#374151' : '#f3f4f6';
  const strokeColor = theme === 'dark' ? '#9CA3AF' : '#374151';

  const renderShapePreview = (shape: Panel['shape']) => {
    const commonProps = {
      fill: background,
      stroke: strokeColor,
      strokeWidth: 1,
      strokeLinejoin: 'round' as const,
    };

    switch (shape) {
      case 'rectangle':
        return (
          <svg width="28" height="20" viewBox="0 0 28 20">
            <rect x="1" y="1" width="26" height="18" {...commonProps} />
          </svg>
        );

      case 'square':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <rect x="1" y="1" width="22" height="22" {...commonProps} />
          </svg>
        );

      case 'circle':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" {...commonProps} />
          </svg>
        );

      case 'triangle':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="12,2 22,20 2,20" {...commonProps} />
          </svg>
        );

      case 'diamond':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="12,2 22,12 12,22 2,12" {...commonProps} />
          </svg>
        );

      case 'hexagon':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon points="12,2 20,7 20,17 12,22 4,17 4,7" {...commonProps} />
          </svg>
        );

      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24">
            <rect x="1" y="1" width="22" height="22" {...commonProps} />
          </svg>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`absolute top-5 left-0 z-50 rounded-lg shadow-2xl border-2 p-4 grid grid-cols-3 gap-2 ${theme === 'dark'
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
          className={`flex flex-col items-center justify-center p-3 rounded-md transition-all duration-200 hover:scale-105 ${theme === 'dark'
            ? 'hover:bg-gray-700 hover:shadow-lg'
            : 'hover:bg-gray-100 hover:shadow-md'
            }`}
        >
          <div className="mb-2">
            {renderShapePreview(shape.value)}
          </div>
          <span className="text-xs font-medium">{shape.name}</span>
        </button>
      ))}
    </div>
  );
}

export default ShapeDropdown;