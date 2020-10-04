const configConstants = require('../config/constants');
const Article = require('../models/article');

// eslint-disable-next-line no-unused-vars
const ServerError = require('../middlewares/errors/server-err');
// eslint-disable-next-line no-unused-vars
const NotFoundError = require('../middlewares/errors/not-found-err');
// eslint-disable-next-line no-unused-vars
const NotRights = require('../middlewares/errors/not-rights');

// GET Все карточки
module.exports.getArticles = (req, res, next) => {
  Article.find({})
    .then((user) => {
      if (!user) {
        throw new ServerError(configConstants.noUsersFound);
      }

      res.send({ data: user });
    })
    .catch(next);
};

// POST добавить карточку
module.exports.createArticle = (req, res, next) => {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner
  })
    .then((article) => {
      if (!article) {
        throw new NotFoundError(configConstants.failedCreateCard);
      }

      res.send({ data: article });
    })
    .catch(next);
};

// DELETE Удалить карточку
module.exports.deleteArticle = (req, res, next) => {
  const { articleId } = req.params;

  Article
    .findOne({ _id: articleId })
    .then((article) => {
      if (!article) {
        throw new NotFoundError(configConstants.noCart);
      } else if (String(article.owner) === req.user._id) {
        Article.deleteOne({ _id: articleId })
          .then(() => {
            res.send({ data: article });
          });
      } else {
        throw new NotRights(configConstants.deleteYourCard);
      }
    })
    .catch(next);
};
