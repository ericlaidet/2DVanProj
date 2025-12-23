// ----------------------------------------------------------------------------
// 3. PROFILE PAGE - User Management (ProfilePage.tsx)
// ----------------------------------------------------------------------------
import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/api/api';
import { notify } from '@/utils/notify';
import { useStore } from '@/store/store';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';
import { extractErrorMessage } from '@/utils/errorMessage';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // État depuis Zustand
  const userName = useStore(s => s.userName);
  const userEmail = useStore(s => s.userEmail);
  const subscription = useStore(s => s.subscription);
  const setUserName = useStore(s => s.setUserName);
  const setUserEmail = useStore(s => s.setUserEmail);

  // États locaux
  const [name, setName] = useState(userName || '');
  const [email, setEmail] = useState(userEmail || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // États de validation
  const [nameAvailable, setNameAvailable] = useState<boolean | null>(null);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingName, setCheckingName] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Synchroniser avec le store au montage
  useEffect(() => {
    setName(userName || '');
    setEmail(userEmail || '');
  }, [userName, userEmail]);

  // ✅ Vérifier et sauvegarder le nom
  const handleNameBlur = async () => {
    const trimmedValue = name.trim();

    if (!trimmedValue || trimmedValue === userName) {
      setNameAvailable(null);
      return;
    }

    setCheckingName(true);
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    try {
      // Vérifier disponibilité
      const res = await fetch(
        `${baseUrl}/auth/check-username/${encodeURIComponent(trimmedValue.toLowerCase())}`
      );
      const data = await res.json();
      setNameAvailable(data.available);

      if (!data.available) {
        notify.error('⚠️ Ce nom d\'utilisateur est déjà pris.');
        setCheckingName(false);
        return;
      }

      // Si disponible, sauvegarder
      const updated = await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ name: trimmedValue })
      });

      setUserName(updated.name);
      localStorage.setItem('user', JSON.stringify({
        name: updated.name,
        email: userEmail,
        subscription
      }));
      notify.success('✅ Nom d\'utilisateur mis à jour');

    } catch (err) {
      notify.error(extractErrorMessage(err));
    } finally {
      setCheckingName(false);
    }
  };

  // ✅ Vérifier et sauvegarder l'email
  const handleEmailBlur = async () => {
    const trimmedValue = email.trim().toLowerCase();

    if (!trimmedValue || trimmedValue === userEmail?.toLowerCase()) {
      setEmailAvailable(null);
      return;
    }

    setCheckingEmail(true);
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    try {
      // Vérifier disponibilité
      const res = await fetch(
        `${baseUrl}/auth/check-email/${encodeURIComponent(trimmedValue)}`
      );
      const data = await res.json();
      setEmailAvailable(data.available);

      if (!data.available) {
        notify.error('⚠️ Cet email est déjà utilisé.');
        setCheckingEmail(false);
        return;
      }

      // Si disponible, sauvegarder
      const updated = await apiFetch('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({ email: trimmedValue })
      });

      setUserEmail(updated.email);
      localStorage.setItem('user', JSON.stringify({
        name: userName,
        email: updated.email,
        subscription
      }));
      notify.success('✅ Email mis à jour');

    } catch (err) {
      notify.error(extractErrorMessage(err));
    } finally {
      setCheckingEmail(false);
    }
  };

  // ✅ Changement de mot de passe
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      notify.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setLoading(true);

    try {
      await apiFetch('/users/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword })
      });

      notify.success('✅ Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      notify.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <button className="back-btn" onClick={() => navigate('/')}>
        ← Retour
      </button>

      <h2>Mon Profil</h2>

      {/* Account Info */}
      <section className="profile-section">
        <h3>Informations du compte</h3>

        <div className="form-group">
          <label htmlFor="name">
            Nom d'utilisateur
            {checkingName && <span className="checking"> (vérification...)</span>}
            {nameAvailable === true && <span className="available"> ✓</span>}
            {nameAvailable === false && <span className="unavailable"> ✗</span>}
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            required
          />
          <small>Sauvegarde automatique après validation</small>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Adresse e-mail
            {checkingEmail && <span className="checking"> (vérification...)</span>}
            {emailAvailable === true && <span className="available"> ✓</span>}
            {emailAvailable === false && <span className="unavailable"> ✗</span>}
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            required
          />
          <small>Sauvegarde automatique après validation</small>
        </div>
      </section>

      {/* Subscription Info */}
      <section className="profile-section">
        <h3>Abonnement</h3>
        <div className="subscription-info">
          <div className="info-row">
            <span className="info-label">Type d'abonnement:</span>
            <span className="info-value" data-subscription={subscription}>
              {subscription}
            </span>
          </div>
          <button
            className="change-plan-btn"
            onClick={() => navigate('/plans')}
          >
            📋 Changer de plan
          </button>
        </div>
      </section>

      {/* Change Password */}
      <section className="profile-section">
        <h3>Changer le mot de passe</h3>
        <form onSubmit={handleChangePassword}>
          <div className="form-group">
            <label htmlFor="currentPassword">Mot de passe actuel</label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Nouveau mot de passe</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
            <small>Minimum 8 caractères</small>
          </div>

          <button type="submit" disabled={loading} className="save-btn">
            {loading ? 'Modification...' : 'Changer le mot de passe'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
