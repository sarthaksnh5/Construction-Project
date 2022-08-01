export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/;
  if (!email) return "Email can't be empty.";
  if (!re.test(email)) return 'Ooops! We need a valid email address.';
  return '';
}

export function mobileValidator(password) {
  if (!password) return "Number can't be empty.";
  if (password.length < 10) return 'Number cannot be less than 10 numbers';
  return '';
}

export function nameValidator(password) {
  if (!password) return "This Field can't be empty.";
  return '';
}

export function passwordValidator(password) {
  if (!password) return "Password can't be empty.";
  if (password.length < 8)
    return 'Password must be at least 8 characters long.';
  return '';
}
