// apps/web/src/features/ai/AIAssistant.tsx
import React, { useState } from 'react';
import { useStore } from '../../store/store';
import './AIAssistant.css';

interface AIFormState {
  includeBed: boolean;
  bedType: '1pers' | '2pers';
  includeKitchen: boolean;
  includeStorage: boolean;
  customPrompt: string;
}

export const AIAssistant: React.FC = () => {
  const vanType = useStore(s => s.vanType);
  const subscription = useStore(s => s.subscription);
  
  const [formState, setFormState] = useState<AIFormState>({
    includeBed: false,
    bedType: '2pers',
    includeKitchen: true,
    includeStorage: true,
    customPrompt: ''
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vanType) {
      alert('Veuillez d\'abord sélectionner un type de van');
      return;
    }

    // Construire le prompt
    let prompt = 'Créer un aménagement de van avec :\n';
    
    if (formState.includeBed) {
      prompt += `- Un lit ${formState.bedType === '1pers' ? '1 personne' : '2 personnes'}\n`;
    }
    
    if (formState.includeKitchen) {
      prompt += '- Une cuisine complète\n';
    }
    
    if (formState.includeStorage) {
      prompt += '- Des rangements\n';
    }
    
    if (formState.customPrompt.trim()) {
      prompt += `\nInstructions supplémentaires : ${formState.customPrompt}`;
    }

    console.log('Génération avec prompt:', prompt);
    
    setIsGenerating(true);
    
    // TODO: Appel à l'API IA
    setTimeout(() => {
      setIsGenerating(false);
      alert('Fonctionnalité IA en développement');
    }, 2000);
  };

  const isPro = subscription === 'PRO1' || subscription === 'PRO2';

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h3>🤖 Assistant IA</h3>
        {!isPro && (
          <span className="pro-badge">PRO</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="ai-form">
        {/* Couchage */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formState.includeBed}
              onChange={(e) => setFormState({...formState, includeBed: e.target.checked})}
            />
            <span>Ajouter un couchage</span>
          </label>
          
          {formState.includeBed && (
            <div className="sub-options">
              <label className="radio-label">
                <input
                  type="radio"
                  name="bedType"
                  value="1pers"
                  checked={formState.bedType === '1pers'}
                  onChange={(e) => setFormState({...formState, bedType: '1pers'})}
                />
                <span>1 personne</span>
              </label>
              
              <label className="radio-label">
                <input
                  type="radio"
                  name="bedType"
                  value="2pers"
                  checked={formState.bedType === '2pers'}
                  onChange={(e) => setFormState({...formState, bedType: '2pers'})}
                />
                <span>2 personnes</span>
              </label>
            </div>
          )}
        </div>

        {/* Cuisine */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formState.includeKitchen}
              onChange={(e) => setFormState({...formState, includeKitchen: e.target.checked})}
            />
            <span>Ajouter une cuisine</span>
          </label>
        </div>

        {/* Rangements */}
        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formState.includeStorage}
              onChange={(e) => setFormState({...formState, includeStorage: e.target.checked})}
            />
            <span>Ajouter des rangements</span>
          </label>
        </div>

        {/* Instructions personnalisées */}
        <div className="form-group">
          <label htmlFor="customPrompt">
            Instructions supplémentaires (optionnel)
          </label>
          <textarea
            id="customPrompt"
            placeholder="Ex: Je souhaite un espace pour faire du télétravail, avec une grande table..."
            value={formState.customPrompt}
            onChange={(e) => setFormState({...formState, customPrompt: e.target.value})}
            rows={4}
            className="custom-prompt-textarea"
          />
        </div>

        {/* Bouton de génération */}
        <button
          type="submit"
          className="generate-button"
          disabled={!isPro || isGenerating || (!formState.includeBed && !formState.includeKitchen && !formState.includeStorage)}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span>
              Génération en cours...
            </>
          ) : (
            <>
              ✨ Générer l'aménagement
            </>
          )}
        </button>

        {!isPro && (
          <div className="upgrade-notice">
            <p>⚠️ Fonctionnalité réservée aux abonnés PRO</p>
            <button type="button" className="upgrade-button">
              Passer à PRO
            </button>
          </div>
        )}
      </form>

      {/* Résumé de la sélection */}
      {(formState.includeBed || formState.includeKitchen || formState.includeStorage) && (
        <div className="selection-summary">
          <h4>📋 Résumé de votre demande</h4>
          <ul>
            {formState.includeBed && (
              <li>🛏️ Lit {formState.bedType === '1pers' ? '1 personne' : '2 personnes'}</li>
            )}
            {formState.includeKitchen && (
              <li>🍳 Cuisine complète</li>
            )}
            {formState.includeStorage && (
              <li>📦 Rangements</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
