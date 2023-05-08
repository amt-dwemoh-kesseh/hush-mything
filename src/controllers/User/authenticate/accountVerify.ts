import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export const verifymyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, token } = req.params;
  try {
    let isTokenValid: boolean;
    await jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(400).json({
          status: false,
          message: "token verification failed",
          stack: process.env.NODE_ENV == "development" ? err.stack : [],
        });
      }
      isTokenValid = true;
    });
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid link!" });
    }
    if (user && isTokenValid) {
      const verifiedUser = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          activated: true,
        },
      });
      if (verifiedUser) {
        res
          .status(200)
          .json({
            success: true,
            verifiedToken: token,
            message: "Sucessfully verified",
          });
      }
    }
  } catch (error) {
    throw new Error("Error whilst verifying!");
  }
};
