import express,{Request,Response, response} from "express";
import { customerSignIn } from "../../controllers/User/register/customer.register";
import {
  customerRegistrationValidation, loginValidation,
  
} from "../../middlewares/validators/auth.validator";
import { verifymyAccount } from "../../controllers/User/authenticate/accountVerify";
import { validateEmail } from "../../config/validatorConfig";
import { sendResetPasswordMail } from "../../controllers/User/resetPassword/customer.passwordReset";
import { verifyMyPasswordReset } from "../../controllers/User/authenticate/password.reset";
import { userLogin } from "../../controllers/User/login/user.login";


const customerRouter = express.Router();

customerRouter.post(
  "/register",
  customerRegistrationValidation,
  customerSignIn
);

customerRouter.post("/login", loginValidation, userLogin);

customerRouter.put("/verify", verifymyAccount);

customerRouter.post("/reset", validateEmail, sendResetPasswordMail);

customerRouter.put("/verify/reset", verifyMyPasswordReset);

export default customerRouter;