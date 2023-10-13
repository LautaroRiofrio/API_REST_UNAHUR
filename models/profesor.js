'use strict';
module.exports = (sequelize, DataTypes) => {
  const Profesor = sequelize.define('Profesor', {
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING
  }, {});
  Profesor.associate = function(models) {
    Profesor.hasMany(models.Materia, {foreignKey: 'id_profesor'});
  };
  return Profesor;
};