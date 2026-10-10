import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

function TemplateCard({ template, isFavorite, onToggleFavorite, showDescription = true }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/templates/${template.id}`} className="block">
        <img
          src={template.thumbnail_url}
          alt={template.name}
          className="aspect-video w-full bg-gray-100 object-cover"
        />
        <div className="p-4">
          <h3 className="font-semibold text-gray-900">{template.name}</h3>
          <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {template.category}
          </span>
          {showDescription && (
            <p className="mt-2 line-clamp-2 text-sm text-gray-500">
              {template.description}
            </p>
          )}
        </div>
      </Link>

      <button
        type="button"
        onClick={() => onToggleFavorite(template)}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
      >
        <Heart
          size={16}
          className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}
        />
      </button>
    </div>
  );
}

export default TemplateCard;
