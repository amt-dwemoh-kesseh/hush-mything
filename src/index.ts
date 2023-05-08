import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import expressSession from "express-session";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import "./config/customerPassportConfig";
import "./config/merchantPassportConfig"
import { approuter } from "./routes/routesHandler/routes";

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

app.use('/',approuter)


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running`)
});
