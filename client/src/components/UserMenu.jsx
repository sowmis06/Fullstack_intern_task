import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  function handleLogout() {
    logout();
    setIsOpen(false);
    navigate("/");
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-semibold text-white"
      >
        {user.name.charAt(0).toUpperCase()}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
          <div className="px-3 py-2">
            <p className="truncate text-sm font-semibold text-gray-900">{user.name}</p>
            <p className="truncate text-xs text-gray-500">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
