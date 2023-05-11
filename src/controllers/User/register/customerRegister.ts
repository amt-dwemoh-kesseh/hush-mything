import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequestBody, roleType } from "../../../types/userTypes";
import { validationResult } from "express-validator";
import token from "../../../utils/genToken";
import * as bcrypt from "bcryptjs";
import { sendActivationMail } from "../../../utils/mailService";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../../constants/message";
import { setError, setSuccess } from "../../../utils/utils";

const prisma = new PrismaClient();
const { SALT_VALUE } = process.env;

const { userAlreadyExist, createCustomerError } = ERROR_MESSAGE;
const { activateLinkSent } = SUCCESS_MESSAGE;

export const customerSignUp = async (
  req: Request<{ customer: Partial<UserRequestBody> }>,
  res: Response,
  next: NextFunction
) => {

  const { 
    email, 
    first_name, 
    last_name, 
    password, 
    activated 
  }: UserRequestBody = req.body;

  const salt = bcrypt.genSaltSync(Number(SALT_VALUE));
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      setError(401, errors.array()[0].msg, res);
      return;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      setError(401, userAlreadyExist, res);
      return;
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

    setSuccess(res, 200, activateLinkSent + customer.email);
    return;
      
  } catch (err) {
    const errorCode = err.statusCode | 500
    setError(errorCode, createCustomerError, res);
    return;    
  }
};
