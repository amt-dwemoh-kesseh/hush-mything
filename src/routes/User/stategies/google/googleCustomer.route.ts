import express, { Request, Response } from "express";
import passport from "passport";

export const googleCustomerRouter = express.Router();

googleCustomerRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleCustomerRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failpage" }),
  (req: Request, res: Response) => {
    res.redirect("/frontendpage");
  }
);

googleCustomerRouter.get("/frontendpage", (req: Request, res: Response) => {
  res.send("You are now authorized");
});
