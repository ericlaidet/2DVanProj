// apps/web/src/components/plan/PlanList.tsx
import React from 'react';
import { useStore } from '../../store/store';
import PlanCard from './PlanCard';

const PlanList: React.FC = () => {
  const plans = useStore((s) => s.plans);
  if (!plans || plans.length === 0) return <p>Aucun plan.</p>;

  return (
    <div className="space-y-2">
      {plans.map((p) => <PlanCard key={p.id} plan={p} />)}
    </div>
  );
};

export default PlanList;
