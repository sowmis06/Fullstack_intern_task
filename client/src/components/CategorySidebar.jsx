import { categories } from "../data/categories.js";

function CategorySidebar({ selectedCategory, onSelectCategory }) {
  return (
    <aside className="hidden w-56 shrink-0 lg:block">
      <h2 className="mb-3 px-3 text-sm font-semibold text-gray-900">Categories</h2>
      <ul className="space-y-1">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = category.name === selectedCategory;

          return (
            <li key={category.name}>
              <button
                type="button"
                onClick={() => onSelectCategory(category.name)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  isSelected
                    ? "bg-brand-50 font-medium text-brand-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon size={16} />
                {category.name}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default CategorySidebar;
