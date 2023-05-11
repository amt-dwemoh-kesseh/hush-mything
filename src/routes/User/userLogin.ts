import express, { Request, Response, response } from "express";
import { loginValidation } from "../../middlewares/validators/authValidator";
import { userLogin } from "../../controllers/User/login/userLogin";

export const loginRouter = express.Router();

loginRouter.post("/api/user/login", loginValidation, userLogin);