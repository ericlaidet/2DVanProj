// ----------------------------------------------------------------------------
// 9. PLAN TOOLBAR - Complete CRUD Operations (PlanToolbar.tsx)
// ----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { usePlanManager } from '@/hooks/usePlans'; // ✅ Hook corrigé
import { useModal } from '@/components/ui/ModalProvider';
import { RenameModal } from '@/components/modals/RenameModal';
import { ConfirmModal } from '@/components/modals/ConfirmModal';
import { notify } from '@/utils/notify';
import './PlanToolbar.css';

interface Props {
  currentPlanId: number | null;
  onPlanLoad: (planData: any) => void;
  getCurrentPlanData: () => any;
}

const PlanToolbar: React.FC<Props> = ({ 
  currentPlanId, 
  onPlanLoad, 
  getCurrentPlanData 
}) => {
  // ----------------------------------------------------------------------------
  // HOOKS
  // ----------------------------------------------------------------------------
  const { plans, loadPlans, addPlan, updatePlan, removePlan } = usePlanManager(); // ✅ Hook CRUD
  const { showModal, closeModal } = useModal();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(currentPlanId);
  const [loading, setLoading] = useState(false); // local loading state

  // ----------------------------------------------------------------------------
  // EFFECT: Keep selectedPlanId in sync with currentPlanId prop
  // ----------------------------------------------------------------------------
  useEffect(() => {
    setSelectedPlanId(currentPlanId);
  }, [currentPlanId]);

  // ----------------------------------------------------------------------------
  // HANDLER: Save Plan
  // ----------------------------------------------------------------------------
  const handleSave = () => {
    showModal(
      <RenameModal
        plan={{ id: 0, name: `Plan ${new Date().toLocaleDateString()}` }}
        onClose={async (newName) => {
          if (!newName?.trim()) return;

          try {
            setLoading(true);
            const planData = getCurrentPlanData();

            // ✅ Only keep allowed fields
            const sanitizedData = {
              name: newName.trim(),
              jsonData: planData.jsonData,
            };

            const savedPlan = await addPlan(sanitizedData);
            setSelectedPlanId(savedPlan.id); // ✅ Sélectionner le plan sauvegardé
            notify.success(`💾 Plan "${newName}" sauvegardé`);
            closeModal();
          } catch (error: any) {
            notify.error(error.message || 'Erreur lors de la sauvegarde');
          } finally {
            setLoading(false);
          }
        }}
      />,
      'Sauvegarder le plan'
    );
  };

  // ----------------------------------------------------------------------------
  // HANDLER: Load Selected Plan
  // ----------------------------------------------------------------------------
  const handleLoad = async () => {
    if (!selectedPlanId) {
      notify.error('Veuillez sélectionner un plan');
      return;
    }

    try {
      setLoading(true);
      const plan = plans.find(p => p.id === selectedPlanId);
      if (!plan) throw new Error('Plan introuvable');
      onPlanLoad(plan);
      notify.success('📂 Plan chargé avec succès');
    } catch (error: any) {
      notify.error(error.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------------
  // HANDLER: Update Existing Plan
  // ----------------------------------------------------------------------------
  const handleUpdate = async () => {
    if (!selectedPlanId) {
      notify.error('Aucun plan sélectionné à mettre à jour');
      return;
    }

    showModal(
      <ConfirmModal
        message="Voulez-vous mettre à jour ce plan avec les modifications actuelles ?"
        onConfirm={async () => {
          try {
            setLoading(true);
            const planData = getCurrentPlanData();

            // ✅ Only send allowed fields
            const sanitizedData = {
              name: planData.name,       // include name if changed
              jsonData: planData.jsonData
            };

            await updatePlan(selectedPlanId, sanitizedData);
            notify.success('✏️ Plan mis à jour');
            closeModal();
          } catch (error: any) {
            notify.error(error.message || 'Erreur lors de la mise à jour');
          } finally {
            setLoading(false);
          }
        }}
        onCancel={closeModal}
      />,
      'Mettre à jour le plan'
    );
  };

  // ----------------------------------------------------------------------------
  // HANDLER: Rename Selected Plan
  // ----------------------------------------------------------------------------
  const handleRename = () => {
    if (!selectedPlanId) {
      notify.error('Veuillez sélectionner un plan');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlanId);
    if (!plan) return;

    showModal(
      <RenameModal
        plan={plan}
        onClose={async (newName) => {
          if (!newName?.trim() || newName === plan.name) {
            closeModal();
            return;
          }

          try {
            setLoading(true);

            // ✅ Only send the name field
            await updatePlan(selectedPlanId, { name: newName.trim() });

            notify.success('✏️ Plan renommé');
            closeModal();
          } catch (error: any) {
            notify.error(error.message || 'Erreur lors du renommage');
          } finally {
            setLoading(false);
          }
        }}
      />,
      'Renommer le plan'
    );
  };

  // ----------------------------------------------------------------------------
  // HANDLER: Delete Selected Plan
  // ----------------------------------------------------------------------------
  const handleDelete = () => {
    if (!selectedPlanId) {
      notify.error('Veuillez sélectionner un plan');
      return;
    }

    const plan = plans.find(p => p.id === selectedPlanId);
    if (!plan) return;

    showModal(
      <ConfirmModal
        message={`Voulez-vous vraiment supprimer le plan "${plan.name}" ? Cette action est irréversible.`}
        onConfirm={async () => {
          try {
            setLoading(true);
            await removePlan(selectedPlanId);

            // ✅ Update UI immediately
            setSelectedPlanId(null);

            notify.success('🗑️ Plan supprimé');
            closeModal();
          } catch (error: any) {
            notify.error(error.message || 'Erreur lors de la suppression');
          } finally {
            setLoading(false);
          }
        }}
        onCancel={closeModal}
      />,
      'Supprimer le plan'
    );
  };

  // ----------------------------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------------------------
  return (
    <div className="plan-toolbar">
      <div className="plan-list-section">
        <h4>Liste de plans sauvegardés ({plans.length})</h4>
        
        <div className="plan-selector">
          <select
            value={selectedPlanId || ''}
            onChange={(e) => setSelectedPlanId(Number(e.target.value) || null)}
            disabled={loading}
          >
            <option value="">-- Sélectionner un plan --</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id} data-plan-name={plan.name}>
                {plan.name}
              </option>
            ))}
          </select>

          <button
            className="action-btn update"
            onClick={handleUpdate}
            disabled={!selectedPlanId || loading}
            title="Mettre à jour le plan actuel"
          >
            ✏️ Mettre à jour
          </button>
        </div>
      </div>

      <div className="plan-actions">
        <button
          className="action-btn rename"
          onClick={handleRename}
          disabled={!selectedPlanId || loading}
        >
          ✏️ Renommer
        </button>

        <button
          className="action-btn save"
          onClick={handleSave}
          disabled={loading}
        >
          💾 Sauvegarder
        </button>

        <button
          className="action-btn load"
          onClick={handleLoad}
          disabled={!selectedPlanId || loading}
        >
          📂 Charger
        </button>

        <button
          className="action-btn delete"
          onClick={handleDelete}
          disabled={!selectedPlanId || loading}
        >
          🗑️ Supprimer
        </button>
      </div>
    </div>
  );
};

export default PlanToolbar;
