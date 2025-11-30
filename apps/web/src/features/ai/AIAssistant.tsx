// apps/web/src/features/ai/AIAssistant.tsx
import React, { useState } from 'react';
import { useStore } from '../../store/store';
import { useAI } from '@/hooks/useAI';
import Button from '../../components/buttons/Button';
import Loader from '../../components/ui/Loader';
import { notify } from '@/utils/notify';
import { VAN_TYPES } from '../../constants/vans';
import { convertAILayoutToFurniture, calculateLayoutStats } from '../../utils/aiLayoutConverter';
import './AIAssistant.css';

interface AIAssistantProps {
  subscription: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ subscription }) => {
  const [prompt, setPrompt] = useState('');
  const [preferences, setPreferences] = useState({
    sleepingCapacity: 2,
    hasCooking: true,
    hasStorage: true,
    style: 'modern' as 'minimalist' | 'rustic' | 'modern',
  });

  const vanType = useStore((s) => s.vanType);
  const { generateLayout, optimizePlan, loading, suggestion } = useAI();

  const canUseAI = ['PRO1', 'PRO2', 'PRO3'].includes(subscription);

  const handleGenerate = async () => {
    if (!vanType) {
      notify.error('Sélectionnez d\'abord un type de van');
      return;
    }

    if (!prompt.trim()) {
      notify.error('Décrivez votre aménagement souhaité');
      return;
    }

    await generateLayout({
      vanType,
      userDescription: prompt,
      preferences,
    });
  };

  const handleOptimize = async () => {
    const plans = useStore.getState().plans;
    if (plans.length === 0) {
      notify.error('Aucun plan à optimiser');
      return;
    }

    // Prendre le dernier plan
    const lastPlan = plans[plans.length - 1];
    await optimizePlan({ planId: lastPlan.id });
  };

  const handleApplySuggestion = () => {
    if (!suggestion) return;

    // Get current van dimensions
    const van = VAN_TYPES.find((v) => v.vanType === vanType);
    if (!van) {
      notify.error('Type de van non trouvé');
      return;
    }

    // Convert AI layout to furniture objects
    const furnitureObjects = convertAILayoutToFurniture(
      suggestion.layout,
      van.length,
      van.width
    );

    // Calculate stats
    const stats = calculateLayoutStats(furnitureObjects, van.length, van.width);

    // Apply to store
    useStore.setState({
      objects: furnitureObjects,
    });

    notify.success(`✨ Layout appliqué ! ${stats.totalItems} objets, ${stats.usagePercentage}% d'occupation`);
  };

  if (!canUseAI) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2">🤖 Assistant IA</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          L'assistant IA est disponible avec un abonnement PRO.
        </p>
        <Button variant="yellow" size="small">
          Passer à PRO
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        🤖 Assistant IA
        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
          {subscription}
        </span>
      </h3>

      {/* Formulaire de génération */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Décrivez votre aménagement idéal :
        </label>
        <textarea
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Je veux un lit transversal à l'arrière, une kitchenette compacte côté droit, et beaucoup de rangements..."
          disabled={loading}
        />
      </div>

      {/* Préférences */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-xs font-medium mb-1">Couchage</label>
          <select
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700"
            value={preferences.sleepingCapacity}
            onChange={(e) =>
              setPreferences({ ...preferences, sleepingCapacity: +e.target.value })
            }
            disabled={loading}
          >
            <option value={1}>1 personne</option>
            <option value={2}>2 personnes</option>
            <option value={3}>3 personnes</option>
            <option value={4}>4 personnes</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Style</label>
          <select
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700"
            value={preferences.style}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                style: e.target.value as any,
              })
            }
            disabled={loading}
          >
            <option value="minimalist">Minimaliste</option>
            <option value="rustic">Rustique</option>
            <option value="modern">Moderne</option>
          </select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-4 mb-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preferences.hasCooking}
            onChange={(e) =>
              setPreferences({ ...preferences, hasCooking: e.target.checked })
            }
            disabled={loading}
          />
          Cuisine
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={preferences.hasStorage}
            onChange={(e) =>
              setPreferences({ ...preferences, hasStorage: e.target.checked })
            }
            disabled={loading}
          />
          Rangements
        </label>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2 mb-4">
        <Button
          variant="blue"
          onClick={handleGenerate}
          disabled={loading || !vanType}
          className="flex-1"
        >
          {loading ? <Loader size={20} /> : '✨ Générer un layout'}
        </Button>
        <Button
          variant="green"
          onClick={handleOptimize}
          disabled={loading}
          size="small"
        >
          🔧 Optimiser
        </Button>
      </div>

      {/* Affichage de la suggestion */}
      {suggestion && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded p-3">
          <h4 className="font-semibold mb-2">💡 Suggestion IA</h4>
          <p className="text-sm mb-3">{suggestion.explanation}</p>

          {suggestion.alternatives && suggestion.alternatives.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium mb-1">Alternatives :</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                {suggestion.alternatives.map((alt, i) => (
                  <li key={i}>{alt}</li>
                ))}
              </ul>
            </div>
          )}

          <Button variant="green" size="small" onClick={handleApplySuggestion}>
            ✅ Appliquer cette suggestion
          </Button>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;