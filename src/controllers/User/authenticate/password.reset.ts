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
    
    // recieve id, token, and new password
    const { id, token, password } = req.body;
    
    try {

        let isTokenValid: boolean;
        
        // verify jwt token
        await jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                res.status(400).json({
                    status: false,
                    message: "token verification failed",
                    stack: process.env.NODE_ENV == "development" ? err.stack :  []
                })
            }
            isTokenValid = true;
        });

        // fetch user with an ID
        const user = await prisma.user.findUnique({
            where: {
               id: id
            }
        })

        // CASE user does not exist
        if (!user) {
            return res.status(401).json({
                status: false,
                message: "No user with the ID exist",
            })
        }

        // user exists and token is valid
        if (isTokenValid && user) {

            // hash password with bcrypt
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // update the password
            const updatePassword = await prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    password: hashedPassword,
                },
            })

            res.status(200).json({
                status: "ok",
                message: "Password updated Successfully. You can Log in now"
            })

        }


    } catch (error) {        
        console.log(error);
    }
}