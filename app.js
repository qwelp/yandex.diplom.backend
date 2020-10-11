const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi } = require('celebrate');
const helmet = require('helmet');
const { errors } = require('celebrate');
// eslint-disable-next-line no-unused-vars
const { requestLogger, errorLogger } = require('./middlewares/logger');
// eslint-disable-next-line no-unused-vars
const NotFoundError = require('./middlewares/errors/not-found-err');
const cors = require('cors');
require('dotenv').config();
const {
  usersRouter,
  login,
  createUser
} = require('./routes/users.js');
const articleRouter = require('./routes/articles.js');

const configSettings = require('./config/settings');
const configConstants = require('./config/constants');
const limiter = require('./config/limiter');

// eslint-disable-next-line no-unused-vars
const { PORT = 3000, JWT_SECRET = configSettings.JWT_SECRET } = process.env;

const app = express();
app.use(cors());

var whitelist = ['localhost','http://localhost:8080', 'https://qwelp.github.io']
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200,
  methods: "GET,POST,DELETE",
  credentials: true
}

const auth = require('./middlewares/auth');

mongoose.connect(configSettings.mongoServer, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

app.use(limiter);
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(configConstants.serverCrash);
  }, 0);
});

app.post('/signin', cors(corsOptions), celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  })
}), login);

app.post('/signup', cors(corsOptions), celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(3).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8)
  })
}), createUser);

app.use('/users', auth, usersRouter);
app.use('/articles', auth, articleRouter);

app.use('/', () => new NotFoundError(configConstants.resourceNotFound));

app.use(errorLogger);
app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(PORT);
});
