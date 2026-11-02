export default function Field({ label, name, error, required = false, children }) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label fw-semibold">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {error && (
        <div className="field-error" id={`${name}-error`} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
