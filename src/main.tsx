import React from 'react';
import ReactDOM from 'react-dom/client';
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './context/auth-context.tsx';
import { ClientProvider } from './context/client-context.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <ToastProvider />
      <AuthProvider>
        <ClientProvider>
          <App />
        </ClientProvider>
      </AuthProvider>
    </HeroUIProvider>
  </React.StrictMode>,
);