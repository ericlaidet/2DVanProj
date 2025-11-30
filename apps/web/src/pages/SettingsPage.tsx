// ----------------------------------------------------------------------------
// 4. SETTINGS PAGE - Preferences & Guide (SettingsPage.tsx)
// ----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import './SettingsPage.css';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '@/api/api';
import { notify } from '@/utils/notify';
import { useStore } from '@/store/store';

interface Settings {
  darkMode: boolean;
  language: 'fr' | 'en';
  currency: 'EUR' | 'USD';
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // ✅ Utiliser le store Zustand au lieu de l'état local
  const storeSettings = useStore(s => s.settings);
  const setStoreSettings = useStore(s => s.setSettings);
  
  const [settings, setSettings] = useState<Settings>(storeSettings);
  const [loading, setLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(false);

  // ✅ Charger les paramètres depuis le backend au montage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await apiFetch('/users/settings');
        const loadedSettings = {
          darkMode: data.darkMode || false,
          language: data.language || 'fr',
          currency: data.currency || 'EUR'
        };
        setSettings(loadedSettings);
        setStoreSettings(loadedSettings); // ✅ Mettre à jour le store aussi
      } catch (err) {
        console.error('Erreur chargement paramètres:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [setStoreSettings]);

  // ✅ Appliquer le mode sombre
  useEffect(() => {
    if (settings.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [settings.darkMode]);

  // ✅ Sauvegarder automatiquement dans le backend
  useEffect(() => {
    if (loading) return; // Ne pas sauvegarder pendant le chargement initial

    const saveSettings = async () => {
      try {
        await apiFetch('/users/settings', {
          method: 'PATCH',
          body: JSON.stringify(settings)
        });
        console.log('✅ Paramètres sauvegardés');
      } catch (err) {
        console.error('Erreur sauvegarde paramètres:', err);
        notify.error('Erreur lors de la sauvegarde des paramètres');
      }
    };

    // Debounce de 500ms pour éviter trop de requêtes
    const timer = setTimeout(saveSettings, 500);
    return () => clearTimeout(timer);
  }, [settings, loading]);

  const translations = {
    fr: {
      title: 'Paramètres',
      appearance: 'Apparence',
      darkMode: 'Mode sombre',
      language: 'Langue',
      currency: 'Devise',
      guide: 'Guide d\'utilisation',
      save: 'Enregistrer'
    },
    en: {
      title: 'Settings',
      appearance: 'Appearance',
      darkMode: 'Dark Mode',
      language: 'Language',
      currency: 'Currency',
      guide: 'User Guide',
      save: 'Save'
    }
  };

  const t = translations[settings.language];

  if (loading) {
    return <div className="settings-page"><p>Chargement...</p></div>;
  }

  return (
    <div className="settings-page">
      {/* Bouton Retour toujours visible */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Retour
      </button>

      <h2>{t.title}</h2>

      {/* Appearance Settings */}
      <section className="settings-section">
        <h3>{t.appearance}</h3>
        
        <div className="setting-item">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => setSettings({ ...settings, darkMode: e.target.checked })}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-text">{t.darkMode}</span>
          </label>
        </div>
      </section>

      {/* Language Settings */}
      <section className="settings-section">
        <h3>{t.language}</h3>
        
        <div className="setting-item">
          <select
            name="language"
            value={settings.language}
            onChange={(e) => setSettings({ ...settings, language: e.target.value as 'fr' | 'en' })}
          >
            <option value="fr">Français</option>
            <option value="en">English</option>
          </select>
        </div>
      </section>

      {/* Currency Settings */}
      <section className="settings-section">
        <h3>{t.currency}</h3>
        
        <div className="setting-item currency-buttons">
          <button
            className={settings.currency === 'EUR' ? 'active' : ''}
            onClick={() => setSettings({ ...settings, currency: 'EUR' })}
          >
            € Euro
          </button>
          <button
            className={settings.currency === 'USD' ? 'active' : ''}
            onClick={() => setSettings({ ...settings, currency: 'USD' })}
          >
            $ Dollar
          </button>
        </div>
      </section>

      {/* User Guide */}
      <section className="settings-section">
        <h3>{t.guide}</h3>
        <button 
          className="guide-btn"
          onClick={() => setShowGuide(!showGuide)}
        >
          {showGuide ? 'Masquer le guide' : 'Afficher le guide'}
        </button>

        {showGuide && (
          <div className="guide-content">
            <h4>Comment utiliser l'interface</h4>
            
            <div className="guide-item">
              <h5>1️⃣ Sélectionner un van</h5>
              <p>Cliquez sur le bouton "Sélectionner un van" dans l'espace de travail. Choisissez parmi 21 types de vans avec différentes dimensions.</p>
            </div>

            <div className="guide-item">
              <h5>2️⃣ Ajouter des objets</h5>
              <p>Utilisez la palette d'objets pour créer des meubles:</p>
              <ul>
                <li>Entrez un nom (ex: Table)</li>
                <li>Définissez les dimensions en mm (ex: 500x300)</li>
                <li>Choisissez une couleur</li>
                <li>Cliquez sur "Ajouter"</li>
              </ul>
            </div>

            <div className="guide-item">
              <h5>3️⃣ Déplacer les objets</h5>
              <p>Cliquez et glissez les objets sur le plan. La détection de collision empêche les chevauchements.</p>
            </div>

            <div className="guide-item">
              <h5>4️⃣ Utiliser l'IA (PRO)</h5>
              <p>Décrivez votre aménagement idéal et cliquez sur "Générer layout". L'IA créera automatiquement un plan optimisé.</p>
            </div>

            <div className="guide-item">
              <h5>5️⃣ Sauvegarder votre plan</h5>
              <p>Cliquez sur "💾 Sauvegarder", donnez un nom à votre plan, et il sera enregistré dans votre compte.</p>
            </div>

            <div className="guide-item">
              <h5>6️⃣ Gérer vos plans</h5>
              <p>
                <strong>📂 Charger:</strong> Ouvrir un plan existant<br/>
                <strong>✏️ Mettre à jour:</strong> Sauvegarder les modifications<br/>
                <strong>✏️ Renommer:</strong> Changer le nom du plan<br/>
                <strong>🗑️ Supprimer:</strong> Effacer définitivement
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default SettingsPage;
