import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { UserRequestBody } from "../../../types/userTypes";
import { validationResult } from "express-validator";
import token from "../../../utils/genToken";
import { resetPasswordMail } from "../../../utils/mailService";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../../constants/message";
import { setError, setSuccess } from "../../../utils/utils";

const prisma = new PrismaClient();
const { emailNotFound, unverifiedAccount, passwordResetError } = ERROR_MESSAGE;
const { passwordResetLinkSent } = SUCCESS_MESSAGE;

export const sendResetPasswordMail = async (
  req: Request<{ merchant: Partial<UserRequestBody> }>,
  res: Response,
  next: NextFunction
) => {
  try {

    const { email } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      setError(400, errors.array()[0].msg, res);
      return;
    }

    const customerExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!customerExist) {
      setError(401, emailNotFound, res);
      return;
    }

    const customerActivated = await prisma.user.findFirst({
      where: {
        email: email,
        activated: true,
      },
    });

    if (!customerActivated) {
      setError(401, unverifiedAccount, res);
      return;

    } else {
      resetPasswordMail(customerExist, token(customerExist.id));

      setSuccess(res, 200, passwordResetLinkSent + customerExist.email)
      return;
    }
  } catch (error) {
    const errorCode = error.statusCode | 500
    setError(errorCode, passwordResetError, res);
    return;
  }
};
