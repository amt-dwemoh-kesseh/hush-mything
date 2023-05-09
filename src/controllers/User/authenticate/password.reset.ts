import { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

// initialize prisma client
const prisma = new PrismaClient()

/**
 * Checks that user and user token exist and have correct credentials with id and token
 * @param req Request
 * @param res Response
 * @param next Next 
 * @returns 
 */
export const verifyMyPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    
    
    const { id, password } = req.body;
    
    try {

        const user = await prisma.user.findUnique({
            where: {
               id: id
            }
        })

        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "No user with the ID exist",
            })
        }

        if ( user) {
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            const updatePassword = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashedPassword,
                },
            })

            res.status(200).json({
                success: true,
                message: "Password updated Successfully. You can Log in now"
            })

        }


    } catch (error) {        
        console.log(error);
    }
}