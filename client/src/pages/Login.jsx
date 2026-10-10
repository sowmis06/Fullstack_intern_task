import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import FormField from "../components/FormField.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getErrorMessage } from "../services/api.js";

function validateLoginForm(values) {
  const errors = {};

  if (values.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (values.password === "") {
    errors.password = "Password is required";
  }

  return errors;
}

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formValues, setFormValues] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const justRegistered = location.state && location.state.registered;

  const redirectPath = (location.state && location.state.from) || "/templates";

  function handleChange(event) {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const validationErrors = validateLoginForm(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await login(formValues.email, formValues.password, rememberMe);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  function handleForgotPassword() {
    setNotice("Password recovery is not available yet.");
  }

  return (
    <div>
      <h1 className="mt-6 text-center text-2xl font-bold text-gray-900">Welcome Back</h1>
      <p className="mt-1 text-center text-sm text-gray-500">Login to your account</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        {justRegistered && (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">
            Account created. Please log in.
          </p>
        )}

        <FormField
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          placeholder="Email"
          value={formValues.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="Password"
          value={formValues.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-4 w-4 accent-brand-500"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-brand-500 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {formError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
        )}
        {notice && (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">{notice}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand-500 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
