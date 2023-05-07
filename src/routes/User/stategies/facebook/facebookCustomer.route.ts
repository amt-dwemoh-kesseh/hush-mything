import express, { Request, Response } from "express";
import passport from "passport";

export const facebookCustomerRouter = express.Router();

facebookCustomerRouter.get(
  "/",
  passport.authenticate("facebook", { scope: "email" })
);

facebookCustomerRouter.get(
  "/callback",
  passport.authenticate("facebook", {
    successRedirect: "/verify/mockpage",
    failureRedirect: "/verify/fail",
  })
);

facebookCustomerRouter.get(
  "/verify/mockpage",
  (req: Request, res: Response) => {
    res.send("You are finally here");
  }
);

facebookCustomerRouter.get(
  "/verify/fail",
  (req: Request, res: Response) => {
    res.send("failed to verify");
  }
);
