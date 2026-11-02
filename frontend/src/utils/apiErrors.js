// The Django field "patient_name" is shown in the form as "name".
const FIELD_MAP = { patient_name: "name" };

// Turns a failed API call into { fieldErrors, message } for the forms.
export function parseApiError(error) {
  const data = error?.response?.data;
  const status = error?.response?.status;
  const fieldErrors = {};
  let message = error?.friendlyMessage || "Something went wrong. Please try again.";

  if (status === 400 && data && typeof data === "object" && !Array.isArray(data)) {
    Object.entries(data).forEach(([key, value]) => {
      const text = Array.isArray(value) ? value.join(" ") : String(value);
      if (key === "non_field_errors" || key === "detail") {
        message = text;
      } else {
        fieldErrors[FIELD_MAP[key] || key] = text;
      }
    });
    if (Object.keys(fieldErrors).length > 0) {
      message = "Please correct the highlighted fields.";
    }
  }
  return { fieldErrors, message };
}
