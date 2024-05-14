const Joi = require("@hapi/joi");

const LoginValidation = (data) => {
    const Schema = Joi.object({
      email: Joi.string().required().email().min(3),
      motDePasse: Joi.string().required().min(3),
    });
  
    return Schema.validate(data);
  };
  //-----------------------------------------------------
  module.exports = {
  
    LoginValidation
    
  };
  