export const isRequired = (v) => v !== undefined && v !== null && String(v).trim().length > 0;
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || '').trim());
export const isPhone10 = (v) => /^\d{10}$/.test(String(v || '').trim());
export const isPincode = (v) => /^\d{6}$/.test(String(v || '').trim());
export const minLen = (v, n) => String(v || '').trim().length >= n;
export const isPositive = (n) => Number(n) > 0;
export const isNonNegative = (n) => Number(n) >= 0;
export const isAlpha = (v) => /^[A-Za-z\s\-]+$/.test(String(v || '').trim());
export const isDigits = (v) => /^\d+$/.test(String(v || '').trim());
export const isDecimal = (v) => /^(?:\d+)(?:\.\d{1,2})?$/.test(String(v || '').trim());
export const isCsvAlpha = (v) => {
  const s = String(v || '').trim();
  if (!s) return false;
  return s.split(',').every(part => isAlpha(part));
};

export function validate(fields, rules) {
  // fields: { key: value }, rules: { key: [ { check: fn, message } ] }
  for (const key of Object.keys(rules)) {
    const value = fields[key];
    for (const rule of rules[key]) {
      if (!rule.check(value)) {
        return { valid: false, field: key, message: rule.message };
      }
    }
  }
  return { valid: true };
}


