import express, { Request, Response } from "express";
import passport from "passport";

export const googleRouter = express.Router();

googleRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failpage" }),
  (req: Request, res: Response) => {
    res.redirect("/frontendpage");
  }
);

googleRouter.get("/frontendpage", (req: Request, res: Response) => {
  res.send("You are now authorized");
});
