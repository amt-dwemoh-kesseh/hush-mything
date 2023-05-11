import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { ErrorWithStatusCode, UserRequestBody } from "../../../types/userTypes";
import { validationResult } from "express-validator";
import token from "../../../utils/genToken";
import * as bcrypt from "bcryptjs";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../../constants/message";
import { setError, setSuccess } from "../../../utils/utils";

const prisma = new PrismaClient();
const { emailNotFound, unverifiedAccount, passwordcompareErr, loginError } = ERROR_MESSAGE;
const { loginSuccess } = SUCCESS_MESSAGE;

export const userLogin = async (
  req: Request<{ merchant: Partial<UserRequestBody> }>,
  res: Response,
  next: NextFunction
) => {
  try {

    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      setError(401, errors.array()[0].msg, res);
      return;
    }

    const userExist = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!userExist) {
      setError(401, emailNotFound, res);
      return;
    }
    const userActivated = await prisma.user.findFirst({
      where: {
        email: email,
        activated: true,
      },
    });

    if (!userActivated) {
      setError(401, unverifiedAccount, res);
      return;
    }

    const compareSuccess = await bcrypt.compareSync(
      password,
      userActivated.password
    );
    
    if (compareSuccess) {
      const data = {
        email,
        first_name: userActivated.first_name,
        last_name: userActivated.last_name,
        business_name: userActivated.business_name,
        token: token(userExist.id),
        role: userActivated.role,
      }
      setSuccess(res, 200, loginSuccess, data)
      return;
    } else {
      setError(401, passwordcompareErr, res);
      return;
    }
  } catch (error) {
    const errorCode = error.statusCode | 500
    setError(errorCode, loginError, res);
    return;
  }
};
