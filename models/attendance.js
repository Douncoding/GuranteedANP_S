
module.exports = function (sequelize, DataTypes) {
  var Attendance = sequelize.define('Attendance', {
    state: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    enterTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    exitTiem: {
      type: DataTypes.DATE,
      allowNUll: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        console.log('associate Attendance');
        Attendance.belongsTo(models.Enrollment, {
          onDelete: "CASCADE",
          foreignKey: {
            name: "eid",
            allowNull: false
          }
        });
      }
    },
    createdAt: false,
    updatedAt: false
  });

  return Attendance;
}
