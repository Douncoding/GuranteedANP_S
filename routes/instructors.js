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
  logger.debug('INSTRUCTOR: Login:');

  var email = req.params.email;
  var password = req.query.password;

  logger.info("Login Request email:%s password:%s", email, password);
  if (email == null || password == null) {
    res.status(400).send('invalide params');
    return;
  }

  models.Instructor.findOne({
    where: {
      email: email,
      password: password
    },
    attribute: ['id', 'name', 'jobs', 'email', 'phone']
  }).then(function (instructor) {
    res.send(JSON.stringify(instructor));
  }).catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
  });
});

router.get('/all', function (req, res) {
  logger.debug('모든 강사목록 로딩:', req.query);

  models.Instructor.findAll({
    attribute: ['id', 'name', 'jobs', 'email', 'phone']
  }).then(function (instructor) {
    res.send(JSON.stringify(instructor));
  }).catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
  });
});

router.get('/:id', function (req, res) {
  logger.info('강사조회: 번호:', req.query);

  models.Instructor.findById(req.params.id).then(function (instructor) {
    res.send(JSON.stringify(instructor));
  }).catch(function (error) {
    logger.errror(error);
    res.sendStatus(500);
  });
});

module.exports = router;
