import express, { Request, Response, response } from "express";
import { loginValidation } from "../../middlewares/validators/auth.validator";
import { userLogin } from "../../controllers/User/login/user.login";

export const LoginRouter = express.Router()

LoginRouter.post("/api/user/login", loginValidation, userLogin);