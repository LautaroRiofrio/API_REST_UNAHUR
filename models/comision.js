'use strict';
module.exports = (sequelize, DataTypes) => {
  const comision = sequelize.define('comision', {
    nombre: DataTypes.STRING,
    id_materia: DataTypes.INTEGER
  }, {});
  comision.associate = function(models) {
    comision.hasMany(models.comisionAlumno, {foreignKey: 'id_comision'});
    comision.belongsTo(models.materia, {foreignKey: 'id_materia'});
  };
  return comision;
};