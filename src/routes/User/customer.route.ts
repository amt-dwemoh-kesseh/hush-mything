import express, { Request, Response, response } from 'express';
import { customerSignIn } from "../../controllers/User/register/customer.register";
import { customerRegistrationValidation } from "../../middlewares/validators/auth.validator";
import { verifymyAccount } from "../../controllers/User/authenticate/accountVerify";
import { validateEmail } from "../../config/validatorConfig";
import { sendResetPasswordMail } from "../../controllers/User/resetPassword/customer.passwordReset";
import { verifyMyPasswordReset } from "../../controllers/User/authenticate/password.reset";

export const customerRouter = express.Router();

customerRouter.post(
  "/api/customer/signup",
  customerRegistrationValidation,
  customerSignIn
);
customerRouter.put("/verify", verifymyAccount);

customerRouter.post("/reset", validateEmail, sendResetPasswordMail);

customerRouter.put("/verify/reset", verifyMyPasswordReset);
