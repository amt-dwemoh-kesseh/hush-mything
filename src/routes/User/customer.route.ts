import express from "express";
import { customerSignIn } from "../../controllers/User/register/customer.register";
import {
  customerRegistrationValidation,
  loginValidation,
} from "../../middlewares/validators/auth.validator";
import { verifymyAccount } from "../../controllers/User/authenticate/accountVerify";
import { customerLogin } from "../../controllers/User/login/customer.login";

export const customerRouter = express.Router();

customerRouter.post(
  "/api/customer/signup",
  customerRegistrationValidation,
  customerSignIn
);
customerRouter.get("/verify/:id/:token", verifymyAccount);

customerRouter.post("/api/customer/login", loginValidation, customerLogin);
