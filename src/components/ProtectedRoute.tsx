import React from "react";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return null;

  if (!user) return <Redirect to="/login" />;

  return <>{children}</>;
};
