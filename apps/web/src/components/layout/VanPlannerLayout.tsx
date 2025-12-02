// apps/web/src/components/layout/VanPlannerLayout.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/store';
import { useAuth } from '@/hooks/useAuth';
import { useAI } from '@/hooks/useAI';
import { usePlanManager } from '@/hooks/usePlans';
import { VanCanvas } from '@/components/van/VanCanvas';
import { VanCanvas3D } from '@/components/van/VanCanvas3D'; // ✨ NOUVEAU
import { ViewModeToggle } from '@/components/van/ViewModeToggle'; // ✨ NOUVEAU
import Button from '@/components/buttons/Button';
import { VAN_TYPES } from '@/constants/vans';
import VanModalSelector from '@/components/van/VanModalSelector';
import { v4 as uuidv4 } from 'uuid';
import './VanPlannerLayout.css';
import { notify } from '@/utils/notify';
import Header from "@/components/layout/Header";

const VanPlannerLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const vanType = useStore((s) => s.vanType);
  const setVanType = useStore((s) => s.setVanType);
  const addObject = useStore((s) => s.addObject);
  const objects = useStore((s) => s.objects);
  const viewMode = useStore((s) => s.viewMode); // ✨ NOUVEAU

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
  const colors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const predefinedElements = [
    { name: 'Table', width: 800, height: 600, icon: '🪑', color: '#ef4444' },
    { name: 'Cuisine', width: 1000, height: 600, icon: '🍳', color: '#10b981' },
    { name: 'Douche', width: 800, height: 800, icon: '🚿', color: '#8b5cf6' },
    { name: 'Bureau', width: 1200, height: 600, icon: '💼', color: '#3b82f6' },
    { name: 'Lit', width: 2000, height: 1400, icon: '🛏️', color: '#3b82f6' },
    { name: 'Rangement', width: 600, height: 400, icon: '📦', color: '#f59e0b' },
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

    console.log('🤖 Generating layout...', { vanType, prompt });
    await generateLayout({
      vanType,
      userDescription: prompt,
      preferences: {
        hasBed: hasCouchage,
        sleepingCapacity: hasCouchage ? Number(couchage) : 0,
        hasCooking: hasCuisine,
        hasStorage: hasRangements,
        style: style === 'minin' ? 'minimalist' : style === 'moderne' ? 'modern' : 'rustic',
      },
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
    useStore.setState({
      objects: suggestion.layout.map((item) => ({
        id: `ai-${Date.now()}-${Math.random()}`,
        ...item,
      })),
    });
    notify.success("Suggestion appliquée !");
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
      await fetch(`/api/plans/${selectedPlanId}`, { method: 'DELETE' });
      removePlan(selectedPlanId);
      useStore.setState({ objects: [], vanType: '' });
      setSelectedPlanId(null);
      notify.success(`Plan "${plan.name}" supprimé`);
    } catch (err) {
      notify.error('Erreur lors de la suppression');
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

    const padding = 100;
    const startX = Math.min(padding, van.length - width - padding);
    const startY = Math.min(padding, van.width - height - padding);

    addObject({
      id: uuidv4(),
      name: elementName.trim(),
      x: startX,
      y: startY,
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

    const padding = 100;
    const startX = Math.min(padding, van.length - element.width - padding);
    const startY = Math.min(padding, van.width - element.height - padding);

    addObject({
      id: uuidv4(),
      name: element.name,
      x: startX,
      y: startY,
      width: element.width,
      height: element.height,
      color: element.color,
    });

    notify.success(`Élément "${element.name}" ajouté`);
    setSelectedElement(null);
  };

  return (
    <div className="van-planner-layout-new">
      <Header />

      <div className="layout-wrapper">
        <div className="layout-grid">
          {/* ===== COLONNE GAUCHE : WORKSPACE VAN ===== */}
          <section className="workspace-left">
            {/* ✨ NOUVEAU : En-tête avec toggle 2D/3D */}
            <div className="workspace-header-with-toggle">
              <h2 className="section-title">Espace travail Van</h2>
              {vanType && <ViewModeToggle />}
            </div>

            {/* Van Selector + Dimension */}
            <div className="van-controls">
              <div className="van-selector-container">
                <label className="selector-label-block">Sélectionner un van</label>
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
                <div className="dimension-info">
                  <span className="dimension-label">Dimension van</span>
                  <span className="dimension-value">
                    {VAN_TYPES.find((v) => v.vanType === vanType)?.length} x{' '}
                    {VAN_TYPES.find((v) => v.vanType === vanType)?.width}
                  </span>
                </div>
              )}
            </div>

            {/* ✨ Canvas : Affichage conditionnel 2D ou 3D */}
            <div className="canvas-container">
              {vanType ? (
                viewMode === '2D' ? (
                  <VanCanvas />
                ) : (
                  <VanCanvas3D />
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
                    variant="yellow"
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
                  onClick={handleLoadPlan}
                  disabled={!selectedPlanId}
                >
                  Charger
                </Button>
                <Button
                  variant="green"
                  onClick={handleSavePlan}
                  disabled={!vanType || objects.length === 0}
                >
                  Sauvegarder
                </Button>
                <Button
                  variant="red"
                  onClick={handleDeletePlan}
                  disabled={!selectedPlanId}
                >
                  Supprimer
                </Button>
                <Button
                  variant="yellow"
                  onClick={handleUpdatePlan}
                  disabled={!selectedPlanId || objects.length === 0}
                >
                  Sauvegarder
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

                    {hasCouchage && (
                      <label className="selector-label">
                        Personnes: <strong>{couchage}</strong>
                        <select
                          value={couchage}
                          onChange={(e) => setCouchage(e.target.value)}
                          className="selector-input"
                          disabled={aiLoading}
                        >
                          <option value="1">1 pers</option>
                          <option value="2">2 pers</option>
                        </select>
                      </label>
                    )}
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

              <div className="dimensions-row-inline">
                <label className="form-label">Dimensions</label>
                <input
                  type="text"
                  value={elementDimensions}
                  onChange={(e) => setElementDimensions(e.target.value)}
                  placeholder="500 x 300"
                  className="form-input short"
                />
              </div>

              <div className="color-section-block">
                <p className="color-title-label">Palettes couleurs</p>
                <div className="color-palette">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="color-swatch"
                      style={{
                        backgroundColor: color,
                        border: selectedColor === color ? '3px solid black' : '1px solid #ccc',
                      }}
                      title={`Sélectionner couleur ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="custom-element-row">
                <input
                  type="text"
                  value={elementName}
                  onChange={(e) => setElementName(e.target.value)}
                  placeholder="Nom personnalisé"
                  className="form-input"
                />

                <Button variant="blue" onClick={handleAddCustomElement}>
                  Ajouter
                </Button>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default VanPlannerLayout;
