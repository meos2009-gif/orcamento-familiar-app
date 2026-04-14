import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Carregar user atual ao iniciar
    supabase.auth.getUser().then(({ data }) => {
      console.log("USER ATUAL:", data.user);
      setUser(data.user);
    });

    // Listener para login/logout
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("AUTH STATE CHANGE:", session?.user);
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
