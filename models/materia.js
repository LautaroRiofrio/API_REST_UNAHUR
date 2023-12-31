'use strict';
module.exports = (sequelize, DataTypes) => {
  const materia = sequelize.define('materia', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER,
    id_profesor: DataTypes.INTEGER
  }, {});
  materia.associate = function(models) {
    materia.hasMany(models.comision, {foreignKey: 'id_materia'});
    materia.belongsTo(models.profesor, {foreignKey: 'id_profesor'});
    materia.belongsTo(models.carrera, {foreignKey: 'id_carrera'});
  };
  return materia;
};