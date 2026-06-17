// Reusable validation helpers for all frontend forms.
window.SBValidation = {
  required(value) { return String(value ?? '').trim().length > 0; },
  email(value) { return /^\S+@\S+\.\S+$/.test(String(value ?? '').trim()); },
  positiveNumber(value) { return Number.isFinite(Number(value)) && Number(value) > 0; },
  nonNegativeNumber(value) { return Number.isFinite(Number(value)) && Number(value) >= 0; },
  minLength(value, min) { return String(value ?? '').trim().length >= min; },
  maxLength(value, max) { return String(value ?? '').trim().length <= max; },
  password(value) { return String(value ?? '').length >= 8; },
  username(value) { return /^[a-zA-Z0-9_]{3,50}$/.test(String(value ?? '').trim()); },
  phone(value) { return /^\+?[\d\s-]{7,20}$/.test(String(value ?? '').trim()); },
  image(file, maxBytes = 2 * 1024 * 1024) {
    if (!file) return true;
    return ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= maxBytes;
  },
  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add('field-error');
    let err = field.parentElement.querySelector('.field-error-msg');
    if (!err) { err = document.createElement('span'); err.className = 'field-error-msg'; field.parentElement.appendChild(err); }
    err.textContent = message;
  },
  clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.remove('field-error');
    const err = field.parentElement?.querySelector('.field-error-msg');
    if (err) err.remove();
  },
  clearAllErrors(form) {
    form.querySelectorAll('.field-error').forEach(f => f.classList.remove('field-error'));
    form.querySelectorAll('.field-error-msg').forEach(e => e.remove());
  },
  showBackendErrors(form, errors) {
    if (!Array.isArray(errors)) return;
    errors.forEach(e => {
      const field = e.path || e.param;
      if (field) this.showFieldError(field, e.msg);
    });
  },
  validateForm(rules) {
    for (const { field, check, message } of rules) {
      if (!check) { this.showFieldError(field, message); return false; }
      this.clearFieldError(field);
    }
    return true;
  }
};
