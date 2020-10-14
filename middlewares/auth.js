const jwt = require('jsonwebtoken');
require('dotenv').config();

const configSettings = require('../config/settings');
const configConstants = require('../config/constants');

// eslint-disable-next-line no-unused-vars
const { JWT_SECRET = configSettings.JWT_SECRET } = process.env;

function handleAuthError(res) {
  return res
    .status(401)
    .send({ message: configConstants.needLogin });
}

module.exports = (req, res, next) => {
  //const token = req.cookies.jwt;

  const { authorization } = req.headers;

  let token;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    if(req.cookies.jwt) {
      token = req.cookies.jwt;
    } else {
      return res
        .status(401)
        .send({ message: 'Необходима авторизация' });
    }
  }

  token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    handleAuthError(res);
  }

  req.user = payload;

  next();
};
