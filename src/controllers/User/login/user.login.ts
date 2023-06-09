import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequestBody } from "../../../types/user.types";
import { validationResult } from "express-validator";
import token from "../../../utils/genToken";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const userLogin = async (
  req: Request<{ merchant: Partial<UserRequestBody> }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const userExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExist) {
      res
        .status(401)
        .json({ message: "Email not registered,SignUp for an account" });
    }
    const userActivated = await prisma.user.findFirst({
      where: {
        email: email,
        activated: true,
      },
    });
    if (!userActivated) {
      return res.status(401).json({ message: "Account not verified!" });
    }
    const compareSuccess = await bcrypt.compareSync(
      password,
      userActivated.password
    );
    if (compareSuccess) {
      res
        .status(200)
        .json({
          message: "Success",
          data: {
            email,
            token: token(userActivated.id),
            role: userActivated.role,
            first_name: userActivated.first_name,
            last_name: userActivated.last_name,
          },
        });
    } else {
      res.status(401).json({ message: "username or password incorrect" });
    }
  } catch (error) {
    throw new Error("Error While logging in");
  }
};
