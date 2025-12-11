import React, { useState } from 'react';
import { apiFetch } from '../api/api';
import { useStore } from '../store/store';
import './login.css';
import { notify } from '@/utils/notify';
import { extractErrorMessage } from '@/utils/errorMessage';

interface Props {
  onLogin: () => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
	const { resetState, setUserName, setUserEmail, setSubscription, setLoggedIn } = useStore();
	const [isRegister, setIsRegister] = useState(false);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [checking, setChecking] = useState(false);

	// 🔹 Check username/email availability
	const checkAvailability = async (type: 'username' | 'email', value: string) => {
		const trimmedValue = value.trim();
		if (!trimmedValue) return;

		const normalizedValue = trimmedValue.toLowerCase();
		const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
		const url =
		  type === 'username'
			? `${baseUrl}/auth/check-username/${encodeURIComponent(normalizedValue)}`
			: `${baseUrl}/auth/check-email/${encodeURIComponent(normalizedValue)}`;

		try {
			const res = await fetch(url);
			const data = await res.json();
			if (!data.available) {
				notify.error(
					type === 'username'
					? '⚠️ Ce nom d’utilisateur est déjà pris.'
					: '⚠️ Cet email est déjà utilisé.'
				);
			}
		} catch (err) {
			console.error('Erreur lors de la vérification:', err);
		}
	};

	const handleNameBlur = () => {
		if (isRegister && name.trim()) checkAvailability('username', name);
	};

	const handleEmailBlur = () => {
		if (isRegister && email.trim()) checkAvailability('email', email);
	};

  // 🔹 Submit handler
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ prevent GET

    const path = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister
      ? { name: name.trim(), email: email.trim().toLowerCase(), password: password.trim() }
      : { email: email.trim().toLowerCase(), password: password.trim() };

    try {
      setChecking(true);

      // 🔹 Pass method and body correctly
      const data = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

if (!isRegister) {
	// ✅ Utiliser les hooks Zustand dans un composant React


	localStorage.setItem('token', data.access_token);

	const userData = {
	  name: data.user.name || '',
	  email: data.user.email || '',
	  subscription: data.user.subscription || 'FREE',
	};

	localStorage.setItem('user', JSON.stringify(userData));

	setUserName(userData.name);
	setUserEmail(userData.email);
	setSubscription(userData.subscription);
	setLoggedIn(true);

    notify.success('Connexion réussie');
    onLogin();
}


	  else {
        notify.success('Compte créé — vous pouvez vous connecter');
        setIsRegister(false);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      notify.error(extractErrorMessage(err));
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">{isRegister ? 'Créer un compte' : 'Connexion'}</h2>

      <form className="auth-form" onSubmit={submit}>
        {isRegister && (
          <input
            className="auth-input"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={handleNameBlur}
            required
          />
        )}

        <input
          className="auth-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={handleEmailBlur}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="auth-btn" disabled={checking}>
          {checking
            ? '⏳ Veuillez patienter...'
            : isRegister
            ? 'Créer un compte'
            : 'Se connecter'}
        </button>
      </form>

      <p className="auth-switch">
        {isRegister ? 'Déjà inscrit ?' : 'Pas encore de compte ? '}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          className="link-btn"
        >
          {isRegister ? 'Se connecter' : 'Créer un compte'}
        </button>
      </p>
    </div>
  );
};

export default Login;
