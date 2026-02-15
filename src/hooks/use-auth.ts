import { useEffect, useState, useCallback } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { signIn, signOut } from "../services/auth.service";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [credentialError, setCredentialError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      await signIn(email, password);
      return true;
    } catch {
      setCredentialError("Credenciales inválidas. Por favor, intenta de nuevo.");
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut();
  }, []);

  return {
    session,
    user,
    isAuthenticated: !!session,
    isLoading,
    login,
    logout,
    credentialError
  };
}
