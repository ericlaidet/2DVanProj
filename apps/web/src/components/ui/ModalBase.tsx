// apps/web/src/components/ui/ModalBase.tsx
import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css"; // ✅ Changé de "./modal.css" à "./Modal.css"

interface Props {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalBase: React.FC<Props> = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}> {/* ✅ Ajout onClick pour fermer */}
      <div 
        className="modal-window"
        onClick={(e) => e.stopPropagation()} // ✅ Empêche la fermeture en cliquant dedans
      >
        <button className="modal-close" onClick={onClose} aria-label="Fermer">
          ✕ {/* ✅ Caractère corrigé */}
        </button>

        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );

  // ✅ Utilise un portail pour afficher au-dessus de tout
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default ModalBase;
