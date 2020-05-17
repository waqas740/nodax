'use strict';
const router = require('express').Router();
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Nodax' });
});

module.exports = { prefix: "/", router };
