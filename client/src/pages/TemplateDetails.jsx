import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext.jsx";
import { getTemplateById } from "../services/templateService.js";
import { getErrorMessage } from "../services/api.js";

function TemplateDetails() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignoreResponse = false;

    async function loadTemplate() {
      setLoading(true);
      try {
        const data = await getTemplateById(id);
        if (!ignoreResponse) {
          setTemplate(data);
          setError("");
        }
      } catch (err) {
        if (!ignoreResponse) {
          setTemplate(null);
          setError(getErrorMessage(err));
        }
      }
      if (!ignoreResponse) {
        setLoading(false);
      }
    }

    loadTemplate();

    return () => {
      ignoreResponse = true;
    };
  }, [id]);

  if (loading) {
    return <p className="py-16 text-center text-gray-500">Loading template...</p>;
  }

  if (!template) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-gray-600">{error}</p>
        <Link to="/templates" className="mt-4 inline-block text-brand-500 hover:underline">
          Back to Templates
        </Link>
      </div>
    );
  }

  const favorite = isFavorite(template.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        to="/templates"
        className="inline-flex items-center gap-1.5 text-sm text-brand-500 hover:underline"
      >
        <ArrowLeft size={14} />
        Back to Templates
      </Link>

      <img
        src={template.thumbnail_url}
        alt={template.name}
        className="mt-5 aspect-video w-full rounded-xl border border-gray-200 object-cover shadow-sm"
      />

      <div className="mt-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
          <span className="mt-2 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {template.category}
          </span>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(template)}
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white shadow"
        >
          <Heart
            size={20}
            className={favorite ? "fill-red-500 text-red-500" : "text-gray-400"}
          />
        </button>
      </div>

      <p className="mt-4 text-gray-600">{template.description}</p>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <h2 className="font-semibold text-gray-900">Features</h2>
        <ul className="mt-3 space-y-2">
          {template.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
              <span className="h-1.5 w-1.5 rotate-45 bg-gray-500" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* There is no live demo site per template, so this opens the full-size preview. */}
      <a
        href={template.thumbnail_url}
        target="_blank"
        rel="noreferrer"
        className="mt-8 block w-full rounded-lg bg-brand-500 py-3 text-center text-sm font-semibold text-white hover:bg-brand-600"
      >
        Use This Template
      </a>
    </div>
  );
}

export default TemplateDetails;
