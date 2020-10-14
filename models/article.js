const validator = require('validator');
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minlength: 2
  },
  title: {
    type: String,
    required: true,
    minlength: 2
  },
  text: {
    type: String,
    required: true,
    minlength: 2
  },
  date: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true,
    minlength: 2
  },
  link: {
    type: String,
    validate: validator.isURL,
    required: [true, 'Ссылка не валидна!']
  },
  image: {
    type: String,
    validate: validator.isURL,
    required: [true, 'Ссылка не валидна!']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

module.exports = mongoose.model('article', articleSchema);
