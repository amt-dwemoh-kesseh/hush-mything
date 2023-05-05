import express from "express";
import { merchantSignIn } from "../../controllers/User/register/merchant.register";
import { merchantLogin } from "../../controllers/User/login/merchant.login";
import {
  loginValidation,
  merchantRegistrationValidation,
} from "../../middlewares/validators/auth.validator";
import { validateEmail } from "../../config/validatorConfig";
import { sendResetPasswordMail } from "../../controllers/User/resetPassword/customer.passwordReset";
import { verifyMyPasswordReset } from "../../controllers/User/authenticate/password.reset";

export const merchantRouter = express.Router();

merchantRouter.post(
  "/api/merchant/signup",
  merchantRegistrationValidation,
  merchantSignIn
);
merchantRouter.post("/api/merchant/login", loginValidation, merchantLogin);

merchantRouter.post('/api/customer/reset', validateEmail, sendResetPasswordMail);

merchantRouter.post("/customer/reset", verifyMyPasswordReset);