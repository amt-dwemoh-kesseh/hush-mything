import { Mailer } from "../config/mailingConfig";

const { FRONTEND_BASE_URL } = process.env;

export const sendActivationMail = async (user, token) => {
  try {

        const { first_name, business_name } = user
        const recipientName = first_name || business_name

        const heading = `<p style="font-size: 18px; text-align: left">Hi ${
			recipientName
            },</p> <p style="font-size: 18px; text-align: center">Activate your Storefront Account with the link below...</p>.`;
        
        const subject = `Activate Your Storefront Account`;
        const message = `${FRONTEND_BASE_URL}/auth-success/${user.id}/${token}/`;
        await Mailer(user, subject, message, heading)
        
    } catch (error) {
        console.error('Error Sending Mail')
    }

}

export const resetPasswordMail = async (user, token) => {
  try {
    const { first_name, business_name } = user;
    const recipientName = first_name || business_name;

        const heading = `<p style="font-size: 18px; text-align: left">Hi ${
			recipientName
            },</p> <p style="font-size: 18px; text-align: center">You recently requested for a password reset. If you were not the one, you can ignore this message. You can click on the link below to reset your StoreFront password...</p>.`;
        
        const subject = `Reset Your Storefront Account Password`;
        const message = `${FRONTEND_BASE_URL}/resetp2/${user.id}/${token}`;
        await Mailer(user, subject, message, heading);

    } catch (error) {
        throw new Error('Error sending password reset mail')
    }
}

