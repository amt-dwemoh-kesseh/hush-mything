import passport from "passport";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();
import {
  Profile as FacebookProfile,
  Strategy as FacebookStrategy,
} from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { roleType } from "../types/user.types";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const {
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL,
  GOOGLE_APP_ID,
  GOOGLE_APP_SECRET,
  SALT_VALUE,
  GOOGLE_CALLBACK_URL,
} = process.env;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_APP_ID,
      clientSecret: GOOGLE_APP_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, callback) {
      
      const salt = await bcrypt.genSalt(Number(SALT_VALUE));
      const googlehashPassword = bcrypt.hashSync(profile._json.sub, salt);

      try {
        const user = await prisma.user.findUnique({
          where: { email: profile._json.email },
        });
        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              email: profile._json.email,
              first_name: profile._json.family_name,
              last_name: profile._json.given_name,
              role: roleType.customer,
              password: googlehashPassword,
              activated: true,
            },
          });
          console.log(newUser)
          if (newUser) {
            passport.serializeUser(newUser, function (err, email) {
              callback(err, newUser);
            });
          } else {
            callback(null, user);
          }
        } else {
          callback(null, user);
        }
      } catch (error) {
        callback(error);
      }
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
      profileFields: ["email", "displayName", "name", "picture"],
    },
    async function (accessToken, refreshToken, profile, callback) {
      const salt = await bcrypt.genSalt(Number(SALT_VALUE));
      const facebookhashPassword = await bcrypt.hashSync(
        profile._json.id,
        salt
      );

      try {
        
        const user = await prisma.user.findUnique({
          where: { email: profile._json.email },
        });
        if (!user) {
          const newUser = await prisma.user.create({
            data: {
              email: profile._json.email,
              first_name: profile._json.first_name,
              last_name: profile._json.last_name,
              role: roleType.customer,
              password: facebookhashPassword,
              activated: true,
            },
          });

          if (newUser) {
            passport.serializeUser(newUser, function (err, email) {
              callback(err, newUser);
            });
          } else {
            callback(null, user);
          }
        } else {
          callback(null, user);
        }
      } catch (error) {
        console.log(error);
      }
    }
  )
);

passport.serializeUser(function (user, callback) {
  callback(null, (user as any).email);
});

passport.deserializeUser(async function (email, callback) {
  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });
    if (user) {
      callback(null, user);
    } else {
      console.log('User not found')
    }
  } catch (error) {
    console.log(error)
  }
});
