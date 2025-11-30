import { useState } from 'react';
import { apiFetch } from '../api/api';
//import toast from 'react-hot-toast';
import { notify } from '@/utils/notify';


export type PreferenceStyle = 'minimalist' | 'rustic' | 'modern';

export interface GenerateLayoutParams {
  vanType: string;
  userDescription: string;
  preferences?: {
    sleepingCapacity?: number;
    hasCooking?: boolean;
    hasStorage?: boolean;
    style?: PreferenceStyle;
  };
}

export interface OptimizePlanParams {
  planId: number;
}

export interface LayoutSuggestion {
  layout: Array<{
    type: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
  }>;
  explanation: string;
  alternatives?: string[];
  improvements?: string[];
}

export const useAI = () => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<LayoutSuggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

	const generateLayout = async (params: GenerateLayoutParams) => {
	  setLoading(true);
	  setError(null);
	  try {
		const response = await apiFetch('/ai/generate-layout', {
		  method: 'POST',  // ✅ AJOUT
		  body: JSON.stringify(params),  // ✅ AJOUT
		});
		setSuggestion(response);
		notify.success('✨ Layout généré avec succès !');
		return response;
	  } catch (err: any) {
		const msg = err?.message || 'Erreur lors de la génération';
		setError(msg);
		notify.error(msg);
		return null;
	  } finally {
		setLoading(false);
	  }
	};

	const optimizePlan = async (params: OptimizePlanParams) => {
	  setLoading(true);
	  setError(null);
	  try {
		const response = await apiFetch('/ai/optimize-plan', {
		  method: 'POST',  // ✅ AJOUT
		  body: JSON.stringify(params),  // ✅ AJOUT
		});
		setSuggestion(response);
		notify.success('🔧 Plan optimisé !');
		return response;
	  } catch (err: any) {
		const msg = err?.message || "Erreur lors de l'optimisation";
		setError(msg);
		notify.error(msg);
		return null;
	  } finally {
		setLoading(false);
	  }
	};

  const analyzePreferences = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch('/ai/preferences');
      notify.success('📊 Analyse des préférences terminée');
      return response;
    } catch (err: any) {
      const msg = err?.message || "Erreur lors de l'analyse";
      setError(msg);
      notify.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearSuggestion = () => {
    setSuggestion(null);
    setError(null);
  };

  return {
    loading,
    suggestion,
    error,
    generateLayout,
    optimizePlan,
    analyzePreferences,
    clearSuggestion,
  };
};
