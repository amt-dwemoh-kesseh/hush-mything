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
    res.redirect("https://aj-storefront-frontend.netlify.app/homepage");
  }
);

googleCustomerRouter.get("/failpage", (req: Request, res: Response) => {
  res.send("Failed to authenticate");
});
