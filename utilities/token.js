const jwt = require('jsonwebtoken');
const User = require('../models/user');

const createToken = async function(user){

    try{

        const _id = user._id;

        const payload = {
            sub: _id,
            iat: new Date().getTime(),
        }

        const options = {
            expiresIn: '1h',
        }
        
        const token = await jwt.sign(payload, process.env.SECRET_KEY, options);
        return token;
    }
    catch(error){
     console.log("Error in creating Token", error);
     return error;
    }
}


const verifyToken = async function(token){

    try {
        if(!token) return false;
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        return decode;
    } catch (error) {
        console.log(error);
        return error;
    }

}



 module.exports = {
    createToken,
    verifyToken
 }