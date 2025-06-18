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
}

export interface DimensionsPanelProps {
    panel: Panel | null;
    theme: string;
    onUpdateDimensions: (
        width: number,
        height: number,
        bgColor: string,
        borderColor: string,
        text: string
    ) => void;
    onClose: () => void;
}