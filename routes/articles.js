const router = require('express').Router();
// eslint-disable-next-line no-unused-vars
const { celebrate, Joi } = require('celebrate');
const {
  getArticles,
  createArticle,
  deleteArticle
} = require('../controllers/articles');

router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required().min(2).max(30),
    title: Joi.string().required().min(2).max(30),
    text: Joi.string().required().min(2),
    date: Joi.string().required().min(2),
    source: Joi.string().required().min(2),
    link: Joi.string().required().pattern(/((http|https):\/\/)?(www.)?([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|[a-z0-9-]+\.[a-z]+[a-z]+?)(:[0-9]{2,5})?([a-z/]+)?#?/),
    image: Joi.string().required().pattern(/((http|https):\/\/)?(www.)?([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|[a-z0-9-]+\.[a-z]+[a-z]+?)(:[0-9]{2,5})?([a-z/]+)?#?/)
  })
}), createArticle);

router.delete('/:articleId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex()
  })
}), deleteArticle);

module.exports = router;
