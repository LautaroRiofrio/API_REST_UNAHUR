var express = require("express");
var router = express.Router();
var models = require("../models");

// router.get("/", (req, res) => {
//   console.log("Esto es un mensaje para ver en consola :v");
//   models.alumno
//     .findAll({
//       attributes: ["id", "nombre", "apellido"]
//     })
//     .then(alumnos => res.send(alumnos))
//     .catch(() => res.sendStatus(500));
// });

router.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 5;

    const offset = (page - 1) * pageSize;

    const alumnos = await models.alumno.findAll({
      attributes: ['id', 'nombre', 'apellido'],
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [['createdAt', 'ASC']],
    });

    res.json(alumnos);
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.post("/", (req, res) => {
  models.alumno
    .create({ nombre: req.body.nombre, apellido: req.body.apellido })
    .then(alumno => res.status(201).send({ id: alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra alumno con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "nombre", "apellido"],
      where: { id }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findAlumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .update({ nombre: req.body.nombre, apellido: req.body.apellido }, { fields: ["nombre","apellido"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra alumno con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
