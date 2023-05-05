import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequestBody } from "../../../types/user.types";
import { validationResult } from "express-validator";
import token from "../../../utils/genToken";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const customerLogin = async (
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

    const customerExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!customerExist) {
      res
        .status(501)
        .json({ message: "Email not registered,SignUp for an account" });
    }
    const customerActivated = await prisma.user.findFirst({
      where: {
        email: email,
        activated: true,
      },
    });
    if (!customerActivated) {
      return res.status(501).json({ message: "Account not verified!" });
    }
    const compareSuccess = await bcrypt.compareSync(
      password,
      customerActivated.password
    );
    if (compareSuccess) {
      return res
        .status(200)
        .json({ message: "Success", customerActivated: { email, token } });
    } else {
      return res.status(501).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    throw new Error("Error While logging in");
  }
};
