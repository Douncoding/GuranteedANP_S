
module.exports = function (sequelize, DataTypes) {
  var Lesson = sequelize.define('Lesson', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    desc: {
      type: DataTypes.STRING,
      allowNull: false
    },
    personnel: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        console.log("associate LessonTime");
        Lesson.belongsTo(models.Place, {
          onDelete: "CASCADE",
          foreignKey: {
            name: "pid",
            allowNull: false
          }
        });

        Lesson.belongsTo(models.Instructor, {
          onDelete: "CASCADE",
          foreignKey: {
            name: "iid",
            allowNull: false
          }
        });

        Lesson.hasMany(models.LessonTime, {
          onDelete: "CASCADE",
          foreignKey: {
            name: "lid",
            allowNull: false
          }
        });
      }
    }
  });

  return Lesson;
}
