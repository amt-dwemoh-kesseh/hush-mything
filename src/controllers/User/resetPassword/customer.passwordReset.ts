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
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    const customerExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!customerExist) {
      res.status(501).json({
        success: false,
        message: "Email not registered, SignUp for an account",
      });
    }

    const customerActivated = await prisma.user.findFirst({
      where: {
        email: email,
        activated: true,
      },
    });

    if (!customerActivated) {
      return res.status(501).json({
        success: false,
        message: "Account not verified! Verification link has been sent!",
      });
    } else {
      resetPasswordMail(customerExist, token(customerExist.id));
      res.json({
        success: true,
        message: `Password reset link sent to ${customerExist.email}`,
      });
    }
  } catch (error) {
    const message = "Error While reseting password";
    console.error(message);
  }
};
