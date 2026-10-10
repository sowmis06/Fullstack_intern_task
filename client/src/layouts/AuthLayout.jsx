import { Outlet } from "react-router-dom";
import Logo from "../components/Logo.jsx";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-violet-50 px-4 py-10">
      <div className="absolute -left-24 -top-24 h-72 w-72 rotate-12 rounded-[3rem] bg-brand-100" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 -rotate-12 rounded-[3rem] bg-brand-100" />

      <div className="relative w-full max-w-md rounded-3xl bg-white px-8 py-10 shadow-xl">
        <div className="flex justify-center">
          <Logo />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
