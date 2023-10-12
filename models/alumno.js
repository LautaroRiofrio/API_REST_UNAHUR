'use strict';
module.exports = (sequelize, DataTypes) => {
  const Alumno = sequelize.define('Alumno', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING
  }, {});
  Alumno.associate = function(models) {
    // associations can be defined here
  };
  return Alumno;
};