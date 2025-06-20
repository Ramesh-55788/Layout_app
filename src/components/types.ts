export interface Panel {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  bgColor?: string;
  borderColor?: string;
  shape: 'rectangle' | 'square' | 'circle' | 'triangle' | 'diamond' | 'hexagon';
  text?: string;
  fontSize?: number;
  borderWidth?: number;
  textColor?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
}

export interface DimensionsPanelProps {
  panel: Panel | null;
  theme: string;
  onUpdateDimensions: (
    width: number,
    height: number,
    bgColor: string,
    borderColor: string,
    text: string,
    borderWidth: number,
    textColor: string,
    fontSize: number,
    fontWeight: 'normal' | 'bold',
    fontStyle: 'normal' | 'italic',
    textDecoration: 'none' | 'underline',
    zAction?: 'bringToFront' | 'sendToBack' | 'moveForward' | 'moveBackward'
  ) => void;
  onClose: () => void;
}