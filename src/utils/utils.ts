import { NextFunction, Request, Response } from "express";
import { ErrorWithStatusCode } from "../types/userTypes";
import { STATUS_CODES } from "http";

export const setSuccess = (res: Response, successCode: number, message?: string, data?: any) => {
    res
        .status(successCode)
        .json({
            success: true,
            status: successCode,
            message: message,
            httpMessage: STATUS_CODES[successCode],
            data: data || ""
        })
}

export const setError = (errorCode: number, message: string, res: Response) => {
    const err: ErrorWithStatusCode = {
        statusCode: errorCode,
        message: message,
        name: ""
      }
      errorHandler(err, res);
};

export const errorHandler = (err: ErrorWithStatusCode, res: Response) => {
    const errorCode: number = err.statusCode ? err.statusCode : 500;
    
    res
        .status(errorCode)
        .json({
            success: false,
            status: errorCode,
            message: err.message,
            data: "",
            httpMessage: STATUS_CODES[errorCode]
        })
}