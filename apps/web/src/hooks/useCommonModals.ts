// apps/web/src/hooks/useCommonModals.ts
import { useModal } from '@/components/ui/ModalProvider';
import {
  ConfirmModalContent,
  RenameModalContent,
  SubscriptionModalContent,
  InputModalContent,
} from '@/components/modals/ModalContents';
import Button from '@/components/buttons/Button';

/**
 * Hook to access pre-configured common modals
 * Simplifies modal usage across the app
 */
export const useCommonModals = () => {
  const { showModal, closeModal } = useModal();

  /**
   * Show a confirmation dialog
   */
  const showConfirm = ({
    title = 'Confirmation',
    message,
    onConfirm,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'danger' as 'danger' | 'warning' | 'info',
  }: {
    title?: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
  }) => {
    showModal(
      <ConfirmModalContent
        message={ message }
        onConfirm = {() => {
  onConfirm();
  closeModal();
}}
onCancel = { closeModal }
confirmText = { confirmText }
cancelText = { cancelText }
variant = { variant }
  />,
  title
    );
  };

/**
 * Show a rename dialog
 */
const showRename = ({
  title = 'Renommer',
  currentName,
  onRename,
  placeholder,
}: {
  title?: string;
  currentName: string;
  onRename: (newName: string) => void;
  placeholder?: string;
}) => {
  showModal(
    <RenameModalContent
        currentName={ currentName }
        onRename = {(newName) => {
  onRename(newName);
  closeModal();
}}
onCancel = { closeModal }
placeholder = { placeholder }
  />,
  title
    );
  };

/**
 * Show a subscription required modal
 */
const showSubscriptionRequired = ({
  message = 'Cette fonctionnalité nécessite un abonnement PRO',
  requiredPlan,
  onUpgrade,
}: {
  message?: string;
  requiredPlan?: string;
  onUpgrade?: () => void;
} = {}) => {
  showModal(
    <SubscriptionModalContent
        message={ message }
        requiredPlan = { requiredPlan }
        onUpgrade = { onUpgrade }
        onClose = { closeModal }
    />,
    'Abonnement requis'
  );
};

/**
 * Show an input dialog
 */
const showInput = ({
  title = 'Saisir une valeur',
  label,
  placeholder,
  defaultValue,
  onSubmit,
  type = 'text',
  multiline = false,
}: {
  title?: string;
  label: string;
  placeholder?: string;
  defaultValue?: string;
  onSubmit: (value: string) => void;
  type?: 'text' | 'email' | 'number';
  multiline?: boolean;
}) => {
  showModal(
    <InputModalContent
        label={ label }
        placeholder = { placeholder }
        defaultValue = { defaultValue }
        onSubmit = {(value) => {
  onSubmit(value);
  closeModal();
}}
onCancel = { closeModal }
type = { type }
multiline = { multiline }
  />,
  title
    );
  };

/**
 * Show a simple alert (OK button only)
 */
const showAlert = ({
  title = 'Information',
  message,
}: {
  title?: string;
  message: string;
}) => {
  showModal(
    <div className="modal-content-wrapper" >
  <p className="modal-text" > { message } </p>
  < div className = "modal-flex-row" >
  <Button onClick={ closeModal } variant = "blue" >
  OK
  </Button>
  </div>
  </div>,
      title
  );
};

return {
  showModal,
  closeModal,
  showConfirm,
  showRename,
  showSubscriptionRequired,
  showInput,
  showAlert,
};
};

export default useCommonModals;
