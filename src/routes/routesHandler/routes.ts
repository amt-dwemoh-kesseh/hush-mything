import express from "express";
import { customerRouter } from "../User/customerRoute";
import { merchantRouter } from "../User/merchantRoute";
import { facebookCustomerRouter } from "../User/stategies/facebookCustomerRoute";
import { googleCustomerRouter } from "../User/stategies/googleCustomerRoute";
import { loginRouter } from "../User/userLogin";

export const appRouter = express.Router();

appRouter
        .use(loginRouter)
        .use(customerRouter)
        .use(merchantRouter)
        .use(facebookCustomerRouter)
        .use(googleCustomerRouter);
