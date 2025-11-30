// apps/web/src/components/ui/Modal.tsx
import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant à l’intérieur
      >
        <button className="modal-close" onClick={onClose} aria-label="Fermer la fenêtre">
          ✕
        </button>
        {title && <h2 className="modal-title">{title}</h2>}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );

  // ✅ Utilise un portail pour s'afficher au-dessus de tout
  const portalTarget = document.getElementById("modal-root") || document.body;
  return ReactDOM.createPortal(modalContent, portalTarget);
};

export default Modal;
