import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useFavorites } from "../context/FavoritesContext.jsx";


function MainLayout() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { error: favoritesError } = useFavorites();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        variant="app"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      {favoritesError && (
        <p className="bg-red-50 px-4 py-2 text-center text-sm text-red-700">{favoritesError}</p>
      )}
      <Outlet context={{ searchTerm, selectedCategory, setSelectedCategory }} />
    </div>
  );
}

export default MainLayout;
