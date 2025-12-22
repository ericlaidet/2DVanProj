// apps/web/src/hooks/usePlans.ts
import { useStore } from '../store/store';
import { apiFetch } from '../api/api';
import { notify } from '@/utils/notify';

export const usePlanManager = () => {
  const plans = useStore((s) => s.plans);
  const setPlans = (p: any[]) => useStore.setState({ plans: p });

  // ----------------------------------------------------------------------------
  // LOAD ALL PLANS
  // ----------------------------------------------------------------------------
  const loadPlans = async () => {
    try {
      const data = await apiFetch('/plans');
      setPlans(data);
    } catch (err: any) {
      console.error('Load plans error:', err);
      notify.error(err.message || 'Erreur chargement plans');
    }
  };

  // ----------------------------------------------------------------------------
  // ADD NEW PLAN
  // ----------------------------------------------------------------------------
  const addPlan = async (body: any) => {
    try {
      // ✅ Sécurisation du payload
      const safeBody = {
        name: body.name,
        jsonData: body.jsonData || [],
        // ✅ Forcer vanTypes à être un tableau valide
        vanTypes: Array.isArray(body.vanTypes)
          ? body.vanTypes
          : [body.vanTypes || useStore.getState().vanType || 'RENAULT_MASTER_L3H2'],
      };

      const saved = await apiFetch('/plans', {
        method: 'POST',
        body: JSON.stringify(safeBody),
      });

      useStore.setState({
        plans: [...useStore.getState().plans, saved],
      });

      notify.success('✅ Plan sauvegardé');
      return saved;
    } catch (err: any) {
      console.error('Save plan error:', err);
      notify.error(err.message || 'Erreur sauvegarde');
      throw err;
    }
  };

  // ----------------------------------------------------------------------------
  // UPDATE EXISTING PLAN
  // ----------------------------------------------------------------------------
  const updatePlan = async (id: number, body: any) => {
    try {
      const safeBody = {
        ...body,
        // ✅ On retire les champs non modifiables et on s’assure du bon format
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        userId: undefined,
        expiresAt: undefined,
        planVans: undefined,
        vanTypes: Array.isArray(body.vanTypes)
          ? body.vanTypes
          : [useStore.getState().vanType || 'RENAULT_MASTER_L3H2'],
      };

      const updated = await apiFetch(`/plans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(safeBody),
      });

      useStore.setState({
        plans: useStore.getState().plans.map((p) =>
          p.id === updated.id ? updated : p
        ),
      });

      notify.success('✅ Plan mis à jour');
      return updated;
    } catch (err: any) {
      console.error('Update plan error:', err);
      notify.error(err.message || 'Erreur mise à jour');
      throw err;
    }
  };

  // ----------------------------------------------------------------------------
  // DELETE PLAN
  // ----------------------------------------------------------------------------
  const removePlan = async (id: number, name?: string) => {
    try {
      await apiFetch(`/plans/${id}`, {
        method: 'DELETE',
      });

      useStore.setState({
        plans: useStore.getState().plans.filter((p) => p.id !== id),
      });

      const message = name ? `🗑️ Plan "${name}" supprimé` : '🗑️ Plan supprimé';
      notify.success(message);
    } catch (err: any) {
      console.error('Delete plan error:', err);
      notify.error(err.message || 'Impossible de supprimer');
      throw err;
    }
  };

  // ----------------------------------------------------------------------------
  // RETURN HOOK
  // ----------------------------------------------------------------------------
  return { plans, loadPlans, addPlan, updatePlan, removePlan };
};
