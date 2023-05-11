import { mailer } from "../config/mailingConfig";
import { ERROR_MESSAGE, OTHER_MESSAGE, SUCCESS_MESSAGE } from "../constants/message";

const { FRONTEND_BASE_URL } = process.env;

const { mailNotSent } = ERROR_MESSAGE;
const { activateYourAccount, resetYourPassword } = OTHER_MESSAGE;

export const sendActivationMail = async (user, token) => {
  try {
    const { first_name, business_name } = user;
    const recipientName = first_name || business_name;

    const heading = `<p style="font-size: 18px; text-align: left">Hi ${recipientName},</p> <p style="font-size: 18px; text-align: center">Activate your Storefront Account with the link below...</p>.`;

    const subject = activateYourAccount;
    const message = `${FRONTEND_BASE_URL}/auth-success/${user.id}/${token}/`;
    await mailer(user, subject, message, heading);
  } catch (error) {
    console.error(mailNotSent);
  }
};

export const resetPasswordMail = async (user, token) => {
  try {
    const { first_name, business_name } = user;
    const recipientName = first_name || business_name;

        const heading = `<p style="font-size: 18px; text-align: left">Hi ${
			recipientName
            },</p> <p style="font-size: 18px; text-align: center">You recently requested for a password reset. If you were not the one, you can ignore this message. You can click on the link below to reset your StoreFront password...</p>.`;
        
        const subject = resetYourPassword;
        const message = `${FRONTEND_BASE_URL}/resetpw2/${user.id}/`;
        await mailer(user, subject, message, heading);

    } catch (error) {
        console.error(mailNotSent);
    }
}
