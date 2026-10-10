import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import CategorySidebar from "../components/CategorySidebar.jsx";
import TemplateCard from "../components/TemplateCard.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { getTemplates } from "../services/templateService.js";
import { getErrorMessage } from "../services/api.js";

function Templates() {
  const { searchTerm, selectedCategory, setSelectedCategory } = useOutletContext();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    let ignoreResponse = false;

    async function loadTemplates() {
      setLoading(true);
      try {
        const data = await getTemplates(searchTerm, selectedCategory);
        if (!ignoreResponse) {
          setTemplates(data);
          setError("");
        }
      } catch (err) {
        if (!ignoreResponse) {
          setError(getErrorMessage(err));
        }
      }
      if (!ignoreResponse) {
        setLoading(false);
      }
    }

    loadTemplates();

    return () => {
      ignoreResponse = true;
    };
  }, [searchTerm, selectedCategory]);

  let content;
  if (loading) {
    content = <p className="mt-10 text-center text-gray-500">Loading templates...</p>;
  } else if (error) {
    content = <p className="mt-10 text-center text-red-600">{error}</p>;
  } else if (templates.length === 0) {
    content = <p className="mt-10 text-center text-gray-500">No templates match your search.</p>;
  } else {
    content = (
      <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isFavorite={isFavorite(template.id)}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6">
      <CategorySidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <main className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold text-gray-900">Discover Templates</h1>
        <p className="mt-1 text-sm text-gray-500">
          Browse our collection of beautiful, modern templates.
        </p>
        {content}
      </main>
    </div>
  );
}

export default Templates;
