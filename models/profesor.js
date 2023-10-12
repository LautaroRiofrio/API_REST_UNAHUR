'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profesor = sequelize.define('Profesor', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING
  }, {});
  Profesor.associate = function(models) {
    // associations can be defined here
  };
  return Profesor;
};