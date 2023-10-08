const Joi = require('joi');


const userValidationSchema = Joi.object({

    username : Joi.string().required(),
    email : Joi.string().email().required(),
    password : Joi.string().required(),

})


const productValidationSchema = Joi.object({
    name : Joi.string().required(),
    image : Joi.string().required(),
    price : Joi.number().required().min(0),
    description : Joi.string().required(),
    quantity : Joi.number().min(0),
})


module.exports = {
    userValidationSchema, 
    productValidationSchema,
};
