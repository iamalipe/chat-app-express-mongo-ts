const validatorEmail = (value: string) => {
  // Regular expression to validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

const validatorPassword = (value: string) => {
  // Regular expression to validate password
  // Requires at least 8 characters, one uppercase letter, one lowercase letter, one digit, and one symbol
  const passwordRegex =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(value);
};

const validatorUsername = (value: string) => {
  // Regular expression to validate username
  // Requires at least 3 characters, starts with a letter, and maximum of 20 characters
  const usernameRegex = /^[a-zA-Z][a-zA-Z\d]{2,19}$/;
  return usernameRegex.test(value);
};

const regexValidator = {
  email: validatorEmail,
  password: validatorPassword,
  username: validatorUsername,
};

export default regexValidator;
