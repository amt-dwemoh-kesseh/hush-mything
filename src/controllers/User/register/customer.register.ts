import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequestBody, roleType } from "../../../types/user.types";
import { validationResult } from "express-validator";
import token from "../../../utils/genToken";
import * as bcrypt from "bcryptjs";
import { sendActivationMail } from "../../../utils/mailService";

const prisma = new PrismaClient();
const { SALT_VALUE} = process.env

export const customerSignIn = async (
  req: Request<{ customer: Partial<UserRequestBody> }>,
  res: Response,
  next: NextFunction
) => {
  const {
    email,
    first_name,
    last_name,
    password,
    activated,
  }: UserRequestBody = req.body;
  const salt = bcrypt.genSaltSync(Number(SALT_VALUE));
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      return res.status(401).json({
        message: "Email already has an account, please Login",
      });
    }

    const customer = await prisma.user.create({
      data: {
        email,
        first_name,
        last_name,
        password: hashedPassword,
        role: roleType.customer,
        activated,
      },
    });

    const customerToken = await prisma.token.create({
      data: {
        userId: customer.id,
        token: token(customer.id),
      },
    });

    sendActivationMail(customer, token(customer.id));

    res.status(201).json({success:true,
      message: `You should receive an email shortly. Activate your account with the link sent to ${customer.email}`,
        });
    next();
  } catch (err) {
    console.error(err);
    res
      .status(501)
      .json({ message: "An error occured whilst creating cutomer profile" });
  }
};
