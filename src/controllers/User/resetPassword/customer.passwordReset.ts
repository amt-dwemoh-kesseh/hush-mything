import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequestBody } from "../../../types/user.types";
import { validationResult } from "express-validator";
import token from "../../../utils/genToken";
import { resetPasswordMail } from "../../../utils/mailService";

const prisma = new PrismaClient();

export const sendResetPasswordMail = async (
  req: Request<{ merchant: Partial<UserRequestBody> }>,
  res: Response,
  next: NextFunction
) => {
  try {
    // checking email validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // recieve email
    const { email } = req.body;

    // check for email in user-table in db
    const customerExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    
    // CASE: customer email does not exit in db
    if (!customerExist) {
      res
        .status(501)
        .json({ message: "Email not registered, SignUp for an account" });
    }

    // fetch an activated user
    const customerActivated = await prisma.user.findFirst({
      where: {
        email: email,
        activated: true,
      },
    });

    // user is not activated
    if (!customerActivated) {
      return res.status(501).json({ message: "Account not verified! Verification link has been sent!" });
    } 
    //  user is activated
    else {

        // send reset password link
        resetPasswordMail(customerExist, token(customerExist.id));
        res.json({
            status: "ok",
            message: `Password reset link sent to ${customerExist.email}`
        })
    }
    
  } catch (error) {    
    const message = 'Error While reseting password';
    res.status(500).json({
        status: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : []
    })
  }
};
