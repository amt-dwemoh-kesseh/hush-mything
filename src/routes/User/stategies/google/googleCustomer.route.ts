import express, { Request, Response } from "express";
import passport from "passport";
import { json } from "stream/consumers";

export const googleCustomerRouter = express.Router();

googleCustomerRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

googleCustomerRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failpage" }),
  (req: Request, res: Response) => {
    res.redirect("http://localhost:5173/dashboard");
  }
);

googleCustomerRouter.get("/failpage", (req: Request, res: Response) => {
  res.send("Failed to authenticate");
});

googleCustomerRouter.get("/login/success", (req: Request, res: Response) => {
  const userProfile = req.user
      res.status(200).json({
      message: "SuccessFul now",
      success: true,
      user: userProfile,
    });
 
});
