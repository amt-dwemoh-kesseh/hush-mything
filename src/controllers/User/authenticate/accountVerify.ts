import express, { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const verifymyAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id, token } = req.body;
  try {
    let isTokenValid: boolean;
        
    // verify jwt token
    await jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        if (err) {
            res
              .status(400)
              .json({
                success: false,
                message: "Token verification failed. Contact the Storefront Administrator"
            })
        }
        isTokenValid = true;
    });
    const user = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return res
                .status(401)
                .json({
                  success: false,
                  message: "Broken Link. Contact the Storefront Administrator"
              })
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
          res
            .status(200)
            .json({
              success: true, 
              message: 'Authentication Succesful'
            })            
      }
     
    
  }catch (error) {
    res
      .status(401)
      .json({
          success: false,
          message: "Broken Link. Contact the Storefront Administrator"
    })
  }
}
