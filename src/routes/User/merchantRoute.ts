import express from "express";
import { merchantSignUp } from "../../controllers/User/register/merchantRegister";
import { merchantRegistrationValidation } from "../../middlewares/validators/authValidator";
import { validateEmail } from "../../config/validatorConfig";
import { sendResetPasswordMail } from "../../controllers/User/resetPassword/customerPasswordReset";
import { verifyMyPasswordReset } from "../../controllers/User/authenticate/passwordReset";

export const merchantRouter = express.Router();

merchantRouter.post(
  "/api/merchant/signup",
  merchantRegistrationValidation,
  merchantSignUp
);
merchantRouter.post(
  "/api/merchant/reset",
  validateEmail,
  sendResetPasswordMail
);

merchantRouter.post("/merchant/reset", verifyMyPasswordReset);
