const jwt =require('jsonwebtoken') ;
require('dotenv/config');

const auth = (req, res, next) => {
  let token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, process.env.token, (error, decoded) => {
      if (error) {
        return res.status(404).json({
          message: 'Token is not valid',
        });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: 'No Token, authorization denied',
      success: false,
    });
  }
};
module.exports = auth;
