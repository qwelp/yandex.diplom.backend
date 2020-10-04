const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();
// eslint-disable-next-line no-unused-vars
const NotFoundError = require('../middlewares/errors/not-found-err');
// eslint-disable-next-line no-unused-vars
const ErrorOnTheClientSide = require('../middlewares/errors/on-the-client-side-err');
// eslint-disable-next-line no-unused-vars
const Conflict409 = require('../middlewares/errors/conflict-409');

const configSettings = require('../config/settings');
const configConstants = require('../config/constants');

// eslint-disable-next-line no-unused-vars
const { JWT_SECRET = configSettings.JWT_SECRET } = process.env;

// GET Получить пользователя по id
module.exports.getUser = (req, res, next) => User
  .findOne({ _id: req.user._id })
  .then((user) => {
    if (!user) {
      throw new NotFoundError(configConstants.noUsersFound);
    }

    res.send(user);
  })
  .catch(next);

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000, httpOnly: true });

      res.send({
        token: req.cookies.jwt
      });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

// POST Добавить пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name: namePost,
    email: emailPost,
    password
  } = req.body;
  const passwordArray = password.split('').every((sym) => sym === ' ');

  if (password === ' ' || passwordArray) {
    next(new ErrorOnTheClientSide(configConstants.emptyPassword));
  } else {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({
        name: namePost,
        email: emailPost,
        password: hash
      }))
      .then((user) => {
        res.status(201).send({ _id: user._id });
      })
      .catch((err) => {
        if (err.name === 'MongoError' && err.code === 11000) {
          next(new Conflict409('Conflict409'));
        } else {
          next(new ErrorOnTheClientSide(err.message));
        }
      });
  }
};
