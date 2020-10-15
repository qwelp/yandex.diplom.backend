const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('2aed608eb8d346bfbc29e2a1fa38a188');

module.exports.getArticlesNewsapiOrg = (req, res, next) => {
  const { q } = req.params;
  const url = `https://newsapi.org/v2/everything?q=${q}`;

  newsapi.v2.topHeadlines({
    q: q,
    country: 'ru'
  }).then(response => {
    res.send(response.articles);
  });
};
