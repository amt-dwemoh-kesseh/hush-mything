import express from "express";
import { merchantSignIn } from "../../controllers/User/register/merchant.register";
import { merchantLogin } from "../../controllers/User/login/merchant.login";
import {
  loginValidation,
  merchantRegistrationValidation,
} from "../../middlewares/validators/auth.validator";

export const merchantRouter = express.Router();

merchantRouter.post(
  "/api/merchant/signup",
  merchantRegistrationValidation,
  merchantSignIn
);
merchantRouter.post("/api/merchant/login", loginValidation, merchantLogin);
