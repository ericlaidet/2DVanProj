// apps/web/src/components/van/ViewModeToggle.tsx
import React from 'react';
import { useStore } from '../../store/store';
import './ViewModeToggle.css';

export const ViewModeToggle: React.FC = () => {
  const viewMode = useStore(s => s.viewMode);
  const toggleViewMode = useStore(s => s.toggleViewMode);

  return (
    <div className="view-mode-toggle">
      <button
        className={`toggle-btn ${viewMode === '2D' ? 'active' : ''}`}
        onClick={() => useStore.getState().setViewMode('2D')}
        title="Vue de dessus (2D)"
      >
        <span className="toggle-icon">📐</span>
        <span className="toggle-label">2D</span>
      </button>
      
      <div className="toggle-divider"></div>
      
      <button
        className={`toggle-btn ${viewMode === '3D' ? 'active' : ''}`}
        onClick={() => useStore.getState().setViewMode('3D')}
        title="Vue 3D interactive"
      >
        <span className="toggle-icon">🎨</span>
        <span className="toggle-label">3D</span>
      </button>
    </div>
  );
};
