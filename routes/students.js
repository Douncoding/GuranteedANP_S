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

router.get('/:email/login', function (req, res) {
  logger.debug('STUDENT GET: ', req.query, req.params);

  var email = req.params.email;
  var password = req.query.password;

  logger.info("Login Request email:%s password:%s", email, password);
  if (email == null || password == null) {
    res.status(400).send('invalide params');
    return;
  }

  models.Student.findOne({
    where: {
      email: email,
      password: password
    },
    attribute: ['id', 'name', 'email', 'phone']
  }).then(function (student) {
    res.send(JSON.stringify(student));
  }).catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
  });
});

module.exports = router;
