import html2canvas from 'html2canvas';
import { Panel } from '../components/types';

interface CanvasConfig {
    panels: Panel[];
    canvasWidth: number;
    canvasHeight: number;
    canvasBgColor: string;
    canvasFgColor: string;
    roundedCorners: boolean;
    showGrid: boolean;
}

export const useExportImport = (
    panels: Panel[],
    setPanels: React.Dispatch<React.SetStateAction<Panel[]>>,
    canvasWidth: number,
    setCanvasWidth: React.Dispatch<React.SetStateAction<number>>,
    canvasHeight: number,
    setCanvasHeight: React.Dispatch<React.SetStateAction<number>>,
    canvasBgColor: string,
    setCanvasBgColor: React.Dispatch<React.SetStateAction<string>>,
    canvasFgColor: string,
    setCanvasFgColor: React.Dispatch<React.SetStateAction<string>>,
    roundedCorners: boolean,
    setRoundedCorners: React.Dispatch<React.SetStateAction<boolean>>,
    showGrid: boolean,
    setShowGrid: React.Dispatch<React.SetStateAction<boolean>>,
    saveToHistory: () => void
) => {
    const exportToPNG = () => {
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            const clone = canvasContainer.cloneNode(true) as HTMLElement;

            clone.querySelectorAll('*').forEach((el) => {
                (el as HTMLElement).style.pointerEvents = 'auto';
            });

            clone.style.position = 'absolute';
            clone.style.top = '0';
            clone.style.left = '0';
            clone.style.zIndex = '9999';
            clone.style.opacity = '1';
            document.body.appendChild(clone);

            html2canvas(clone, {
                backgroundColor: canvasBgColor,
                scale: 2,
                logging: false,
            }).then((canvas: HTMLCanvasElement) => {
                const link = document.createElement('a');
                link.download = 'panel-drawing.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                document.body.removeChild(clone);
            });
        }
    };

    const exportConfig = () => {
        const config: CanvasConfig = {
            panels,
            canvasWidth,
            canvasHeight,
            canvasBgColor,
            canvasFgColor,
            roundedCorners,
            showGrid
        };

        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'panel-layout.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const importConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const config: CanvasConfig = JSON.parse(e.target?.result as string);
                    setPanels(config.panels);
                    setCanvasWidth(config.canvasWidth);
                    setCanvasHeight(config.canvasHeight);
                    setCanvasBgColor(config.canvasBgColor);
                    setCanvasFgColor(config.canvasFgColor);
                    setRoundedCorners(config.roundedCorners);
                    setShowGrid(config.showGrid);
                    saveToHistory();
                } catch (error) {
                    console.error('Error importing configuration:', error);
                    alert('Error importing configuration. Please check the file format.');
                }
            };
            reader.readAsText(file);
        }
    };

    return {
        exportToPNG,
        exportConfig,
        importConfig
    };
};