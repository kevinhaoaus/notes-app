// Email validation
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Password validation
export function validatePassword(password) {
  return password && password.length >= 6;
}

// Display name validation
export function validateDisplayName(name) {
  return name && name.trim().length >= 2;
}

// Form validation helper
export function validateForm(formData, rules) {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = formData[field];
    const rule = rules[field];

    if (rule.required && (!value || value.trim() === '')) {
      errors[field] = `${rule.label} is required`;
    } else if (value && rule.validate && !rule.validate(value)) {
      errors[field] = rule.message || `Invalid ${rule.label.toLowerCase()}`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}