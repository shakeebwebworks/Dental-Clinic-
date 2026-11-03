import { Link } from "react-router-dom";

export default function ConsentCheckbox({ checked, onChange, error }) {
  return (
    <div className="mb-4">
      <div className="form-check">
        <input
          type="checkbox"
          className={`form-check-input ${error ? "is-invalid" : ""}`}
          id="consent"
          name="consent"
          checked={checked}
          onChange={onChange}
          aria-describedby={error ? "consent-error" : undefined}
        />
        <label className="form-check-label" htmlFor="consent">
          I agree to the{" "}
          <Link to="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>{" "}
          and consent to the clinic contacting me about this request.
        </label>
      </div>
      {error && (
        <div className="field-error" id="consent-error" role="alert">{error}</div>
      )}
    </div>
  );
}
