import express from "express";
import { merchantSignIn } from "../../controllers/User/register/merchant.register";
import { merchantRegistrationValidation } from "../../middlewares/validators/auth.validator";
import { validateEmail } from "../../config/validatorConfig";
import { sendResetPasswordMail } from "../../controllers/User/resetPassword/customer.passwordReset";
import { verifyMyPasswordReset } from "../../controllers/User/authenticate/password.reset";

const merchantRouter = express.Router();

merchantRouter.post(
  "/signup",
  merchantRegistrationValidation,
  merchantSignIn
);

merchantRouter.post(
  "/reset",
  validateEmail,
  sendResetPasswordMail
);

merchantRouter.post("/verify/reset", verifyMyPasswordReset);

export default merchantRouter;