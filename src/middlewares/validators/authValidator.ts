import {
  validateBusinessName,
  validateConfirmPassword,
  validateEmail,
  validateFirstName,
  validateLastName,
  validatePassword,
} from "../../config/validatorConfig";

export const loginValidation = [validateEmail, validatePassword];

export const resetPasswordValidation = [
  validatePassword,
  validateConfirmPassword,
];
export const customerRegistrationValidation = [
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateFirstName,
  validateLastName,
];

export const merchantRegistrationValidation = [
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateBusinessName,
];
