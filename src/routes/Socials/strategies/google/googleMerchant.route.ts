import express, { Request, Response } from "express";
import passport from "passport";

const googleBusinessRouter = express.Router();

googleBusinessRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

googleBusinessRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failpage" }),
  (req: Request, res: Response) => {
    res.redirect("/frontendpage");
  }
);

googleBusinessRouter.get("/frontendpage", (req: Request, res: Response) => {
  res.send("You are now authorized");
});


export default googleBusinessRouter;