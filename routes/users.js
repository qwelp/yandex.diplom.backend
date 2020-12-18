const usersRouter = require('express').Router();
const { getUser, login, createUser } = require('../controllers/users');

usersRouter.get('/me', getUser);

module.exports = {
  usersRouter,
  login,
  createUser
};
