// ----------------------------------------------------------------------------
// 14. MODAL COMPONENT - Confirm (modals/ConfirmModal.tsx)
// ----------------------------------------------------------------------------
import React from 'react';
import './ConfirmModal.css'; // Ajoute le style Windows

interface ConfirmProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmProps> = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-modal">
      <p>{message}</p>
      <div className="modal-actions">
        <button type="button" className="cancel" onClick={onCancel}>
          Annuler
        </button>
        <button type="button" className="confirm danger" onClick={onConfirm}>
          Confirmer
        </button>
      </div>
    </div>
  );
};
