import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/store/store";
import Login from "@/pages/Login";
import VanPlannerLayout from "@/components/layout/VanPlannerLayout";
import PlansPage from "@/pages/PlansPage";
import ProfilePage from "@/pages/ProfilePage";
import SettingsPage from "@/pages/SettingsPage";

const App = () => {
  const { loggedIn, loading, checkAuth } = useAuth();
  const applyTheme = useStore(s => s.applyTheme);
  const settings = useStore(s => s.settings);

  // ✅ Appliquer le thème à chaque changement de settings OU de loggedIn
  useEffect(() => {
    applyTheme();
    console.log('🎨 [App] Thème appliqué:', settings, 'loggedIn:', loggedIn);
  }, [settings, applyTheme, loggedIn]); // ✅ Ajout de loggedIn

  if (loading) return <div>Chargement...</div>;

  // ✅ Fonction à passer au Login
  const handleLogin = () => {
    checkAuth(); // Recharge l'état d'authentification
  };

  return (
    <BrowserRouter>
      {!loggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Routes>
          <Route path="/" element={<VanPlannerLayout />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default App;
