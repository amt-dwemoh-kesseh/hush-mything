import express from "express";
import googleCustomerRouter from "./strategies/google/googleCustomer.route";
import googleBusinessRouter from "./strategies/google/googleMerchant.route";
import facebookCustomerRouter from "./strategies/facebook/facebookCustomer.route";
import facebookBusinessRouter from "./strategies/facebook/facebookMerchant.route";

const socialsRoute = express.Router();

socialsRoute.use("/customer/facebook", facebookCustomerRouter);
socialsRoute.use("/customer/google", googleCustomerRouter);

socialsRoute.use("/business/facebook", facebookBusinessRouter);
socialsRoute.use("/business/google", googleBusinessRouter);

export default socialsRoute;