// apps/web/src/components/van/FurniturePalette.tsx
import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { v4 as uuidv4 } from 'uuid';
import { VAN_TYPES } from '../../constants/vans';
import { notify } from '@/utils/notify';
import './FurniturePalette.css';


interface FurnitureObject {
  id: string;
  name: string;
  width: number;
  height: number;
  color: string;
}

interface Props {
  onAddObject: (obj: FurnitureObject) => void;
  maxObjects?: number;
}

//const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

const COLORS = [
  { name: 'red', value: '#ef4444' },
  { name: 'green', value: '#10b981' },
  { name: 'blue', value: '#3b82f6' },
  { name: 'orange', value: '#f97316' },
  { name: 'purple', value: '#a855f7' }
];

const FurniturePalette: React.FC<Props> = ({ onAddObject, maxObjects }) => {
  const [name, setName] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);

  const handleAdd = () => {
    // Validation
    if (!name.trim()) {
      notify.error('Veuillez entrer un nom pour l\'objet');
      return;
    }

    if (!dimensions.trim()) {
      notify.error('Veuillez entrer les dimensions');
      return;
    }

    // Parse dimensions (format: 500x300)
    const match = dimensions.match(/^(\d+)\s*x\s*(\d+)$/i);
    if (!match) {
      notify.error('Format invalide. Utilisez: largeur x hauteur (ex: 500x300)');
      return;
    }

    const width = parseInt(match[1]);
    const height = parseInt(match[2]);

    if (width <= 0 || height <= 0 || width > 10000 || height > 10000) {
      notify.error('Les dimensions doivent être entre 1 et 10000 mm');
      return;
    }

    // Create object
    const newObject: FurnitureObject = {
      id: `obj-${Date.now()}`,
      name: name.trim(),
      width,
      height,
      color: selectedColor
    };

    onAddObject(newObject);
    
    // Reset form
    setName('');
    setDimensions('');
    notify.success(`Objet "${newObject.name}" ajouté`);
  };

  return (
    <div className="furniture-palette">
      <h3>Palette d'objets</h3>

      <div className="palette-form">
        <div className="form-field">
          <label htmlFor="obj-name">Nom :</label>
          <input
            id="obj-name"
            type="text"
            placeholder="Ex : Table"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="obj-dimensions">Dimensions :</label>
          <input
            id="obj-dimensions"
            type="text"
            placeholder="Ex : 500x300"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />
          <small>Format: largeur x hauteur (en mm)</small>
        </div>

        <div className="form-field">
          <label>Couleur :</label>
          <div className="color-picker">
            {COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                className={`color-btn ${selectedColor === color.value ? 'selected' : ''}`}
                style={{ backgroundColor: color.value }}
                data-color={color.name}
                onClick={() => setSelectedColor(color.value)}
                aria-label={`Couleur ${color.name}`}
              />
            ))}
          </div>
        </div>

        <button 
          type="button"
          className="add-btn"
          onClick={handleAdd}
        >
          Ajouter
        </button>
      </div>
    </div>
  );
};

/*
const FurniturePalette: React.FC = () => {
  const addObject = useStore((s) => s.addObject);
  const vanType = useStore((s) => s.vanType);

  const handleAdd = (color: string) => {
    // ⚡ Find current van dimensions
    const van = VAN_TYPES.find((v) => v.vanType === vanType) ?? { length: 4000, width: 2000 };

    // ⚡ Place new object near top-left, but inside van bounds
    const objWidth = 200;
    const objHeight = 100;
    const padding = 50;

    const x = Math.min(padding, van.length - objWidth);
    const y = Math.min(padding, van.width - objHeight);

    addObject({
      id: uuidv4(),
      x,
      y,
      width: objWidth,
      height: objHeight,
      color,
    });
  };

  return (
    <div className="palette">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => handleAdd(c)}
          style={{ background: c }}
          className="w-10 h-10 rounded shadow-sm"
          title="Ajouter un meuble"
          aria-label="Ajouter un meuble"
        />
      ))}
    </div>
  );
};

*/

export default FurniturePalette;
