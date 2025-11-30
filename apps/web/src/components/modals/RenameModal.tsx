// ----------------------------------------------------------------------------
// 13. MODAL COMPONENT - Rename Plan (modals/RenameModal.tsx)
// ----------------------------------------------------------------------------
import React, { useState } from 'react';
import './RenameModal.css'; // tu peux ajouter ce CSS pour le style Windows

interface Props {
  plan: { id: number; name: string };
  onClose: (newName?: string) => void;
}

export const RenameModal: React.FC<Props> = ({ plan, onClose }) => {
  const [name, setName] = useState(plan.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose(name);
  };

  return (
    <div className="rename-modal">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="plan-name">Nom du plan:</label>
          <input
            id="plan-name"
            type="text"
            placeholder="Nom du plan"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            required
          />
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="cancel"
            onClick={() => onClose()}
          >
            Annuler
          </button>
          <button type="submit" className="confirm">
            Confirmer
          </button>
        </div>
      </form>
    </div>
  );
};
