import React, { useState, useEffect } from 'react';
import './FurnitureEditModal.css';

interface FurnitureEditModalProps {
    isOpen: boolean;
    furniture: {
        id: string;
        name: string;
        width: number;
        height: number;
        depth?: number;
        z?: number;
    } | null;
    onClose: () => void;
    onSave: (id: string, updates: { width: number; height: number; depth: number; z: number }) => void;
}

export const FurnitureEditModal: React.FC<FurnitureEditModalProps> = ({
    isOpen,
    furniture,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState({
        width: 0,
        height: 0,
        depth: 0,
        z: 0
    });

    useEffect(() => {
        if (furniture) {
            // Conversion mm -> cm avec arrondissement à 1 décimale
            setFormData({
                width: parseFloat((furniture.width / 10).toFixed(1)),
                height: parseFloat((furniture.height / 10).toFixed(1)), // 2D Height = 3D Depth
                depth: parseFloat(((furniture.depth || furniture.height) / 10).toFixed(1)),
                z: parseFloat(((furniture.z || 0) / 10).toFixed(1))
            });
        }
    }, [furniture]);

    if (!isOpen || !furniture) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Conversion cm -> mm (x10) et on assure un entier pour la cohérence
        onSave(furniture.id, {
            width: Math.round(Number(formData.width) * 10),
            height: Math.round(Number(formData.height) * 10),
            depth: Math.round(Number(formData.depth) * 10),
            z: Math.round(Number(formData.z) * 10)
        });
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="furniture-modal-overlay" onClick={onClose}>
            <div className="furniture-modal-content" onClick={e => e.stopPropagation()}>
                <div className="furniture-modal-header">
                    <h2>Modifier l'élément</h2>
                    <p>{furniture.name}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="furniture-form-group">
                        <label>Largeur (cm)</label>
                        <input
                            type="number"
                            name="width"
                            value={formData.width}
                            onChange={handleChange}
                            min="1"
                            step="0.1"
                        />
                    </div>

                    <div className="furniture-form-group">
                        <label>Longueur / Profondeur 2D (cm)</label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            min="1"
                            step="0.1"
                        />
                    </div>

                    <div className="furniture-form-group">
                        <label>Hauteur 3D (cm)</label>
                        <input
                            type="number"
                            name="depth"
                            value={formData.depth}
                            onChange={handleChange}
                            min="1"
                            step="0.1"
                        />
                    </div>

                    <div className="furniture-form-group">
                        <label>Élévation du sol (cm)</label>
                        <input
                            type="number"
                            name="z"
                            value={formData.z}
                            onChange={handleChange}
                            min="0"
                            step="0.1"
                        />
                    </div>

                    <div className="furniture-modal-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>
                            Annuler
                        </button>
                        <button type="submit" className="btn-save">
                            Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
