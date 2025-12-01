// apps/web/src/components/van/VanWorkspace.tsx
import React, { useEffect } from 'react';
import { useStore } from '../../store/store';
import { VanCanvas } from './VanCanvas';        // Vue 2D existante
import { VanCanvas3D } from './VanCanvas3D';    // Vue 3D nouvelle
import { ViewModeToggle } from './ViewModeToggle';
import './VanWorkspace.css';

/**
 * Composant principal de l'espace de travail
 * Gère le basculement entre les vues 2D et 3D
 * Synchronise automatiquement les deux vues via le store Zustand
 */
export const VanWorkspace: React.FC = () => {
  const viewMode = useStore(s => s.viewMode);
  const vanType = useStore(s => s.vanType);
  const objects = useStore(s => s.objects);
  const selectedObjectId = useStore(s => s.selectedObjectId);
  const setSelectedObjectId = useStore(s => s.setSelectedObjectId);

  // Log pour debugging
  useEffect(() => {
    console.log('🎨 [VanWorkspace] State:', {
      viewMode,
      vanType,
      objectsCount: objects.length,
      selectedObjectId
    });
  }, [viewMode, vanType, objects.length, selectedObjectId]);

  // Message si aucun van sélectionné
  if (!vanType) {
    return (
      <div className="van-workspace empty">
        <div className="empty-state">
          <div className="empty-icon">🚐</div>
          <h3>Aucun van sélectionné</h3>
          <p>Sélectionnez un type de van pour commencer votre aménagement</p>
        </div>
      </div>
    );
  }

  return (
    <div className="van-workspace" data-view-mode={viewMode}>
      {/* Toggle pour basculer entre 2D et 3D */}
      <ViewModeToggle />

      {/* Informations sur le van */}
      <div className="workspace-info">
        <div className="info-item">
          <span className="info-label">Van:</span>
          <span className="info-value">{vanType}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Meubles:</span>
          <span className="info-value">{objects.length}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Vue:</span>
          <span className="info-value">{viewMode}</span>
        </div>
      </div>

      {/* Canvas 2D ou 3D selon le mode */}
      <div className="workspace-canvas-container">
        {viewMode === '2D' ? (
          <VanCanvas 
            selectedObjectId={selectedObjectId}
            onSelectObject={setSelectedObjectId}
          />
        ) : (
          <VanCanvas3D />
        )}
      </div>

      {/* Indicateur de mode actif */}
      <div className="workspace-mode-indicator">
        <span className={`mode-badge ${viewMode === '2D' ? 'active' : ''}`}>
          2D
        </span>
        <span className={`mode-badge ${viewMode === '3D' ? 'active' : ''}`}>
          3D
        </span>
      </div>
    </div>
  );
};

export default VanWorkspace;
