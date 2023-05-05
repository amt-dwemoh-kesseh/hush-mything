import express, { Request, Response } from 'express';
import passport from 'passport';



export const facebookRouter = express.Router()





facebookRouter.get("/auth/facebook", passport.authenticate("facebook", { scope: "email" }));




facebookRouter.get(
  "/facebook/callback",
  passport.authenticate('facebook', {
    successRedirect: "/api/verify/mockpage",
    failureRedirect: "/api/verify/fail",
  })
);

facebookRouter.get('/api/verify/mockpage', (req: Request, res: Response) => {
    res.send('You are finally here')
})

facebookRouter.get("/api/verify/fail", (req: Request, res: Response) => {
  res.send("https://github.com");
});