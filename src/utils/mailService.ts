import { Mailer } from "../config/mailingConfig";

const {BASE_URL} = process.env

export const sendActivationMail = async (user, token) => {
    
    try {

        const { first_name, business_name } = user
        const recipientName = first_name || business_name

        const heading = `<p style="font-size: 18px; text-align: left">Hi ${
			recipientName
            },</p> <p style="font-size: 18px; text-align: center">Activate your Storefront Account with the link below...</p>.`;
        
        const subject = `Activate Your Storefront Account`;
        const message = `${BASE_URL}/verify/${user.id}/${token}`;
        await Mailer(user, subject, message, heading)
        
    } catch (error) {
        throw new Error('Error Sending Mail')
    }

}

