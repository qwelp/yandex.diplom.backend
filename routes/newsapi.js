const router = require('express').Router();
const {
  getArticlesNewsapiOrg
} = require('../controllers/newsapi');

router.get('/:q', getArticlesNewsapiOrg);

module.exports = router;
