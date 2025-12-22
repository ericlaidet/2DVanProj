// apps/web/src/components/layout/VanPlannerLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/store';
import { useAuth } from '@/hooks/useAuth';
import { useAI } from '@/hooks/useAI';
import { usePlanManager } from '@/hooks/usePlans';
import { VanCanvas2D } from '@/components/van/VanCanvas2D';
import { VanCanvas3D } from '@/components/van/VanCanvas3D';
import { ViewModeToggle } from '@/components/van/ViewModeToggle';
import Button from '@/components/buttons/Button';
import { VAN_TYPES } from '@/constants/vans';
import VanModalSelector from '@/components/van/VanModalSelector';
import { FurnitureEditModal } from '@/components/van/FurnitureEditModal';
import { v4 as uuidv4 } from 'uuid';
import './VanPlannerLayout.css';
import { notify } from '@/utils/notify';
import { convertAILayoutToFurniture } from '@/utils/aiLayoutConverter';
import { findAvailablePosition } from '@/utils/furniturePlacement';
import { getAdaptiveFurnitureSize } from '@/utils/furnitureSizing';

const VanPlannerLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const vanType = useStore((s) => s.vanType);
  const setVanType = useStore((s) => s.setVanType);
  const addObject = useStore((s) => s.addObject);
  const objects = useStore((s) => s.objects);
  const viewMode = useStore((s) => s.viewMode); // ✨ NOUVEAU
  const selectedObjectId = useStore((s) => s.selectedObjectId);

  const [userName, setUserName] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<string>('FREE');

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserName(parsed.name || null);
      setSubscription(parsed.subscription || 'FREE');
    }
  }, []);

  const { generateLayout, optimizePlan, loading: aiLoading, suggestion } = useAI();
  const { plans, loadPlans, addPlan, updatePlan, removePlan } = usePlanManager();

  const [prompt, setPrompt] = useState('');
  const [hasCouchage, setHasCouchage] = useState(true);
  const [hasCuisine, setHasCuisine] = useState(true);
  const [hasRangements, setHasRangements] = useState(true);
  const [couchage, setCouchage] = useState('2');
  const [style, setStyle] = useState('minin');

  const [elementName, setElementName] = useState('');
  const [elementDimensions, setElementDimensions] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ef4444');
  const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

  // Helper pour obtenir le nom de la couleur
  const getColorName = (color: string): string => {
    const colorNames: Record<string, string> = {
      '#ef4444': 'Rouge',
      '#10b981': 'Vert',
      '#3b82f6': 'Bleu',
      '#f59e0b': 'Orange',
      '#8b5cf6': 'Violet',
      '#06b6d4': 'Cyan',
      '#ec4899': 'Rose',
      '#84cc16': 'Lime',
    };
    return colorNames[color] || 'Couleur';
  };

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editingFurnitureId, setEditingFurnitureId] = useState<string | null>(null);

  const predefinedElements = [
    { name: 'Table', icon: '🪑', color: '#ef4444', type: 'table' },
    { name: 'Cuisine', icon: '🍳', color: '#10b981', type: 'kitchen' },
    { name: 'Douche', icon: '🚿', color: '#8b5cf6', type: 'bathroom' },
    { name: 'Bureau', icon: '💼', color: '#3b82f6', type: 'storage' },
    { name: 'Lit', icon: '🛏️', color: '#3b82f6', type: 'bed' },
    { name: 'Rangement', icon: '📦', color: '#f59e0b', type: 'storage' },
  ];

  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const isPro = ['PRO1', 'PRO2', 'PRO3'].includes(subscription);
  const isPro2Plus = ['PRO2', 'PRO3'].includes(subscription);

  useEffect(() => {
    loadPlans();
  }, []);

  const handleGenerateLayout = async () => {
    if (!vanType) return notify.error("Sélectionnez d'abord un type de van");
    if (!prompt.trim()) return notify.error("Décrivez votre aménagement souhaité");

    console.log('🤖 Generating layout...', { vanType, prompt, existingObjects: objects.length });
    await generateLayout({
      vanType,
      userDescription: prompt,
      preferences: {
        sleepingCapacity: hasCouchage ? Number(couchage) : 0,
        hasCooking: hasCuisine,
        hasStorage: hasRangements,
        style: style === 'minin' ? 'minimalist' : style === 'moderne' ? 'modern' : 'rustic',
      },
      existingLayout: objects,  // ✅ Envoie les meubles déjà présents
    });
  };

  const handleOptimizePlan = async () => {
    if (plans.length === 0) return notify.error("Aucun plan à optimiser");
    const lastPlan = plans[plans.length - 1];
    console.log('🔧 Optimizing plan...', lastPlan.id);
    await optimizePlan({ planId: lastPlan.id });
  };

  const handleApplySuggestion = () => {
    if (!suggestion) return;
    console.log('✅ Applying suggestion:', suggestion);

    // Récupérer les dimensions du van
    const van = VAN_TYPES.find(v => v.vanType === vanType);
    if (!van) return notify.error("Van introuvable");

    // ✅ Utiliser le convertisseur pour créer des objets complets avec tous les champs nécessaires
    const newObjects = convertAILayoutToFurniture(
      suggestion.layout,
      van.length,
      van.width
    );

    useStore.setState({
      objects: [...objects, ...newObjects],  // Ajoute aux existants
    });

    notify.success(`${newObjects.length} meuble(s) ajouté(s) !`);
  };

  const handleSavePlan = async () => {
    if (!vanType) return notify.error('Sélectionnez un van avant de sauvegarder');
    if (objects.length === 0) return notify.error('Ajoutez des objets au plan');

    const planName = prompt.trim()
      ? `Plan ${new Date().toLocaleDateString()} - ${prompt.substring(0, 30)}...`
      : `Plan ${new Date().toLocaleDateString()}`;

    try {
      await addPlan({
        name: planName,
        jsonData: objects,
        vanTypes: [vanType],
      });
      notify.success(`💾 Plan "${planName}" sauvegardé !`);
    } catch (error: any) {
      notify.error(error.message || 'Erreur lors de la sauvegarde');
    }
  };

  const handleLoadPlan = () => {
    if (!selectedPlanId) return notify.error('Sélectionnez un plan à charger');
    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!plan) return notify.error('Plan introuvable');

    useStore.setState({
      objects: plan.jsonData || [],
      vanType: plan.planVans?.[0]?.van?.vanType || '',
    });
    notify.success(`✅ Plan "${plan.name}" chargé`);
  };

  const handleDeletePlan = async () => {
    if (!selectedPlanId) return;
    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!plan) return;
    if (!window.confirm(`Supprimer le plan "${plan.name}" ?`)) return;

    try {
      await removePlan(selectedPlanId, plan.name);
      useStore.setState({ objects: [], vanType: '' });
      setSelectedPlanId(null);
    } catch (err) {
      // Le hook gère déjà les erreurs
    }
  };

  const handleRenamePlan = async () => {
    if (!selectedPlanId) return notify.error('Sélectionnez un plan à renommer');
    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!plan) return notify.error('Plan introuvable');

    const newName = window.prompt('Entrez le nouveau nom du plan :', plan.name);
    if (!newName || newName.trim() === '') return notify.error('Nom invalide');

    try {
      useStore.setState({
        plans: plans.map((p) =>
          p.id === selectedPlanId ? { ...p, name: newName.trim() } : p
        ),
      });
      notify.success(`✅ Plan renommé en "${newName.trim()}"`);
    } catch (error: any) {
      notify.error(error.message || 'Erreur lors du renommage');
    }
  };

  const handleUpdatePlan = async () => {
    if (!selectedPlanId) return notify.error('Sélectionnez un plan à mettre à jour');
    const plan = plans.find((p) => p.id === selectedPlanId);
    if (!plan) return notify.error('Plan introuvable');

    try {
      const payload = {
        name: plan.name,
        jsonData: objects,
        vanTypes: [vanType],
      };

      console.log('✏️ Updating plan:', payload);

      if (typeof addPlan === 'function') {
        await addPlan(payload, selectedPlanId);
      }

      notify.success(`✅ Plan "${plan.name}" mis à jour`);
    } catch (error: any) {
      notify.error(error.message || 'Erreur lors de la mise à jour du plan');
    }
  };

  const handleAddCustomElement = () => {
    if (!elementName.trim() || !elementDimensions.trim()) {
      return notify.error("Nom + dimensions requis");
    }
    const parts = elementDimensions.split("x");
    if (parts.length !== 2) return notify.error("Format invalide (ex: 500x300)");
    const [width, height] = parts.map((n) => parseInt(n.trim()));
    if (!width || !height) return notify.error("Dimensions invalides");

    const van = VAN_TYPES.find((v) => v.vanType === vanType);
    if (!van) return notify.error("Sélectionnez d'abord un van");

    // Trouver une position disponible sans collision
    const { x: startX, y: startY } = findAvailablePosition(
      width,
      height,
      objects,
      vanType
    );

    addObject({
      id: uuidv4(),
      name: elementName.trim(),
      type: 'custom',
      x: startX,
      y: startY,
      z: 0,  // ✅ Position au sol
      width,
      height,
      color: selectedColor,
    });

    notify.success(`Élément "${elementName}" ajouté`);
    setElementName('');
    setElementDimensions('');
  };

  const handleAddPredefinedElement = (elementName: string) => {
    const element = predefinedElements.find(el => el.name === elementName);
    if (!element) return;

    const van = VAN_TYPES.find((v) => v.vanType === vanType);
    if (!van) return notify.error("Sélectionnez d'abord un van");

    // Obtenir les dimensions adaptées au van
    const { width, height, depth } = getAdaptiveFurnitureSize(element.type, vanType);

    // Trouver une position disponible sans collision
    const { x: startX, y: startY } = findAvailablePosition(
      width,
      height,
      objects,
      vanType
    );

    addObject({
      id: uuidv4(),
      name: element.name,
      type: element.type || 'custom',
      x: startX,
      y: startY,
      z: 0,  // ✅ Position au sol
      width,
      height,
      depth,
      color: element.color,
    });

    notify.success(`Élément "${element.name}" ajouté`);
    setSelectedElement(null);
  };

  return (
    <div className="van-planner-layout-new">
      <div className="layout-wrapper">
        <div className="layout-grid">
          {/* ===== COLONNE GAUCHE : WORKSPACE VAN ===== */}
          <section className="workspace-left">
            <div className="workspace-header-simple">
              <h2 className="section-title">Espace travail Van</h2>
            </div>

            {/* Van Selector + Dimension GRID (Layout conforme au schéma V3) */}
            <div className="van-controls-grid">
              <div className="van-controls-left">
                <div className="van-selection-box">
                  <span className="control-label">Véhicule</span>
                  <VanModalSelector
                    selectedVan={
                      vanType
                        ? VAN_TYPES.find((v) => v.vanType === vanType)?.displayName || vanType
                        : undefined
                    }
                    onSelect={(vanType) => setVanType(vanType)}
                  />
                </div>

                {vanType && (
                  <div className="van-dimension-box">
                    <span className="control-label">Dimension van</span>
                    <span className="dimension-value-text">
                      {VAN_TYPES.find((v) => v.vanType === vanType)?.length} x{' '}
                      {VAN_TYPES.find((v) => v.vanType === vanType)?.width}
                    </span>
                  </div>
                )}
              </div>

              {vanType && (
                <div className="van-controls-right-card">
                  <ViewModeToggle />
                </div>
              )}
            </div>

            {/* ✨ Canvas : Affichage conditionnel 2D ou 3D */}
            <div className="canvas-container">
              {vanType ? (
                viewMode === '2D' ? (
                  <VanCanvas2D
                    onSelectObject={(id) => useStore.setState({ selectedObjectId: id })}
                    onEdit={(id) => setEditingFurnitureId(id)}
                    selectedObjectId={selectedObjectId}
                  />
                ) : (
                  <VanCanvas3D
                    onEdit={(id) => setEditingFurnitureId(id)}
                  />
                )
              ) : (
                <div className="canvas-empty">
                  <div className="empty-icon">🚐</div>
                  <p>Sélectionnez un van pour commencer</p>
                </div>
              )}
            </div>

            {/* === LISTE PLANS SAUVEGARDÉS - SOUS LE CANVAS === */}
            <div className="plans-container-bottom">
              <h3 className="plans-title">
                Liste de plan sauvegardés
              </h3>

              {plans.length > 0 ? (
                <div className="plans-list-selector">
                  <select
                    value={selectedPlanId || ''}
                    onChange={(e) => setSelectedPlanId(Number(e.target.value))}
                    className="plan-selector"
                  >
                    <option value="">-- Sélectionner un plan --</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {plan.planVans?.[0]?.van?.vanType || 'Sans van'}
                      </option>
                    ))}
                  </select>

                  <Button
                    variant="gray"
                    size="small"
                    onClick={handleRenamePlan}
                    disabled={!selectedPlanId}
                    className="rename-btn"
                  >
                    Renommer
                  </Button>
                </div>
              ) : (
                <p className="no-plans-message">Aucun plan sauvegardé pour le moment.</p>
              )}

              {/* ACTION BUTTONS */}
              <div className="plans-actions">
                <Button
                  variant="blue"
                  size="small"
                  onClick={handleLoadPlan}
                  disabled={!selectedPlanId}
                >
                  Charger
                </Button>
                <Button
                  variant="blue"
                  size="small"
                  onClick={handleSavePlan}
                  disabled={!vanType || objects.length === 0}
                >
                  Sauvegarder
                </Button>
                <Button
                  variant="gray"
                  size="small"
                  onClick={handleDeletePlan}
                  disabled={!selectedPlanId}
                >
                  Supprimer
                </Button>
                <Button
                  variant="gray"
                  size="small"
                  onClick={handleUpdatePlan}
                  disabled={!selectedPlanId || objects.length === 0}
                >
                  Mettre à jour
                </Button>
              </div>
            </div>
          </section>

          {/* ===== COLONNE DROITE : SIDEBAR ===== */}
          <aside className="sidebar-right">

            {/* === PROMPT IA === */}
            <section className="prompt-section">
              <h2 className="section-title">
                Prompt IA <span className="subtitle-inline">Décrivez votre aménagement idéal:</span>
              </h2>

              {isPro ? (
                <>
                  <div className="prompt-row">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ex: je veux un lit transversal à l'arrière, une kitchenette compacte côté droit..."
                      className="prompt-textarea prompt-textarea-inline"
                      rows={4}
                      disabled={aiLoading}
                    />
                    <div className="action-buttons-inline">
                      <Button
                        variant="gray"
                        onClick={handleOptimizePlan}
                        disabled={aiLoading || plans.length === 0 || !isPro2Plus}
                        title={!isPro2Plus
                          ? "Fonctionnalité réservée aux comptes PRO2 et PRO3"
                          : "Optimiser ce plan avec l'IA"
                        }
                      >
                        {!isPro2Plus && '🔒 '}Optimiser
                      </Button>
                      <Button
                        variant="gray"
                        onClick={handleGenerateLayout}
                        disabled={aiLoading || !vanType || !prompt.trim()}
                      >
                        {aiLoading ? '⏳ Génération...' : 'Générer layout'}
                      </Button>
                    </div>
                  </div>

                  <div className="prompt-options-line">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={hasCouchage}
                        onChange={(e) => setHasCouchage(e.target.checked)}
                        disabled={aiLoading}
                      />
                      Couchage
                      {hasCouchage && (
                        <select
                          value={couchage}
                          onChange={(e) => setCouchage(e.target.value)}
                          className="selector-input"
                          disabled={aiLoading}
                          style={{ marginLeft: '8px' }}
                        >
                          <option value="1">1 pers</option>
                          <option value="2">2 pers</option>
                        </select>
                      )}
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={hasCuisine}
                        onChange={(e) => setHasCuisine(e.target.checked)}
                        disabled={aiLoading}
                      />
                      Cuisine
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={hasRangements}
                        onChange={(e) => setHasRangements(e.target.checked)}
                        disabled={aiLoading}
                      />
                      Rangements
                    </label>
                  </div>

                  {suggestion && (
                    <div className="ai-suggestion">
                      <h4 className="suggestion-title">💡 Suggestion IA</h4>
                      <p className="suggestion-explanation">{suggestion.explanation}</p>

                      {suggestion.alternatives && suggestion.alternatives.length > 0 && (
                        <div className="suggestion-alternatives">
                          <strong>Alternatives :</strong>
                          <ul>
                            {suggestion.alternatives.map((alt, i) => (
                              <li key={i}>{alt}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {suggestion.improvements && suggestion.improvements.length > 0 && (
                        <div className="suggestion-improvements">
                          <strong>Améliorations :</strong>
                          <ul>
                            {suggestion.improvements.map((imp, i) => (
                              <li key={i}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button
                        variant="green"
                        onClick={handleApplySuggestion}
                        className="apply-suggestion-btn"
                      >
                        ✅ Appliquer cette suggestion
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="pro-notice">
                  <p>ℹ️ Les fonctionnalités IA sont disponibles avec un abonnement PRO.</p>
                </div>
              )}
            </section>

            {/* === PALETTE D'OBJETS === */}
            <section className="prompt-section">
              <h3 className="subsection-title">Palette d'objets</h3>

              <div className="predefined-elements-grid">
                {predefinedElements.map((el) => (
                  <div
                    key={el.name}
                    className={`element-card ${selectedElement === el.name ? 'selected' : ''}`}
                    onClick={() => {
                      if (!vanType) {
                        notify.error("Sélectionnez d'abord un van");
                        return;
                      }
                      handleAddPredefinedElement(el.name);
                    }}
                  >
                    <div className="element-icon">{el.icon}</div>
                    <div className="element-name">{el.name}</div>
                    <div className="element-dimensions">{el.width}×{el.height}</div>
                  </div>
                ))}
              </div>

              {/* Formulaire d'ajout d'objet personnalisé - Compact */}
              <div className="custom-element-section">
                <h4 className="custom-element-title">Ajouter un objet personnalisé</h4>
                <div className="custom-element-form-inline">
                  <input
                    type="text"
                    value={elementName}
                    onChange={(e) => setElementName(e.target.value)}
                    placeholder="Nom"
                    className="form-input compact"
                  />
                  <input
                    type="text"
                    value={elementDimensions}
                    onChange={(e) => setElementDimensions(e.target.value)}
                    placeholder="500x300"
                    className="form-input compact"
                  />
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="form-select compact"
                    style={{ backgroundColor: selectedColor, color: '#fff' }}
                  >
                    {colors.map((color) => (
                      <option key={color} value={color} style={{ backgroundColor: color, color: '#fff' }}>
                        {color} ({getColorName(color)})
                      </option>
                    ))}
                  </select>
                  <Button variant="blue" onClick={handleAddCustomElement}>
                    Ajouter
                  </Button>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* Modale d'édition */}
      <FurnitureEditModal
        isOpen={!!editingFurnitureId}
        furniture={objects.find(o => o.id === editingFurnitureId) || null}
        onClose={() => setEditingFurnitureId(null)}
        onSave={(id, updates) => {
          useStore.getState().updateObject(id, updates);
        }}
      />
    </div>
  );
};

export default VanPlannerLayout;
