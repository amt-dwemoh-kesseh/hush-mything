import { body } from "express-validator";

export const validatePassword = body("password")
  .exists()
  .withMessage("Provide password")
  .trim()
  .isString()
  .notEmpty()
  .withMessage("Enter password")
  .isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .isLength({ max: 100 })
  .withMessage(
    "Password must have max character of 100 & min character of 8.Password must have at least 1 : UpperCase, Lowercase, Number, Symbol"
  );

export const validateConfirmPassword = body("confirm_password").custom(
  (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirm password does not match password");
    }
    return true;
  }
);

export const validateEmail = body("email")
  .exists()
  .trim()
  .escape()
  .isString()
  .notEmpty()
  .withMessage("Email field cannot be empty")
  .bail()
  .isEmail()
  .withMessage("Enter a valid email");

export const validateFirstName = body("first_name")
  .exists()
  .trim()
  .escape()
  .custom((value) => /^[a-zA-Z]+$/.test(value))
  .withMessage("First name must contain only letters")
  .notEmpty()
  .withMessage("First name field cannot be empty")
  .isLength({ max: 50 });

export const validateLastName = body("last_name")
  .exists()
  .trim()
  .escape()
  .custom((value) => /^[a-zA-Z]+$/.test(value))
  .isString()
  .withMessage("Enter last name")
  .bail()
  .notEmpty()
  .withMessage("Email field cannot be empty")
  .isLength({ max: 50 });

export const validateBusinessName = body("business_name")
  .notEmpty()
  .withMessage("Business name is required")
  .isString()
  .withMessage("Enter a valid business name")
  .isLength({ max: 50 });
