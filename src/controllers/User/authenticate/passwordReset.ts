import { NextFunction, Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcryptjs';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../../constants/message";
import { setError, setSuccess } from "../../../utils/utils";

const prisma = new PrismaClient()
const { userIdNotFound, passwordResetError } = ERROR_MESSAGE;
const { passwordUpdateSuccess } = SUCCESS_MESSAGE;

export const verifyMyPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    
    
    const { id, password } = req.body;
    
    try {

        const user = await prisma.user.findUnique({
            where: {
               id: id
            }
        })
        
        if (!user) {
            setError(401, userIdNotFound, res);
            return;
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

            setSuccess(res, 200, passwordUpdateSuccess)
            return;

        }

    } catch (error) {        
        const errorCode = error.statusCode | 500
        setError(errorCode, passwordResetError, res);
        return;
    }
}