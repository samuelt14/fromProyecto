// backend/config/jwt.js
require('dotenv').config();
module.exports = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN
};
