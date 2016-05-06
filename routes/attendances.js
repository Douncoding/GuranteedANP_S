var models = require('../models');
var express = require('express');
var router = express.Router();
var path = require('path');
var util = require('util');
var logconf = require('winston-config');

var logger = {};

logconf.fromFile(path.join(__dirname, "../config/loggers.json"),
  function (err, winston) {
    if (err) console.log(error);
    else
      logger = winston.loggers.get('http');
  });


// 출석조회
//
router.get('/student/:sid/lesson/:lid', function (req, res) {
  logger.debug('출석목록 조회:', req.params, req.query);

  var studentId = req.params.sid;
  var lessonId = req.params.lid;

  if (studentId <= 0 || lessonId <= 0) {
    logger.warn('잘못된 매개변수 수신: 학생번호:', studentId, "강의번호:", lessonId);
    return;
  }

  models.Attendance.findAll({
    include: [{
      model: models.Enrollment,
      where: {sid: studentId, lid:lessonId},
    }]
  }).then(function (instances) {
    var result = new Array();

    var message = util.format('(학생:%d 강의:%d)의 출석목록 개수:%d',
      studentId, lessonId, instances.length);
    logger.info(message);

    for (var i = 0; i < instances.length; i++) {
      result.push(instances[i]);
    }

    res.send(JSON.stringify(result));
  }).catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
  })
});


module.exports = router;
