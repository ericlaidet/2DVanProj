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
            setFormData({
                width: furniture.width,
                height: furniture.height, // 2D Height = 3D Depth (Length in 2D)
                depth: furniture.depth || furniture.height, // Usually depth is the 3D height
                z: furniture.z || 0
            });
        }
    }, [furniture]);

    if (!isOpen || !furniture) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(furniture.id, {
            width: Number(formData.width),
            height: Number(formData.height),
            depth: Number(formData.depth),
            z: Number(formData.z)
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
                        <label>Largeur (mm)</label>
                        <input
                            type="number"
                            name="width"
                            value={formData.width}
                            onChange={handleChange}
                            min="10"
                        />
                    </div>

                    <div className="furniture-form-group">
                        <label>Longueur / Profondeur 2D (mm)</label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            min="10"
                        />
                    </div>

                    <div className="furniture-form-group">
                        <label>Hauteur 3D (mm)</label>
                        <input
                            type="number"
                            name="depth"
                            value={formData.depth}
                            onChange={handleChange}
                            min="10"
                        />
                    </div>

                    <div className="furniture-form-group">
                        <label>Élévation du sol (mm)</label>
                        <input
                            type="number"
                            name="z"
                            value={formData.z}
                            onChange={handleChange}
                            min="0"
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
