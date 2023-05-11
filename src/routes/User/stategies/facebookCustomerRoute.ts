import express, { Request, Response } from "express";
import passport from "passport";

export const facebookCustomerRouter = express.Router();
const { FRONTENT_BASE_URL } = process.env;


facebookCustomerRouter.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

facebookCustomerRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: (`${FRONTENT_BASE_URL}/homepage`),
    failureRedirect: "/api/verify/fail",
  })
);

facebookCustomerRouter.get(
  "/api/verify/mockpage",
  (req: Request, res: Response) => {
    res.send("You are finally here");
  }
);

facebookCustomerRouter.get(
  "/api/verify/fail",
  (req: Request, res: Response) => {
    res.send("https://github.com");
  }
);