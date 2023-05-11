import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import expressSession from "express-session";
import passport from "passport";
import cors from "cors";
import "./config/passportConfig";
import { appRouter } from "./routes/routesHandler/routes";
import { errorHandler } from "./utils/utils";

dotenv.config();

export const app: Application = express();
const { SESSION_SECRET } = process.env;

app.use(express.json());

app.use(
  expressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(cors({}));
app.use(express.urlencoded({ extended: true }));

app.use("/", appRouter);

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT);
