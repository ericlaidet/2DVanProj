// apps/web/src/components/van/FurniturePalette.tsx
import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import { notify } from '@/utils/notify';
import { findAvailablePosition } from '../../utils/furniturePlacement';
import { getAdaptiveFurnitureSize } from '../../utils/furnitureSizing';
import './FurniturePalette.css';

const FURNITURE_TYPES = [
  { type: 'bed', name: 'Lit', icon: '🛏️', color: '#3b82f6' },
  { type: 'kitchen', name: 'Cuisine', icon: '🍳', color: '#10b981' },
  { type: 'storage', name: 'Rangement', icon: '📦', color: '#f59e0b' },
  { type: 'bathroom', name: 'Salle de bain', icon: '🚿', color: '#8b5cf6' },
  { type: 'table', name: 'Table', icon: '🪑', color: '#ef4444' },
  { type: 'seat', name: 'Siège', icon: '💺', color: '#ec4899' },
];

export const FurniturePalette: React.FC = () => {
  const addObject = useStore(s => s.addObject);
  const vanType = useStore(s => s.vanType);
  const objects = useStore(s => s.objects);

  const handleAddFurniture = (furnitureType: typeof FURNITURE_TYPES[0]) => {
    if (!vanType) {
      notify.error('Sélectionnez d\'abord un type de van');
      return;
    }

    const van = VAN_TYPES.find(v => v.vanType === vanType);
    if (!van) {
      notify.error('Type de van non trouvé');
      return;
    }

    // Obtenir les dimensions adaptées au van
    const { width, height, depth } = getAdaptiveFurnitureSize(furnitureType.type, vanType);

    // Vérifier que le meuble rentre dans le van
    if (width > van.length || height > van.width) {
      notify.error(`Ce meuble est trop grand pour ce van`);
      return;
    }

    // Trouver une position disponible sans collision
    const { x, y } = findAvailablePosition(
      width,
      height,
      objects,
      vanType
    );

    addObject({
      id: `${furnitureType.type}-${Date.now()}`,
      name: furnitureType.name,
      type: furnitureType.type,
      x,
      y,
      width,
      height,
      depth,
      color: furnitureType.color,
    });

    notify.success(`${furnitureType.icon} ${furnitureType.name} ajouté`);
  };

  return (
    <div className="furniture-palette">
      <h3>Palette de meubles</h3>
      <p className="palette-description">
        Cliquez sur un meuble pour l'ajouter au van
      </p>

      <div className="furniture-grid">
        {FURNITURE_TYPES.map((furniture) => (
          <button
            key={furniture.type}
            className="furniture-card"
            onClick={() => handleAddFurniture(furniture)}
            disabled={!vanType}
            title={`Ajouter ${furniture.name}`}
          >
            <div className="furniture-icon" style={{ backgroundColor: furniture.color }}>
              {furniture.icon}
            </div>
            <div className="furniture-info">
              <div className="furniture-name">{furniture.name}</div>
              <div className="furniture-dimensions">
                {furniture.defaultWidth} × {furniture.defaultHeight} mm
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FurniturePalette;
