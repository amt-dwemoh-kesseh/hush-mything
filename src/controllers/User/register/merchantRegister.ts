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
const { userAlreadyExist, createMerchantError } = ERROR_MESSAGE;
const { activateLinkSent } = SUCCESS_MESSAGE;

export const merchantSignUp = async (
  req: Request<{ merchant: Partial<UserRequestBody> }>,
  res: Response,
  next: NextFunction
) => {
  const { email, business_name, password, activated } = req.body;
  const salt = bcrypt.genSaltSync(Number(SALT_VALUE));
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      setError(400, errors.array()[0].msg, res);
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

    } else {
      const merchant = await prisma.user.create({
        data: {
          email,
          business_name,
          password: hashedPassword,
          role: roleType.merchant,
          activated,
        },
      });

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
      setSuccess(res, 200, activateLinkSent + merchant.email);
      return;
    }
  } catch (err) {
    const errorCode = err.statusCode | 500
    setError(errorCode, createMerchantError, res);
    return;
}
}
