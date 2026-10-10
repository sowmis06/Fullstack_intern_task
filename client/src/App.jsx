import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout.jsx";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Templates from "./pages/Templates.jsx";
import TemplateDetails from "./pages/TemplateDetails.jsx";
import Favorites from "./pages/Favorites.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<AuthLayout />}>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:id" element={<TemplateDetails />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<Favorites />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
