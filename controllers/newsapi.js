const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('2aed608eb8d346bfbc29e2a1fa38a188');

module.exports.getArticlesNewsapiOrg = (req, res, next) => {
  const { q } = req.params;

  const date = new Date();

  console.log(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`);

  newsapi.v2.everything({
    q: q,
    from: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  }).then(response => {
    res.send(response.articles);
  });
};
