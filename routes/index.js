var models = require('../models');
var express = require('express');
var router = express.Router();
var path = require('path');
var logconf = require('winston-config');

var logger = {};

logconf.fromFile(path.join(__dirname, "../config/loggers.json"),
  function (err, winston) {
    if (err) console.log(error);
    else
      logger = winston.loggers.get('http');
  });

router.get('/place', function (req, res) {
  logger.debug('PLACE: GET');

  models.Place.findAll().then(function (places) {
    res.send(JSON.stringify(places));
  }).catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
  });
});

module.exports = router;
