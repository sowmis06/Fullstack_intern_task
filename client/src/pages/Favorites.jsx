import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import TemplateCard from "../components/TemplateCard.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";

function Favorites() {
  const { favoriteTemplates, loading, toggleFavorite } = useFavorites();

  let content;
  if (loading) {
    content = <p className="mt-10 text-center text-gray-500">Loading favorites...</p>;
  } else if (favoriteTemplates.length === 0) {
    content = (
      <div className="mt-16 flex flex-col items-center text-center">
        <Heart size={40} className="text-gray-300" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">No favorites yet</h2>
        <p className="mt-1 text-sm text-gray-500">
          Tap the heart on a template to save it here.
        </p>
        <Link
          to="/templates"
          className="mt-5 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Browse Templates
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isFavorite
            onToggleFavorite={toggleFavorite}
            showDescription={false}
          />
        ))}
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
      <p className="mt-1 text-sm text-gray-500">Your saved templates</p>
      {content}
    </main>
  );
}

export default Favorites;
