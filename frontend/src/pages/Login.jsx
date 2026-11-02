import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { AlertCircle, Loader2, LogIn } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Field from "../components/forms/Field";
import useAuth from "../hooks/useAuth";
import { parseApiError } from "../utils/apiErrors";

export default function Login() {
  const { user, login } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    const target = location.state?.from || (user.is_staff ? "/dashboard" : "/my-appointments");
    return <Navigate to={target} replace />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const fieldProps = (name) => ({
    id: name,
    name,
    value: form[name],
    onChange,
    className: `form-control ${errors[name] ? "is-invalid" : ""}`,
    "aria-invalid": errors[name] ? "true" : "false",
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const found = {};
    if (!form.username.trim()) found.username = "Enter your username.";
    if (!form.password) found.password = "Enter your password.";
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }

    setLoading(true);
    try {
      await login(form.username.trim(), form.password);
      // The page redirects automatically once the user is set.
    } catch (err) {
      setServerError(parseApiError(err).message);
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Login" subtitle="Access your appointments and account." />
      <section className="section">
        <div className="container">
          <div className="auth-wrap">
            <form className="card card-soft no-lift p-4 p-lg-5 form-card" onSubmit={onSubmit} noValidate>
              {serverError && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <AlertCircle size={20} /> {serverError}
                </div>
              )}
              <Field label="Username" name="username" error={errors.username} required>
                <input type="text" autoComplete="username" {...fieldProps("username")} />
              </Field>
              <Field label="Password" name="password" error={errors.password} required>
                <input type="password" autoComplete="current-password" {...fieldProps("password")} />
              </Field>
              <button type="submit" className="btn btn-brand btn-lg mt-2" disabled={loading}>
                {loading ? (<><Loader2 size={20} className="spin me-2" /> Signing in...</>) : (<><LogIn size={20} className="me-2" /> Login</>)}
              </button>
              <p className="text-muted mt-4 mb-0 text-center">
                New here? <Link to="/register">Create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
