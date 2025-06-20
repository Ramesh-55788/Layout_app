import { Panel } from '../components/types';

export function reorderPanelsByZIndex(
  panels: Panel[],
  selectedId: string,
  action: 'bringToFront' | 'sendToBack' | 'moveForward' | 'moveBackward'
): Panel[] {
  const sorted = [...panels]
    .map(p => ({ ...p, zIndex: p.zIndex ?? 0 }))
    .sort((a, b) => a.zIndex - b.zIndex);

  const index = sorted.findIndex(p => p.id === selectedId);
  if (index === -1 || panels.length <= 1) return panels;

  let reordered = [...sorted];

  switch (action) {
    case 'bringToFront':
      if (index < sorted.length - 1) {
        const item = reordered.splice(index, 1)[0];
        reordered.push(item);
      }
      break;
    case 'sendToBack':
      if (index > 0) {
        const item = reordered.splice(index, 1)[0];
        reordered.unshift(item);
      }
      break;
    case 'moveForward':
      if (index < sorted.length - 1) {
        [reordered[index], reordered[index + 1]] = [reordered[index + 1], reordered[index]];
      }
      break;
    case 'moveBackward':
      if (index > 0) {
        [reordered[index], reordered[index - 1]] = [reordered[index - 1], reordered[index]];
      }
      break;
  }

  return reordered.map((panel, i) => ({ ...panel, zIndex: i }));
}
