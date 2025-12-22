import React from 'react';
import { Plan, useStore } from '@/store/store';
import { useModal } from '@/components/ui/ModalProvider';
import { ConfirmModalContent, RenameModalContent } from '@/components/modals/ModalContents';
import Button from '@/components/buttons/Button';
import { notify } from '@/utils/notify';
import { usePlanManager } from '@/hooks/usePlans';
import './PlanCard.css';

interface Props {
  plan: Plan;
}

const PlanCard: React.FC<Props> = ({ plan }) => {
  const { showModal, closeModal } = useModal();
  const { removePlan, updatePlan: updatePlanApi } = usePlanManager();
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
          updatePlanApi(plan.id, { ...plan, name: newName });
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
          removePlan(plan.id, plan.name);
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
    <div className="card plan-card-container">
      <div className="plan-card-header">
        <div className="plan-card-info">
          <h4 className="plan-card-name">
            {plan.name}
          </h4>
          <p className="plan-card-subtitle">
            {plan.vanType ? `Van: ${plan.vanType}` : 'Aucun van'}
          </p>
        </div>
      </div>

      {plan.expiresAt && (
        <div className="plan-card-expiry">
          Expire: {new Date(plan.expiresAt).toLocaleDateString()}
        </div>
      )}

      <div className="plan-card-actions">
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
