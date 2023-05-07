import express,{Request,Response} from "express";
import { userLogin } from "../../controllers/User/login/user.login";
import { customerRouter } from "../User/customer.route";
import { merchantRouter } from "../User/merchant.route";
import { facebookCustomerRouter } from "../User/stategies/facebook/facebookCustomer.route";
import { googleCustomerRouter } from "../User/stategies/google/googleCustomer.route";


export const approuter = express.Router()


approuter.use('/api/user/login',userLogin)
approuter.use(customerRouter)
approuter.use(merchantRouter)
approuter.use(facebookCustomerRouter)
approuter.use(googleCustomerRouter)
