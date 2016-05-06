
module.exports = function (sequelize, DataTypes) {
  var Enrollment = sequelize.define('Enrollment', {
    date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.NOW
    }
  }, {
    classMethods: {
      associate: function(models) {
        console.log('associate Enrollment:');
        Enrollment.belongsTo(models.Student, {
          onDelete: "CASCADE",
          foreignKey: {
            name: "sid",
            allowNull: false
          }
        });

        Enrollment.belongsTo(models.Lesson, {
          onDelete: "CASCADE",
          foreignKey: {
            name: "lid",
            allowNull: false
          }
        });

      }
    }
  });

  return Enrollment;
}
