import express,{Request,Response, response} from "express";
import { customerSignIn } from "../../controllers/User/register/customer.register";
import {
  customerRegistrationValidation,
  loginValidation,
} from "../../middlewares/validators/auth.validator";
import { verifymyAccount } from "../../controllers/User/authenticate/accountVerify";
import { customerLogin } from "../../controllers/User/login/customer.login";
import { validateEmail } from "../../config/validatorConfig";
import { sendResetPasswordMail } from "../../controllers/User/resetPassword/customer.passwordReset";
import { verifyMyPasswordReset } from "../../controllers/User/authenticate/password.reset";


export const customerRouter = express.Router();

customerRouter.post(
  "/api/customer/signup",
  customerRegistrationValidation,
  customerSignIn
);
customerRouter.get("/verify/:id/:token",verifymyAccount)

customerRouter.post("/api/customer/login", loginValidation, customerLogin);

customerRouter.post('/api/customer/reset', validateEmail, sendResetPasswordMail);

customerRouter.put("/customer/reset", verifyMyPasswordReset);

