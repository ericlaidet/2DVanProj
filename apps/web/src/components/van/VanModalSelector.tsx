import React, { useState, useMemo } from "react";
import { VAN_TYPES } from "@/constants/vans";
import "./VanSelector.css";

interface VanModalSelectorProps {
  selectedVan?: string;
  onSelect: (vanType: string) => void;
}

const VanModalSelector: React.FC<VanModalSelectorProps> = ({ selectedVan, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // 🔹 Filtre par type
  const [selectedType, setSelectedType] = useState("");

  // 🔎 Liste unique des catégories de van
  const types = useMemo(() => Array.from(new Set(VAN_TYPES.map(v => v.category))).sort(), []);

  // 🚐 Filtrage des vans selon le type sélectionné
  const filteredVans = useMemo(() => {
    return VAN_TYPES.filter(v => {
      return selectedType ? v.category === selectedType : true;
    });
  }, [selectedType]);

  const handleSelect = (vanType: string) => {
    onSelect(vanType);
    setIsOpen(false);
  };

  return (
    <>
      <button className="open-modal-btn" onClick={() => setIsOpen(true)}>
        {selectedVan || "Sélectionner un van"}
      </button>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Choisir un van</h2>

            {/* 🎛️ Bloc filtre par type */}
            <div className="filter-bar">
              <div className="filter-group">
                <label>Type :</label>
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="">Tous</option>
                  {types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 🚐 Liste filtrée des vans */}
            <div className="van-selector">
              {filteredVans.length > 0 ? (
                filteredVans.map((v) => (
                  <div
                    key={v.vanType}
                    className={`van-card ${selectedVan === v.vanType ? "selected" : ""}`}
                    onClick={() => handleSelect(v.vanType)}
                  >					
					<div className="van-card__image">
					  {v.imageUrl ? (
						<img src={v.imageUrl} alt={v.displayName} className="van-card__img" />
					  ) : (
						<div className="van-card__placeholder">🚐</div>
					  )}
					</div>
					
					
					
                    <div className="van-card__info">
                      <h3>{v.displayName}</h3>
                      <p className="van-category">{v.category}</p>
                      <p className="van-dimensions">{v.length}mm × {v.width}mm</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="van-selector__empty">Aucun van ne correspond à ce filtre.</p>
              )}
            </div>

            <button className="close-modal-btn" onClick={() => setIsOpen(false)}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
};

export default VanModalSelector;
