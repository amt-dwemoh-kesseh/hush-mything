import express, { Request, Response, response } from "express";
import { customerSignUp } from "../../controllers/User/register/customerRegister";
import { customerRegistrationValidation } from "../../middlewares/validators/authValidator";
import { verifyMyAccount } from "../../controllers/User/authenticate/accountVerify";
import { validateEmail } from "../../config/validatorConfig";
import { sendResetPasswordMail } from "../../controllers/User/resetPassword/customerPasswordReset";
import { verifyMyPasswordReset } from "../../controllers/User/authenticate/passwordReset";

export const customerRouter = express.Router();

customerRouter.post(
  "/api/customer/signup",
  customerRegistrationValidation,
  customerSignUp
);
customerRouter.put("/verify", verifyMyAccount);

customerRouter.post("/reset", validateEmail, sendResetPasswordMail);

customerRouter.put("/verify/reset", verifyMyPasswordReset);
