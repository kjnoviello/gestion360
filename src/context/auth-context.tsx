import React, { createContext, useEffect, useState } from "react";
import { addToast } from "@heroui/react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // For this example, we're using hardcoded credentials
    // In a real app, you would use a proper authentication service
    if (email === "kjnoviello@gmail.com" && password === "k01164186") {
      localStorage.setItem("isAuthenticated", "true");
      setIsAuthenticated(true);
      addToast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido a tu aplicación de gestión de clientes",
        color: "success",
      });
      return true;
    } else {
      addToast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
        color: "danger",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    addToast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente",
      color: "primary",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};