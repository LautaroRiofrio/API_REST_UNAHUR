'use strict';
module.exports = (sequelize, DataTypes) => {
  const Materia = sequelize.define('Materia', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER,
    id_profesor: DataTypes.INTEGER
  }, {});
  Materia.associate = function(models) {
    Materia.belongsTo(models.Profesor, {foreignKey: 'id_profesor'});
    Materia.belongsTo(models.carrera, {foreignKey: 'id_carrera'});
  };
  return Materia;
};