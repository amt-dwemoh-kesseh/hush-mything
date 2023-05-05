import * as jwt from 'jsonwebtoken'

 
const { JWT_SECRET, TOKEN_EXPIRATION } = process.env;

const token = (id)=>  {
    return jwt.sign( {id}, JWT_SECRET, {
        expiresIn:TOKEN_EXPIRATION
    })
}

export default token