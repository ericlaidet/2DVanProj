// apps/web/src/components/modals/ModalContents.tsx
import React, { useState } from 'react';
import Button from '@/components/buttons/Button';
import './ModalContents.css';

// ========== CONFIRM MODAL CONTENT ==========
interface ConfirmModalContentProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModalContent: React.FC<ConfirmModalContentProps> = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger',
}) => {
  return (
    <div className="modal-content-wrapper">
      <p className="modal-text">{message}</p>
      <div className="modal-flex-row">
        <Button variant="gray" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button
          variant={variant === 'danger' ? 'red' : variant === 'warning' ? 'yellow' : 'blue'}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
};

// ========== RENAME MODAL CONTENT ==========
interface RenameModalContentProps {
  currentName: string;
  onRename: (newName: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

export const RenameModalContent: React.FC<RenameModalContentProps> = ({
  currentName,
  onRename,
  onCancel,
  placeholder = 'Nouveau nom',
}) => {
  const [name, setName] = useState(currentName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onRename(name.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-form-group">
        <label className="modal-label">
          Nouveau nom
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          className="modal-input"
          autoFocus
        />
      </div>
      <div className="modal-flex-row modal-flex-end">
        <Button variant="gray" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button variant="blue" type="submit" disabled={!name.trim()}>
          Renommer
        </Button>
      </div>
    </form>
  );
};

// ========== SUBSCRIPTION MODAL CONTENT ==========
interface SubscriptionModalContentProps {
  message: string;
  requiredPlan?: string;
  onUpgrade?: () => void;
  onClose: () => void;
}

export const SubscriptionModalContent: React.FC<SubscriptionModalContentProps> = ({
  message,
  requiredPlan,
  onUpgrade,
  onClose,
}) => {
  return (
    <div className="modal-content-wrapper">
      <div className="modal-icon-large">🔒</div>
      <p className="modal-text">{message}</p>
      {requiredPlan && (
        <p className="modal-subtext">
          Abonnement requis : <span className="modal-highlight">{requiredPlan}</span>
        </p>
      )}
      <div className="modal-flex-row">
        <Button variant="gray" onClick={onClose}>
          Fermer
        </Button>
        {onUpgrade && (
          <Button variant="yellow" onClick={onUpgrade}>
            Passer à PRO
          </Button>
        )}
      </div>
    </div>
  );
};

// ========== INPUT MODAL CONTENT ==========
interface InputModalContentProps {
  label: string;
  placeholder?: string;
  defaultValue?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
  type?: 'text' | 'email' | 'number';
  multiline?: boolean;
}

export const InputModalContent: React.FC<InputModalContentProps> = ({
  label,
  placeholder,
  defaultValue = '',
  onSubmit,
  onCancel,
  type = 'text',
  multiline = false,
}) => {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-form-group">
        <label className="modal-label">
          {label}
        </label>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="modal-textarea"
            rows={4}
            autoFocus
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="modal-input"
            autoFocus
          />
        )}
      </div>
      <div className="modal-flex-row modal-flex-end">
        <Button variant="gray" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button variant="blue" type="submit" disabled={!value.trim()}>
          Valider
        </Button>
      </div>
    </form>
  );
};
