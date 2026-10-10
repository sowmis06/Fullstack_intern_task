import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import FormField from "../components/FormField.jsx";
import { registerUser } from "../services/authService.js";
import { getErrorMessage } from "../services/api.js";

function validateRegisterForm(values) {
  const errors = {};

  if (values.name.trim() === "") {
    errors.name = "Full name is required";
  }

  if (values.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

function Register() {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const validationErrors = validateRegisterForm(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      await registerUser(formValues.name, formValues.email, formValues.password);
      navigate("/login", { state: { registered: true } });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h1 className="mt-6 text-center text-2xl font-bold text-gray-900">Create Account</h1>
      <p className="mt-1 text-center text-sm text-gray-500">
        Join and start exploring amazing templates
      </p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
        <FormField
          label="Full Name"
          name="name"
          icon={User}
          value={formValues.name}
          onChange={handleChange}
          error={errors.name}
          autoComplete="name"
          labelInside
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          value={formValues.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          labelInside
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          value={formValues.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete="new-password"
          labelInside
        />
        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          icon={Lock}
          value={formValues.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
          labelInside
        />

        {formError && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-500 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default Register;
