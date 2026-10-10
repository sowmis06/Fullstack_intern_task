import { createContext, useContext, useEffect, useState } from "react";
import { fetchCurrentUser, loginUser } from "../services/authService.js";
import { getToken, saveToken, removeToken } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // True until we know whether a saved token is still valid.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          removeToken();
        }
      }
      setLoading(false);
    }

    restoreSession();
  }, []);

  async function login(email, password, rememberMe) {
    const data = await loginUser(email, password);
    saveToken(data.token, rememberMe);
    setUser(data.user);
  }

  function logout() {
    removeToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
