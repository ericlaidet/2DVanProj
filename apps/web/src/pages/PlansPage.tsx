// ----------------------------------------------------------------------------
// 2. PLANS PAGE - Subscription Management (PlansPage.tsx)
// ----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import './PlansPage.css';
import { useNavigate } from "react-router-dom";
import { useStore } from '@/store/store';

interface PlanTier {
  type: 'FREE' | 'PRO1' | 'PRO2' | 'PRO3';
  name: string;
  price: number;
  features: {
    vans: number;
    aiGenerations: number | string;
    optimized: boolean;
    duration: string;
  };
}

const PlansPage: React.FC = () => {
  const currentSubscription = localStorage.getItem('subscription') || 'FREE';

  // ✅ Récupérer la devise depuis le store Zustand
  const storeCurrency = useStore(s => s.settings.currency);
  const [selectedCurrency, setSelectedCurrency] = useState<'EUR' | 'USD'>(storeCurrency);

  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ Synchroniser avec le store au changement
  useEffect(() => {
    setSelectedCurrency(storeCurrency);
  }, [storeCurrency]);

  const currencySymbol = selectedCurrency === 'EUR' ? '€' : '$';
  const exchangeRate = selectedCurrency === 'EUR' ? 1 : 1.1;

  const planTiers: PlanTier[] = [
    {
      type: 'FREE',
      name: 'Gratuit',
      price: 0,
      features: {
        vans: 1,
        aiGenerations: 0,
        optimized: false,
        duration: '1 semaine'
      }
    },
    {
      type: 'PRO1',
      name: 'Pro Débutant',
      price: 9.99,
      features: {
        vans: 3,
        aiGenerations: 3,
        optimized: false,
        duration: '1 mois'
      }
    },
    {
      type: 'PRO2',
      name: 'Pro Avancé',
      price: 24.99,
      features: {
        vans: 6,
        aiGenerations: 20,
        optimized: true,
        duration: '6 mois'
      }
    },
    {
      type: 'PRO3',
      name: 'Pro Expert',
      price: 49.99,
      features: {
        vans: 10,
        aiGenerations: 'Illimité',
        optimized: true,
        duration: '1 an'
      }
    }
  ];

  const handleUpgrade = (planType: string) => {
    setSelectedPlan(planType);
    setShowPayment(true);
  };

  const handlePayment = (method: 'stripe' | 'paypal') => {
    console.log(`Processing ${method} payment for ${selectedPlan}`);
    // TODO: Integrate with Stripe/PayPal
    alert(`Paiement ${method} pour ${selectedPlan} - À implémenter`);
  };

  return (
    <div className="plans-page">
      {/* Bouton Retour toujours visible */}
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Retour
      </button>

      <h2>Choisissez votre abonnement</h2>

      <div className="currency-selector">
        <label>Devise:</label>
        <button
          className={selectedCurrency === 'EUR' ? 'active' : ''}
          onClick={() => setSelectedCurrency('EUR')}
        >
          € EUR
        </button>
        <button
          className={selectedCurrency === 'USD' ? 'active' : ''}
          onClick={() => setSelectedCurrency('USD')}
        >
          $ USD
        </button>
      </div>

      <div className="plans-grid">
        {planTiers.map((plan) => (
          <div
            key={plan.type}
            className={`plan-card ${plan.type === currentSubscription ? 'current' : ''}`}
            data-plan={plan.type}
          >
            <div className="plan-header">
              <h3>{plan.name}</h3>
              {plan.type === currentSubscription && (
                <span className="current-badge">Actuel</span>
              )}
            </div>

            <div className="plan-price">
              <span className="price-amount">
                {(plan.price * exchangeRate).toFixed(2)} {currencySymbol}
              </span>
              <span className="price-period">/ {plan.features.duration}</span>
            </div>

            <ul className="plan-features">
              <li>
                <strong>{plan.features.vans}</strong> van{plan.features.vans > 1 ? 's' : ''}
              </li>
              <li>
                <strong>{plan.features.aiGenerations}</strong> génération{typeof plan.features.aiGenerations === 'number' && plan.features.aiGenerations > 1 ? 's' : ''} IA
              </li>
              {plan.features.optimized && (
                <li>✨ Optimisation IA</li>
              )}
              <li>📅 Valide {plan.features.duration}</li>
            </ul>

            {plan.type !== currentSubscription && (
              <button
                className="upgrade-btn"
                onClick={() => handleUpgrade(plan.type)}
              >
                {plan.price === 0 ? 'Passer au gratuit' : 'Mettre à niveau'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="payment-modal-overlay" onClick={() => setShowPayment(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Choisissez votre méthode de paiement</h3>
            <p>Abonnement: <strong>{selectedPlan}</strong></p>

            <div className="payment-methods">
              <button
                className="payment-btn stripe"
                onClick={() => handlePayment('stripe')}
              >
                <span className="payment-icon">💳</span>
                Payer avec Stripe
              </button>

              <button
                className="payment-btn paypal"
                onClick={() => handlePayment('paypal')}
              >
                <span className="payment-icon">🅿️</span>
                Payer avec PayPal
              </button>
            </div>

            <button
              className="cancel-btn"
              onClick={() => setShowPayment(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansPage;
