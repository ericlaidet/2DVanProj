// apps/web/src/components/van/FurniturePresets.tsx
import React from 'react';
import { useStore } from '../../store/store';
import { FURNITURE_PRESETS, FurnitureType } from '../../constants/furniture';
import { VAN_TYPES } from '../../constants/vans';
import { notify } from '@/utils/notify';
import './FurniturePresets.css';

/**
 * Component to display and add predefined furniture presets
 */
const FurniturePresets: React.FC = () => {
    const vanType = useStore((s) => s.vanType);
    const addObject = useStore((s) => s.addObject);

    const handleAddPreset = (type: FurnitureType) => {
        if (!vanType) {
            notify.error('Sélectionnez d\'abord un type de van');
            return;
        }

        const van = VAN_TYPES.find((v) => v.vanType === vanType);
        if (!van) {
            notify.error('Type de van non trouvé');
            return;
        }

        const preset = FURNITURE_PRESETS[type];

        // Validate dimensions
        if (preset.defaultWidth > van.length || preset.defaultHeight > van.width) {
            notify.error(`Ce meuble est trop grand pour ce van (${preset.defaultWidth}x${preset.defaultHeight}mm)`);
            return;
        }

        // Place near top-left with some padding
        const padding = 100;
        const x = Math.min(padding, van.length - preset.defaultWidth);
        const y = Math.min(padding, van.width - preset.defaultHeight);

        addObject({
            id: `${type}-${Date.now()}`,
            name: preset.name,
            type: type,
            x,
            y,
            width: preset.defaultWidth,
            height: preset.defaultHeight,
            color: preset.color,
        });

        notify.success(`${preset.icon} ${preset.name} ajouté`);
    };

    return (
        <div className="furniture-presets">
            <h3 className="presets-title">Meubles prédéfinis</h3>
            <p className="presets-description">
                Cliquez sur un meuble pour l'ajouter au van
            </p>

            <div className="presets-grid">
                {(Object.keys(FURNITURE_PRESETS) as FurnitureType[])
                    .filter(type => type !== 'custom') // Don't show custom preset
                    .map((type) => {
                        const preset = FURNITURE_PRESETS[type];
                        return (
                            <button
                                key={type}
                                className="preset-card"
                                onClick={() => handleAddPreset(type)}
                                disabled={!vanType}
                                title={preset.description}
                            >
                                <div className="preset-icon" style={{ backgroundColor: preset.color }}>
                                    {preset.icon}
                                </div>
                                <div className="preset-info">
                                    <div className="preset-name">{preset.name}</div>
                                    <div className="preset-dimensions">
                                        {preset.defaultWidth} × {preset.defaultHeight} mm
                                    </div>
                                </div>
                            </button>
                        );
                    })}
            </div>
        </div>
    );
};

export default FurniturePresets;
