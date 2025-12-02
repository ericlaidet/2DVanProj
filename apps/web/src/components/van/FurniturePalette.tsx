// apps/web/src/components/van/FurniturePalette.tsx
import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { VAN_TYPES } from '../../constants/vans';
import { notify } from '@/utils/notify';
import './FurniturePalette.css';

const FURNITURE_TYPES = [
  { type: 'bed', name: 'Lit', icon: '🛏️', color: '#3b82f6', defaultWidth: 1900, defaultHeight: 1400 },
  { type: 'kitchen', name: 'Cuisine', icon: '🍳', color: '#10b981', defaultWidth: 1200, defaultHeight: 600 },
  { type: 'storage', name: 'Rangement', icon: '📦', color: '#f59e0b', defaultWidth: 800, defaultHeight: 400 },
  { type: 'bathroom', name: 'Salle de bain', icon: '🚿', color: '#8b5cf6', defaultWidth: 800, defaultHeight: 800 },
  { type: 'table', name: 'Table', icon: '🪑', color: '#ef4444', defaultWidth: 800, defaultHeight: 600 },
  { type: 'seat', name: 'Siège', icon: '💺', color: '#ec4899', defaultWidth: 500, defaultHeight: 500 },
];

export const FurniturePalette: React.FC = () => {
  const addObject = useStore(s => s.addObject);
  const vanType = useStore(s => s.vanType);

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

    // Vérifier que le meuble rentre dans le van
    if (furnitureType.defaultWidth > van.length || furnitureType.defaultHeight > van.width) {
      notify.error(`Ce meuble est trop grand pour ce van`);
      return;
    }

    // Placer près du coin avec padding
    const padding = 100;
    const x = Math.min(padding, van.length - furnitureType.defaultWidth);
    const y = Math.min(padding, van.width - furnitureType.defaultHeight);

    addObject({
      id: `${furnitureType.type}-${Date.now()}`,
      name: furnitureType.name,
      type: furnitureType.type,
      x,
      y,
      width: furnitureType.defaultWidth,
      height: furnitureType.defaultHeight,
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
