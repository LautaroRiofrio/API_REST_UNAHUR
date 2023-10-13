'use strict';
module.exports = (sequelize, DataTypes) => {
  const comisionAlumno = sequelize.define('comisionAlumno', {
    nombre: DataTypes.STRING,
    id_alumno: DataTypes.INTEGER,
    id_comision: DataTypes.INTEGER
  }, {});
  comisionAlumno.associate = function(models) {
    comisionAlumno.belongsTo(models.comision, {foreignKey: 'id_comision'});
    comisionAlumno.belongsTo(models.alumno, {foreignKey: 'id_alumno'});
  };
  return comisionAlumno;
};