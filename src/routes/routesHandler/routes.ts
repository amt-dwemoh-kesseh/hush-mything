import express from "express";
import { userLogin } from "../../controllers/User/login/user.login";
import customerRouter from '../Customer/customer.route';
import businessRoute from '../Business/merchant.route';
import socialRoute from '../Socials/socials.route';

export const approuter = express.Router()

approuter.use('/api/v1/user', customerRouter);
approuter.use('/api/v1/business', businessRoute);
approuter.use('/api/v1/socials', socialRoute);