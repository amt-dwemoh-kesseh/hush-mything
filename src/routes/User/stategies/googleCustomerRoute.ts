import express, { Request, Response } from "express";
import passport from "passport";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../../constants/message";

const { FRONTENT_BASE_URL } = process.env;
const { authenticationFailure } = ERROR_MESSAGE;
const { authenticationSuccess } = SUCCESS_MESSAGE;

export const googleCustomerRouter = express.Router();

googleCustomerRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleCustomerRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failpage" }),
  (req: Request, res: Response) => {
    res.redirect(`${FRONTENT_BASE_URL}/homepage`);
  }
);

googleCustomerRouter.get("/failpage", (req: Request, res: Response) => {
  res.send(authenticationFailure);
});
googleCustomerRouter.get("/login/success", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: authenticationSuccess,
    
  });
});
