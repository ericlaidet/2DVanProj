// apps/web/src/hooks/useSettings.ts
import { useStore } from '@/store/store';

export const useSettings = () => {
  const settings = useStore(s => s.settings);

  // ✅ Traductions
  const translations = {
    fr: {
      // Navigation
      home: 'Accueil',
      plans: 'Plans',
      profile: 'Profil',
      settings: 'Paramètres',
      logout: 'Déconnexion',
      
      // Actions communes
      save: 'Sauvegarder',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      confirm: 'Confirmer',
      back: 'Retour',
      
      // Van planner
      selectVan: 'Sélectionner un van',
      addObject: 'Ajouter un objet',
      removeObject: 'Supprimer',
      
      // Subscription
      free: 'Gratuit',
      pro: 'Pro',
      upgrade: 'Mettre à niveau',
    },
    en: {
      // Navigation
      home: 'Home',
      plans: 'Plans',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      
      // Actions communes
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      confirm: 'Confirm',
      back: 'Back',
      
      // Van planner
      selectVan: 'Select a van',
      addObject: 'Add object',
      removeObject: 'Remove',
      
      // Subscription
      free: 'Free',
      pro: 'Pro',
      upgrade: 'Upgrade',
    }
  };

  // ✅ Fonction pour formater les prix
  const formatPrice = (amount: number): string => {
    if (settings.currency === 'EUR') {
      return `${amount.toFixed(2)} €`;
    } else {
      const usdAmount = amount * 1.1; // Taux de change approximatif
      return `$${usdAmount.toFixed(2)}`;
    }
  };

  // ✅ Traductions accessibles via t()
  const t = translations[settings.language];

  return {
    settings,
    t, // Traductions
    formatPrice, // Formatage des prix
    isDarkMode: settings.darkMode,
    language: settings.language,
    currency: settings.currency,
  };
};
