// apps/web/src/components/modals/ModalContents.tsx
import React, { useState } from 'react';
import Button from '@/components/buttons/Button';

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
    <div className="text-center">
      <p className="mb-6 text-gray-700 dark:text-gray-300">{message}</p>
      <div className="flex gap-3 justify-center">
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
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nouveau nom
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          autoFocus
        />
      </div>
      <div className="flex gap-3 justify-end">
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
    <div className="text-center">
      <div className="text-5xl mb-4">🔒</div>
      <p className="mb-4 text-gray-700 dark:text-gray-300">{message}</p>
      {requiredPlan && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Abonnement requis : <span className="font-semibold">{requiredPlan}</span>
        </p>
      )}
      <div className="flex gap-3 justify-center">
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
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={4}
            autoFocus
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            autoFocus
          />
        )}
      </div>
      <div className="flex gap-3 justify-end">
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
