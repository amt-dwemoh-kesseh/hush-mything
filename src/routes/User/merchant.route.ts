import express from "express";
import { merchantSignIn } from "../../controllers/User/register/merchant.register";
import { merchantRegistrationValidation } from "../../middlewares/validators/auth.validator";
import { validateEmail } from "../../config/validatorConfig";
import { sendResetPasswordMail } from "../../controllers/User/resetPassword/customer.passwordReset";
import { verifyMyPasswordReset } from "../../controllers/User/authenticate/password.reset";

export const merchantRouter = express.Router();

merchantRouter.post(
  "/api/merchant/signup",
  merchantRegistrationValidation,
  merchantSignIn
);
merchantRouter.post(
  "/api/merchant/reset",
  validateEmail,
  sendResetPasswordMail
);

merchantRouter.post("/merchant/reset", verifyMyPasswordReset);
