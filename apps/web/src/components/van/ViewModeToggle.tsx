// apps/web/src/components/van/ViewModeToggle.tsx
import React from 'react';
import { useStore } from '../../store/store';
import './ViewModeToggle.css';

/**
 * Composant de bascule entre les modes de vue 2D et 3D
 * Toggle moderne avec animation et feedback visuel
 */
export const ViewModeToggle: React.FC = () => {
  const viewMode = useStore(s => s.viewMode);
  const toggleViewMode = useStore(s => s.toggleViewMode);
  const objects = useStore(s => s.objects);

  const handleToggle = () => {
    // Animation de feedback visuel immédiat par classe CSS
    const button = document.querySelector('.view-mode-toggle');
    button?.classList.add('toggling');

    // On bascule l'état global
    toggleViewMode();

    setTimeout(() => {
      button?.classList.remove('toggling');
    }, 400);
  };

  // Raccourci clavier V pour basculer
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'v' && !e.ctrlKey && !e.metaKey) {
        // Vérifier qu'on n'est pas dans un input
        if (
          document.activeElement?.tagName !== 'INPUT' &&
          document.activeElement?.tagName !== 'TEXTAREA'
        ) {
          handleToggle();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="view-mode-toggle-container">
      <button
        className={`view-mode-toggle mode-${viewMode}`}
        onClick={handleToggle}
        title={`Basculer vers la vue ${viewMode === '2D' ? '3D' : '2D'} (V)`}
        aria-label={`Basculer vers la vue ${viewMode === '2D' ? '3D' : '2D'}`}
        data-active-mode={viewMode}
      >
        {/* Icône 2D */}
        <div className={`mode-icon mode-2d ${viewMode === '2D' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <span className="mode-label">2D</span>
        </div>

        {/* Switch slider */}
        <div className="vmt-slider">
          <div className="vmt-track" />
          <div className="vmt-thumb" />
        </div>

        {/* Icône 3D */}
        <div className={`mode-icon mode-3d ${viewMode === '3D' ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span className="mode-label">3D</span>
        </div>
      </button>

      {/* Badge avec le nombre de meubles */}
      {objects.length > 0 && (
        <div className="objects-count-badge" data-testid="furniture-count">
          {objects.length}
        </div>
      )}

      {/* Indicateur de raccourci clavier */}
      <div className="keyboard-hint">
        <kbd>V</kbd> pour basculer
      </div>
    </div>
  );
};
