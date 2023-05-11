import { ValidationError } from "express-validator";

export interface UserRequestBody {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  business_name: string;
  role: string;
  activated: boolean;
}

export enum roleType {
  customer = "customer",
  merchant = "merchant",
}
export enum businessType {
  blog = "blog",
  fashion = "ecommerce",
  tech = "finance",
}

export interface ErrorWithStatusCode extends Error{
  statusCode?: number;
  [key: string | number]: any;
};
