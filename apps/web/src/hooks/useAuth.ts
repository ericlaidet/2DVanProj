import { useEffect, useState, useCallback } from "react";
import { useStore } from "../store/store";
import { apiFetch } from "../api/api";

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const setLoggedIn = useStore(s => s.setLoggedIn);
  const setUserName = useStore(s => s.setUserName);
  const setUserEmail = useStore(s => s.setUserEmail);
  const setSubscription = useStore(s => s.setSubscription);
  const setSettings = useStore(s => s.setSettings);
  const applyTheme = useStore(s => s.applyTheme);
  const resetState = useStore(s => s.resetState);

  // ✅ Déplacer checkAuth en dehors du useEffect avec useCallback
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoggedIn(false);
      setLoading(false);
      return;
    }

    try {
      const profile = await apiFetch("/auth/profile");
      
      console.log('🔍 [useAuth] Profile received:', profile);
      
      // ✅ Ne mettre à jour que si on a une valeur NON VIDE
      if (profile.name && profile.name.trim()) {
        setUserName(profile.name);
        setUserEmail(profile.email || null);
        setSubscription(profile.subscription || "FREE");
        
        localStorage.setItem("user", JSON.stringify({
          name: profile.name,
          email: profile.email || '',
          subscription: profile.subscription || "FREE",
        }));
      } else {
        console.warn('⚠️ [useAuth] Backend ne renvoie pas profile.name, on garde les valeurs existantes');
        // On met juste à jour email et subscription si présents
        if (profile.email) setUserEmail(profile.email);
        if (profile.subscription) setSubscription(profile.subscription);
      }
      
      // ✅ NOUVEAU : Charger les settings utilisateur
      try {
        const userSettings = await apiFetch("/users/settings");
        console.log('🎨 [useAuth] Settings loaded:', userSettings);
        setSettings(userSettings);
        applyTheme(); // Appliquer le thème immédiatement
      } catch (settingsErr) {
        console.warn('⚠️ [useAuth] Failed to load settings, using defaults');
      }
      
      setLoggedIn(true);
    } catch (err) {
      console.warn("Auth failed", err);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      resetState();
    } finally {
      setLoading(false);
    }
  }, [setLoggedIn, setUserName, setUserEmail, setSubscription, setSettings, applyTheme, resetState]);

  // ✅ Appeler checkAuth au montage du composant
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    resetState();
    setLoggedIn(false);
  };

  // ✅ Retourner checkAuth pour qu'il soit accessible
  return { 
    loggedIn: useStore(s => s.loggedIn), 
    logout, 
    loading,
    checkAuth
  };
};
