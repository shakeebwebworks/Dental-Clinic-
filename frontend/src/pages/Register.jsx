import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Field from "../components/forms/Field";
import useAuth from "../hooks/useAuth";
import { parseApiError } from "../utils/apiErrors";
import { isEmail, isPhone } from "../utils/validators";

const emptyForm = {
  username: "", first_name: "", last_name: "", email: "", phone: "", password: "", password_confirm: "",
};

function validate(f) {
  const e = {};
  if (!/^[\w.@+-]{3,150}$/.test(f.username.trim())) {
    e.username = "Use 3 or more letters, numbers or . @ + - _ (no spaces).";
  }
  if (!f.email.trim()) e.email = "Email address is required.";
  else if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (f.phone.trim() && !isPhone(f.phone)) e.phone = "Enter a valid phone number (10-13 digits).";
  if (f.password.length < 8) e.password = "Password must be at least 8 characters.";
  if (f.password_confirm !== f.password) e.password_confirm = "Passwords do not match.";
  return e;
}

export default function Register() {
  const { user, register } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={user.is_staff ? "/dashboard" : "/my-appointments"} replace />;

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

  const focusFirst = (found) => {
    const first = Object.keys(found)[0];
    if (first) document.getElementById(first)?.focus();
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirst(found);
      return;
    }

    setLoading(true);
    try {
      await register({
        username: form.username.trim(),
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        password_confirm: form.password_confirm,
      });
      // Logged in automatically: the page redirects.
    } catch (err) {
      const parsed = parseApiError(err);
      setErrors(parsed.fieldErrors);
      setServerError(parsed.message);
      focusFirst(parsed.fieldErrors);
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader title="Create Account" subtitle="Track your appointments in one place." />
      <section className="section">
        <div className="container">
          <div className="auth-wrap">
            <form className="card card-soft no-lift p-4 p-lg-5 form-card" onSubmit={onSubmit} noValidate>
              {serverError && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                  <AlertCircle size={20} /> {serverError}
                </div>
              )}
              <div className="row">
                <div className="col-md-6">
                  <Field label="First name" name="first_name" error={errors.first_name}>
                    <input type="text" autoComplete="given-name" {...fieldProps("first_name")} />
                  </Field>
                </div>
                <div className="col-md-6">
                  <Field label="Last name" name="last_name" error={errors.last_name}>
                    <input type="text" autoComplete="family-name" {...fieldProps("last_name")} />
                  </Field>
                </div>
              </div>
              <Field label="Username" name="username" error={errors.username} required>
                <input type="text" autoComplete="username" {...fieldProps("username")} />
              </Field>
              <Field label="Email address" name="email" error={errors.email} required>
                <input type="email" autoComplete="email" {...fieldProps("email")} />
              </Field>
              <Field label="Phone (optional)" name="phone" error={errors.phone}>
                <input type="tel" autoComplete="tel" {...fieldProps("phone")} />
              </Field>
              <Field label="Password" name="password" error={errors.password} required>
                <input type="password" autoComplete="new-password" {...fieldProps("password")} />
              </Field>
              <Field label="Confirm password" name="password_confirm" error={errors.password_confirm} required>
                <input type="password" autoComplete="new-password" {...fieldProps("password_confirm")} />
              </Field>
              <button type="submit" className="btn btn-brand btn-lg mt-2" disabled={loading}>
                {loading ? (<><Loader2 size={20} className="spin me-2" /> Creating...</>) : (<><UserPlus size={20} className="me-2" /> Create account</>)}
              </button>
              <p className="text-muted mt-4 mb-0 text-center">
                Already registered? <Link to="/login">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
