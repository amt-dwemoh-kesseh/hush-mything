import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequestBody } from "../../../types/user.types";
import { validationResult } from "express-validator";
import token from "../../../utils/genToken";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const merchantLogin = async (
  req: Request<{ merchant: Partial<UserRequestBody> }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    
    const merchantExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!merchantExist) {
      res
        .status(501)
        .json({ message: "Email not registered,SignUp for an account" });
    }

    const merchantActivated = await prisma.user.findFirst({
      where: {
        email: email,
        activated: true,
      },
    });
    if (!merchantActivated) {
      return res.status(501).json({ message: "Account not verified!" });
    }
    const compareSuccess = await bcrypt.compareSync( password,merchantActivated.password);
    if (compareSuccess) {
      return res
        .status(200)
        .json({ message: "Success", merchantActivated: { email, token } });
    } else {
      return res.status(501).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    throw new Error('Error Whilst logging in!')
  }
};
