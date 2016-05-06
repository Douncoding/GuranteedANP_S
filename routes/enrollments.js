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

// 수강신청
router.post('/lessons/:lid/students/:sid', function (req, res) {
  logger.debug('수강신청:', req.body, req.params);

  var lessonId = req.params.lid;
  var studentId = req.params.sid;

  if (lessonId <= 0 || studentId <= 0) {
    logger.warn('유효하지 않음 식별자 값 발생:');
    return;
  }

  models.Enrollment.findOrCreate({
    where: {lid: lessonId, sid: studentId},
    defaults: {date: models.Sequelize.NOW}
  }).spread(function (instance, created) {
      if (created) {
        var message = util.format('학생번호:%d 강의번호:%d 수강신청 성공'
          , studentId, lessonId);

        logger.info(message);
        res.send(message);
      } else {
        var message = util.format('학생번호:%d 강의번호:%d 수강신청 실패: 이미 신청됨'
          , studentId, lessonId);

        logger.warn(message);
        res.status(400).send(message);
      }
  });
});

//수강취소
router.delete('/lessons/:lid/students/:sid', function (req, res) {
  logger.debug('수강취소:', req.body, req.params);

  var lessonId = req.params.lid;
  var studentId = req.params.sid;

  if (lessonId <= 0 || studentId <= 0) {
    logger.warn('유효하지 않음 식별자 값 발생:');
    return;
  }

  models.Enrollment.findOne({
    where: {lid: lessonId, sid: studentId}
  }).then(function (instance) {
    var message = util.format('학생번호:%d 강의번호:%d 수강취소 성공');

    instance.destroy();

    logger.info(message);
    res.status(200).send(message);
  }).catch(function (err) {
    logger.error(err);
    res.sendStatus(500);
  });
});


// 학생목록
// 강사가 강의의 수강생 목록을 조회하기 위해 요청
router.get('/lesson/:lid', function (req, res) {
  logger.debug('수강생 목록 조회: ', req.params, req.query);

  var lessonId = req.params.lid;

  models.Enrollment.findAll({
    include: [{
      model: models.Student
    }],
    where: {lid: lessonId}
  }).then(function (enrollments) {
    logger.info('조회된 수강생 수:', enrollments.length);

    var students = new Array();
    for (var i = 0; i < enrollments.length; i++) {
      students.push(enrollments[i].Student);
    }
    res.send(JSON.stringify(students));
  }).catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
  });
});

// 수강목록 조회
// 학생이 자신의 수강목록을 알기 위해 요청
router.get('/', function (req, res) {
  logger.debug('수강목록: ', req.params, req.query);

  var studentId = req.query.sid;
  if (studentId <= 0) {
    logger.warn('유요하지 않은 식별자 값 발생:');
    return ;
  }

  models.Enrollment.findAll({
    include: [{
      model: models.Lesson,
    }],
    where: {sid: studentId}
  }).then(function (instances) {
    var lessons = new Array();
    var message = util.format("수강목록 조회성공: 학생번호:%d 개수:%d",
      studentId, instances.length);

    for (var i = 0; i < instances.length; i++) {
      lessons.push(instances[i].Lesson);
    }

    res.send(JSON.stringify(lessons));
  }).catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
  });
});

module.exports = router;
