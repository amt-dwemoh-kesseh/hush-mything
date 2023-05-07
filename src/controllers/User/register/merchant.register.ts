import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequestBody, roleType } from "../../../types/user.types";
import { validationResult } from "express-validator";
import token from "../../../utils/genToken";
import * as bcrypt from "bcryptjs";
import { sendActivationMail } from "../../../utils/mailService";

const prisma = new PrismaClient();
const { SALT_VALUE } = process.env;

export const merchantSignIn = async (
  req: Request<{ merchant: Partial<UserRequestBody> }>,
  res: Response,
  next: NextFunction
) => {
  const { email, business_name, password, activated, businesType } = req.body;
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
         res.status(401).json({
           message: "Email already has an account, please Login",
         }); 
    } else {
      const merchant = await prisma.user.create({
      data: {
        email,
        business_name,
        password: hashedPassword,
        role: roleType.merchant,
        activated,
      },
      })
      
       const NewBusiness = await prisma.business.create({
      data: {
        business_name: merchant.business_name,
        userId: merchant.id,
              },
       });
      
      const merchantToken = await prisma.token.create({
      data: {
        userId: merchant.id,
        token: token(merchant.id),
      },
      });
      sendActivationMail(merchant, token(merchant.id));
      res.status(201).send({
      message: `Activate your account with the link sent to ${merchant.email}`,
    });
      }
        
  } catch (err) {
    console.error(err);
    res
      .status(501)
      .json({ message: "An error occured whilst creating merchant profile" });
  }
};
