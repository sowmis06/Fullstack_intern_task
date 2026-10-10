import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { fetchFavorites, addFavorite, removeFavorite } from "../services/favoriteService.js";
import { getErrorMessage } from "../services/api.js";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favoriteTemplates, setFavoriteTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the favorites whenever a user logs in, and clear them on logout.
  useEffect(() => {
    if (!user) {
      setFavoriteTemplates([]);
      return;
    }

    async function loadFavorites() {
      setLoading(true);
      try {
        const templates = await fetchFavorites();
        setFavoriteTemplates(templates);
        setError("");
      } catch (err) {
        setError(getErrorMessage(err));
      }
      setLoading(false);
    }

    loadFavorites();
  }, [user]);

  function isFavorite(templateId) {
    return favoriteTemplates.some((template) => template.id === templateId);
  }

  async function toggleFavorite(template) {
    if (!user) {
      navigate("/login");
      return;
    }

    setError("");
    try {
      if (isFavorite(template.id)) {
        await removeFavorite(template.id);
        setFavoriteTemplates((current) => current.filter((item) => item.id !== template.id));
      } else {
        await addFavorite(template.id);
        setFavoriteTemplates((current) => [template, ...current]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  return (
    <FavoritesContext.Provider value={{ favoriteTemplates, loading, error, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
