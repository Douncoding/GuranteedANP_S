
module.exports = function (sequelize, DataTypes) {
  var LessonTime = sequelize.define("LessonTime", {
    day: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    startDate:  {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        console.log("associate LessonTime");
        LessonTime.belongsTo(models.Lesson, {
          onDelete: "CASCADE",
          foreignKey: {
            name: "lid",
            allowNull: false
          }
        });
      }
    }
  });

  return LessonTime;
}
