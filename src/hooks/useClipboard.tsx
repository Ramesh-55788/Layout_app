import { useRef } from 'react';
import { Panel } from '../components/types';

export const useClipboard = (
    panels: Panel[],
    setPanels: React.Dispatch<React.SetStateAction<Panel[]>>,
    selectedPanelId: string | null,
    setSelectedPanel: (id: string | null) => void
) => {
    const clipboardRef = useRef<Panel | null>(null);

    const cut = () => {
        if (!selectedPanelId) return;
        const panel = panels.find(p => p.id === selectedPanelId);
        if (!panel) return;

        clipboardRef.current = { ...panel };
        setPanels(prev => prev.filter(p => p.id !== selectedPanelId));
        setSelectedPanel(null);
    };

    const copy = () => {
        if (!selectedPanelId) return;
        const panel = panels.find(p => p.id === selectedPanelId);
        if (!panel) return;

        clipboardRef.current = { ...panel };
    };

    const paste = () => {
        if (!clipboardRef.current) return;

        const newPanel: Panel = {
            ...clipboardRef.current,
            id: crypto.randomUUID(),
            x: clipboardRef.current.x + 20,
            y: clipboardRef.current.y + 20
        };

        setPanels(prev => [...prev, newPanel]);
        setSelectedPanel(newPanel.id);
    };

    return { cut, copy, paste };
};
