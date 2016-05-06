var fs = require('fs');
var path = require('path');
var appconf = require('./config/app.json')['development'];
var logconf = require('winston-config');
var models = require('./models');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Router Group
var router = require('./routes/index');
var instructors = require('./routes/instructors.js');
var students = require('./routes/students.js');
var lessons = require('./routes/lessons.js');
var enrollments = require('./routes/enrollments.js');
var attendances = require('./routes/attendances.js');

var logger = {};

logconf.fromFile(path.join(__dirname, './config/loggers.json'),
  function (error, winston) {
      if (error) {
        console.log(error);
      } else {
        logger = winston.loggers.get('application');
      }
  });

app.set('port', process.env.PORT || appconf.port);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', router);
app.use('/instructors', instructors);
app.use('/lessons', lessons);
app.use('/students', students);
app.use('/enrollments', enrollments);
app.use('/attendances', attendances);

models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function() {
    logger.info('Guranteed ANP server listening on port '
                  + server.address().port);
  });
});
