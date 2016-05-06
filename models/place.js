module.exports = function (sequelize, DataTypes) {
  var Place = sequelize.define("Place", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
      classMethods: {
        associate: function(models) {
          console.log('associate place');
        }
      }
  });

  return Place;
};
