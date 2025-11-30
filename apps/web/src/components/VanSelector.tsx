import React from 'react';
import { useStore } from '../store/store';
import { VAN_TYPES } from '../constants/vans';

interface VanSelectorProps {
  userSubscription: string | undefined;
}

const VanSelector: React.FC<VanSelectorProps> = ({ userSubscription }) => {
  const vanType = useStore((state) => state.vanType);
  const setVanType = useStore((state) => state.setVanType);
  const plans = useStore((state) => state.plans);

  // Max vans par abonnement (optionnel si tu veux limiter les plans visibles)
  const maxVansBySubscription: Record<string, number> = {
    FREE: 1,
    PRO1: 3,
    PRO2: 6,
    PRO3: 10,
  };
  const maxVans = userSubscription ? maxVansBySubscription[userSubscription] ?? 1 : 1;

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value; // valeur correspond à vt.vanType
    useStore.setState({ vanType: value, objects: [] });
  };

  return (
    <div>
      <h3>Choisir un van :</h3>
      <select value={vanType} onChange={handleSelect} className="w-full p-2 border rounded">
        <option value="">-- Sélectionner --</option>
        {VAN_TYPES.map((vt) => (
          <option key={vt.vanType} value={vt.vanType}>
            {vt.displayName}
          </option>
        ))}
      </select>

      <h4>Plans disponibles pour ce van :</h4>
      <ul>
        {plans
          ?.filter((p) => p.vanType === vanType)
          .map((p) => (
            <li key={p.id}>{p.name}</li>
          ))}
      </ul>
    </div>
  );
};

export default VanSelector;
