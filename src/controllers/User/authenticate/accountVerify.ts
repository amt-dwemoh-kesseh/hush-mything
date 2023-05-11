import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../../constants/message";
import { setError, setSuccess } from "../../../utils/utils";

const prisma = new PrismaClient();
const { invalidVerifyLink, emailVerifyError } = ERROR_MESSAGE;
const { verifySuccess } = SUCCESS_MESSAGE;

export const verifyMyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const { id, token } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      setError(401, invalidVerifyLink, res);
      return;
    }

    const userToken = await prisma.token.findFirst({
      where: {
        userId: user.id,
        token: token,
      },
    });

    if (!userToken) {
      setError(401, invalidVerifyLink, res);
      return;
    }

    const verifiedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        activated: true,
      },
    });
    
    if (verifiedUser) {
      setSuccess(res, 200, verifySuccess)
      return;
    }
  } catch (error) {
    const errorCode = error.statusCode | 500
    setError(errorCode, emailVerifyError, res);
    return;
  }
};
