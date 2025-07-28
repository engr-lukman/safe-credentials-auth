export const LENGTH = {
  MIN: {
    DEFAULT: 1,
    PASSWORD: 8,
  },
  MAX: {
    DEFAULT: 100,
    PASSWORD: 50,
  },
};

export const PASSWORD_POLICY = {
  enableSecurePassword: true,
  passwordExpiryDays: 30,
  minLength: LENGTH.MIN.PASSWORD,
  maxLength: LENGTH.MAX.PASSWORD,
  hasLowercase: true,
  hasUppercase: true,
  hasNumber: true,
  hasSpecialChar: true,
};
