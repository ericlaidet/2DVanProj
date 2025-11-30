// apps/web/src/components/plan/PlanCard.tsx
import React from 'react';
import { Plan, useStore } from '@/store/store';
import { useModal } from '@/components/ui/ModalProvider';
import { ConfirmModalContent, RenameModalContent } from '@/components/modals/ModalContents';
import Button from '@/components/buttons/Button';
//import toast from 'react-hot-toast';
import { notify } from '@/utils/notify';

interface Props { 
  plan: Plan;
}

const PlanCard: React.FC<Props> = ({ plan }) => {
  const { showModal, closeModal } = useModal();
  const removePlan = useStore((s) => s.removePlan);
  const updatePlan = useStore((s) => s.updatePlan);

  // Load plan into canvas
  const handleLoad = () => {
    useStore.setState({ 
      objects: plan.jsonData || [], 
      vanType: plan.vanType || '' 
    });
    notify.success(`✅ Plan "${plan.name}" chargé`);
  };

  // Show rename modal
  const handleRename = () => {
    showModal(
      <RenameModalContent
        currentName={plan.name}
        onRename={(newName) => {
          updatePlan({ ...plan, name: newName });
          notify.success('✅ Plan renommé');
          closeModal();
        }}
        onCancel={closeModal}
      />,
      "Renommer le plan"
    );
  };

  // Show delete confirmation
  const handleDelete = () => {
    showModal(
      <ConfirmModalContent
        message={`Voulez-vous vraiment supprimer le plan "${plan.name}" ?`}
        onConfirm={() => {
          removePlan(plan.id);
          notify.success('🗑️ Plan supprimé');
          closeModal();
        }}
        onCancel={closeModal}
        confirmText="Supprimer"
        cancelText="Annuler"
        variant="danger"
      />,
      "Confirmer la suppression"
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
            {plan.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {plan.vanType ? `Van: ${plan.vanType}` : 'Aucun van'}
          </p>
        </div>
      </div>

      {plan.expiresAt && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          Expire: {new Date(plan.expiresAt).toLocaleDateString()}
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="blue" size="small" onClick={handleLoad}>
          Charger
        </Button>
        <Button variant="yellow" size="small" onClick={handleRename}>
          Renommer
        </Button>
        <Button variant="red" size="small" onClick={handleDelete}>
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default PlanCard;
