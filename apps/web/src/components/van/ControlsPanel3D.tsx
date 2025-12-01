// apps/web/src/components/van/ControlsPanel3D.tsx
import React from 'react';
import './ControlsPanel3D.css';

interface ControlsPanel3DProps {
  selectedFurnitureId: string | null;
  transformMode: 'translate' | 'rotate' | 'scale';
  onModeChange: (mode: 'translate' | 'rotate' | 'scale') => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onResetTransform?: () => void;
}

/**
 * Panneau de contrôle pour la manipulation 3D des meubles
 */
export const ControlsPanel3D: React.FC<ControlsPanel3DProps> = ({
  selectedFurnitureId,
  transformMode,
  onModeChange,
  onDelete,
  onDuplicate,
  onResetTransform
}) => {
  if (!selectedFurnitureId) {
    return (
      <div className="controls-panel-3d inactive">
        <div className="controls-hint-inline">
          <p>💡 Cliquez sur un meuble pour le sélectionner</p>
        </div>
      </div>
    );
  }

  return (
    <div className="controls-panel-3d active">
      <div className="controls-header">
        <h4>🎯 Meuble sélectionné</h4>
      </div>

      <div className="controls-section">
        <h5>Mode de transformation</h5>
        <div className="mode-buttons">
          <button
            className={`mode-btn ${transformMode === 'translate' ? 'active' : ''}`}
            onClick={() => onModeChange('translate')}
            title="Déplacer (Position)"
          >
            <span className="mode-icon">↔️</span>
            <span className="mode-label">Déplacer</span>
          </button>
          
          <button
            className={`mode-btn ${transformMode === 'rotate' ? 'active' : ''}`}
            onClick={() => onModeChange('rotate')}
            title="Rotation"
          >
            <span className="mode-icon">🔄</span>
            <span className="mode-label">Rotation</span>
          </button>
          
          <button
            className={`mode-btn ${transformMode === 'scale' ? 'active' : ''}`}
            onClick={() => onModeChange('scale')}
            title="Redimensionner"
          >
            <span className="mode-icon">↕️</span>
            <span className="mode-label">Taille</span>
          </button>
        </div>
      </div>

      <div className="controls-section">
        <h5>Actions rapides</h5>
        <div className="action-buttons">
          <button
            className="action-btn duplicate"
            onClick={onDuplicate}
            title="Dupliquer le meuble"
          >
            <span className="action-icon">📋</span>
            <span className="action-label">Dupliquer</span>
          </button>
          
          <button
            className="action-btn reset"
            onClick={onResetTransform}
            title="Réinitialiser la position"
          >
            <span className="action-icon">↺</span>
            <span className="action-label">Réinitialiser</span>
          </button>
          
          <button
            className="action-btn delete"
            onClick={onDelete}
            title="Supprimer le meuble"
          >
            <span className="action-icon">🗑️</span>
            <span className="action-label">Supprimer</span>
          </button>
        </div>
      </div>

      <div className="controls-tips">
        <div className="tip-item">
          <span className="tip-key">G</span>
          <span className="tip-desc">Basculer vers déplacer</span>
        </div>
        <div className="tip-item">
          <span className="tip-key">R</span>
          <span className="tip-desc">Basculer vers rotation</span>
        </div>
        <div className="tip-item">
          <span className="tip-key">S</span>
          <span className="tip-desc">Basculer vers taille</span>
        </div>
        <div className="tip-item">
          <span className="tip-key">Suppr</span>
          <span className="tip-desc">Supprimer</span>
        </div>
      </div>
    </div>
  );
};
