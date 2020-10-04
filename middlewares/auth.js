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
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    handleAuthError(res);
  }

  req.user = payload;

  next();
};
