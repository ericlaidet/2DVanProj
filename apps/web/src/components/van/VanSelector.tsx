import React from "react";
import { VAN_TYPES } from "@/constants/vans";
import { useModal } from "@/components/ui/ModalProvider";

interface VanModalSelectorProps {
  selectedVan?: string;
  onSelect: (vanType: string) => void;
}

const VanModalSelector: React.FC<VanModalSelectorProps> = ({ selectedVan, onSelect }) => {
  const { showModal, closeModal } = useModal();

  const openSelector = () => {
    showModal(
      <div className="van-selector">
        {VAN_TYPES.map((v) => (
          <div
            key={v.vanType}
            className={`van-card ${selectedVan === v.vanType ? "selected" : ""}`}
            onClick={() => {
              onSelect(v.vanType);
              closeModal(); // ferme la modal après sélection
            }}
          >
            <div className="van-card__image">
              <div className="van-card__placeholder">🚐</div>
            </div>
            <div className="van-card__info">
              <h3>{v.displayName}</h3>
              <p>{v.category}</p>
              <p>
                {v.length}mm × {v.width}mm
              </p>
            </div>
          </div>
        ))}
      </div>,
      "Choisir un van"
    );
  };

  return (
    <button className="open-modal-btn" onClick={openSelector}>
      {selectedVan || "Sélectionner un van"}
    </button>
  );
};

export default VanModalSelector;
