import express,{Application} from 'express'
import dotenv from 'dotenv'
import expressSession from "express-session";
import passport from 'passport'
import cors from 'cors'
import "./config/customerPassportConfig";
import "./config/merchantPassportConfig"
import { approuter } from "./routes/routesHandler/routes";

dotenv.config();

export const app: Application = express();


app.use(express.json());

app.use(
  expressSession({
    secret: "thisismysecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/',approuter)


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running now`)
});
