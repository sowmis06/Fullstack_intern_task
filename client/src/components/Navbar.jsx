import { Link, NavLink, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import Logo from "./Logo.jsx";
import SearchBar from "./SearchBar.jsx";
import UserMenu from "./UserMenu.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { categories } from "../data/categories.js";

function getNavLinkClass(isActive, isPublic) {
  if (isPublic) {
    return isActive ? "text-white" : "text-white/80 hover:text-white";
  }
  if (isActive) {
    return "border-b-2 border-brand-500 pb-1 text-brand-500";
  }
  return "border-b-2 border-transparent pb-1 text-gray-600 hover:text-gray-900";
}


function AuthLinks({ onDark }) {
  const loginClass = onDark
    ? "border border-white/50 text-white hover:bg-white/10"
    : "border border-gray-300 text-gray-700 hover:bg-gray-50";
  const registerClass = onDark
    ? "bg-brand-400 text-white hover:bg-brand-500"
    : "bg-brand-500 text-white hover:bg-brand-600";

  return (
    <div className="flex items-center gap-3">
      <Link to="/login" className={`rounded-lg px-4 py-2 text-sm font-medium ${loginClass}`}>
        Login
      </Link>
      <Link to="/register" className={`rounded-lg px-4 py-2 text-sm font-medium ${registerClass}`}>
        Register
      </Link>
    </div>
  );
}

function Navbar({
  variant = "app",
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}) {
  const location = useLocation();
  const { user, loading } = useAuth();
  const isPublic = variant === "public";
  const showSearch = !isPublic && location.pathname === "/templates";

  const navLinks = (
    <nav
      className={`items-center gap-6 text-sm font-medium ${
        isPublic ? "hidden sm:flex" : "flex"
      }`}
    >
      <NavLink
        to="/templates"
        className={({ isActive }) => getNavLinkClass(isActive, isPublic)}
      >
        Templates
      </NavLink>
      <NavLink
        to="/favorites"
        className={({ isActive }) => getNavLinkClass(isActive, isPublic)}
      >
        Favorites
      </NavLink>
    </nav>
  );

  let accountArea = null;
  if (!loading) {
    accountArea = user ? <UserMenu /> : <AuthLinks onDark={isPublic} />;
  }

  if (isPublic) {
    return (
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo light />
        {navLinks}
        {accountArea}
      </header>
    );
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-3 sm:px-6">
        <Logo />
        {navLinks}

        {showSearch && (
          <div className="order-last flex w-full gap-3 md:order-none md:ml-auto md:w-auto">
            <SearchBar value={searchTerm} onChange={onSearchChange} />
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(event) => onCategoryChange(event.target.value)}
                className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm text-gray-700 outline-none focus:border-brand-500"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name === "All" ? "All Categories" : category.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        )}

        <div className={showSearch ? "ml-auto md:ml-0" : "ml-auto"}>{accountArea}</div>
      </div>
    </header>
  );
}

export default Navbar;
