var express = require('express');
var logger = require('../lib/logger');

var router = express.Router();

/* GET home page. */
router.get('*', function(req, res, next) {
  logger.info(req.baseUrl);
  res.render('index', { title: 'Meet' });
});

module.exports = router;
