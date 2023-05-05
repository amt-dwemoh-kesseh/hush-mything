import { body } from "express-validator";

export const validatePassword = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters long")
  

export const validateConfirmPassword = body("confirm_password").custom(
  (value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirm password does not match password");
    }
    return true;
  }
);

export const validateEmail = body("email")
  .not()
  .isEmpty()
  .withMessage("Email required")
  .isEmail()
  .withMessage("Invalid email address")
  .normalizeEmail();
export const validateFirstName = body("first_name")
  .notEmpty()
  .withMessage("First name is required");

export const validateLastName = body("last_name")
  .notEmpty()
  .withMessage("Last name is required");

export const validateBusinessName = body("business_name")
  .notEmpty()
  .withMessage("Business name is required");
