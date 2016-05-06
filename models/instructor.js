module.exports = function (sequelize, DataTypes) {
  var Instructor = sequelize.define('Instructor', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    jobs: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    classMethods: {
      associate: function(models) {
        console.log('associate Instructor');
      }
    }
  });

  return Instructor;
}
