import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { customerRouter } from "./routes/User/customer.route";
import { merchantRouter } from "./routes/User/merchant.route";
import expressSession from "express-session";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { facebookRouter } from "./routes/User/stategies/facebook.route";
import "./config/passportConfig";
import { googleRouter } from "./routes/User/stategies/google.route";

dotenv.config();

export const app: Application = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(
  expressSession({
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({}));
app.use(express.urlencoded({ extended: true }));

app.use("/", customerRouter);
app.use("/", merchantRouter);
app.use("/", facebookRouter);
app.use("/", googleRouter);

const PORT = process.env.PORT;

app.listen(PORT);
