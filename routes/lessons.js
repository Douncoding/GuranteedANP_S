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

router.get('/', function (req, res) {
  logger.debug('LESSON: GET:', req.query);

  models.Lesson.findAll().then(function (lessons) {
    res.send(JSON.stringify(lessons));
  }).catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
  });
});


router.post('/new', function (req, res) {
  logger.debug('LESSON: POST: ', req.body);

  models.Lesson.findOrCreate({
    where : {name: req.body.name},
    defaults: {
      desc: req.body.desc,
      personnel: req.body.personnel,
      pid: req.body.pid,
      iid: req.body.iid
    }
  }).spread(function (lesson, created) {
    if (created) {
      logger.info('강좌생성 완료:', JSON.stringify(lesson));
      res.send(JSON.stringify(lesson));
    } else {
      logger.warn('이미 생성된 강좌:');
      res.status(300).send('already exist lesson');
    }
  });
});

// 강의시간 생성
// 식별자로 안하고 이름으로 한번해봄.. 나중에 문제가 생긴다면 식별자로 변경
// 이름을 사용한이유:
// 이름은 항상 화면에 현시되어 UI 컴포넌트로 부터 값을 가져오기가 매우 쉽지만
// 식별자로 관리하는 경우 내부에서 별도로 리소스의 관리가 필요로 하기 때문에
// 구현을 편리하게 하기위해 한번 UI 값을 사용해 본다.
router.post('/times/:lessonName', function (req, res) {
  logger.debug('LESSON TIME: POST: ', req.body);

  var name = req.params.lessonName;

  var arr = JSON.stringify(req.body);
  arr = JSON.parse(arr);

  models.Lesson.findOne({
    where: {name: name}
  }).then(function (lesson) {
    if (!lesson) {
      res.status(400).send('not found lesson:', name);
    } else {
      for (var i = 0; i < arr.length; i++) {
        models.LessonTime.create({
          day: arr[i].day,
          endDate: arr[i].endDate,
          endTime: arr[i].endTime,
          startDate: arr[i].startDate,
          startTime: arr[i].startTime,
          lid: lesson.id
        }).then(function (lessonTime) {
          logger.info('강의시간 생성 성공:', JSON.stringify(lessonTime));
        }).catch(function (error) {
          logger.error(error);
        });
      }
      res.send(JSON.stringify(arr));
    }
  });
});

// 강의시간 요청
// query: Lesson Name(강의명)
router.get('/times', function (req, res) {
  logger.debug('강의시간 요청: ', req.params, req.query);

  var name = req.query.lessonName;

  models.Lesson.findOne({
    where: {name: name}
  }).then(function (lesson) {
    lesson.getLessonTimes().then(function (times) {
      var message = util.format('%s 시간정보 조회: 개수:%d', name, times.length);
      logger.info(message);
      logger.debug(JSON.stringify(times));
      res.send(JSON.stringify(times));
    });
  }).catch(function (error) {
    logger.error(error);
    res.sendStatus(500);
  });
});

module.exports = router;
