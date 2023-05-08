import express, { Request, Response } from "express";
import passport from "passport";

const facebookBusinessRouter = express.Router();

facebookBusinessRouter.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

facebookBusinessRouter.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/api/verify/mockpage",
    failureRedirect: "/api/verify/fail",
  })
);

facebookBusinessRouter.get(
  "/api/verify/mockpage",
  (req: Request, res: Response) => {
    res.send("You are finally here");
  }
);

facebookBusinessRouter.get(
  "/api/verify/fail",
  (req: Request, res: Response) => {
    res.send("https://github.com");
  }
);

export default facebookBusinessRouter;
