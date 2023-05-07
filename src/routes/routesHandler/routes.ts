import express,{Request,Response} from "express";
import { customerRouter } from "../User/customer.route";
import { merchantRouter } from "../User/merchant.route";
import { facebookCustomerRouter } from "../User/stategies/facebook/facebookCustomer.route";
import { googleCustomerRouter } from "../User/stategies/google/googleCustomer.route";


export const router = express.Router()

router.use('/api/customer',customerRouter)
router.use('/api/merchant',merchantRouter)
router.use('/auth/facebook',facebookCustomerRouter)
router.use('/auth/google', googleCustomerRouter)

router.all("*", (req: Request, res: Response): void => {
  res.status(404).send("Not Found");
});
