export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const isPhone = (v) => {
  const value = v.trim();
  if (!/^[+0-9\s()-]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
};

// Today's date in the user's local time, formatted YYYY-MM-DD for <input type="date">.
export const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split("T")[0];
};

export const isSunday = (isoDate) => new Date(`${isoDate}T00:00:00`).getDay() === 0;
