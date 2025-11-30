import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ModalProvider } from '@/components/ui/ModalProvider';
import './styles/index.css';
import "@/components/ui/Modal.css"; // Ensure global modal styles are loaded
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
		<ModalProvider>
			<App />
			<Toaster />
		</ModalProvider>
  </React.StrictMode>
);
