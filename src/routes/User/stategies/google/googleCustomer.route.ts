import express, { Request, Response } from "express";
import passport from "passport";

export const googleCustomerRouter = express.Router();

googleCustomerRouter.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleCustomerRouter.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/verify/failpage" }),
  (req: Request, res: Response) => {
    res.redirect("/frontendpage");
  }
);

googleCustomerRouter.get("/verify/frontendpage", (req: Request, res: Response) => {
  res.send("You are now authorized");
});
