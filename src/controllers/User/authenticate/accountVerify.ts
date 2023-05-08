import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifymyAccount = async (
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
      return res.status(401).json({ message: "Invalid link" });
    }

        const userToken = await prisma.token.findFirst({
            where: {
                userId: user.id,
                token:token
            }
        })
        if (!userToken) {
          return res.status(401).json({ message: "Invalid link" });
        }
        return await prisma.user.update({
            where: {
                id:user.id
            },
            data: {
                activated:true
            }
        })

    } catch (error) {
        
        throw new Error('Error whilst verifying!')
    }
  }
