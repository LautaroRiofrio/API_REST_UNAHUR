var express = require("express");
var router = express.Router();
var models = require("../models");

// router.get("/", (req, res) => {
//   console.log("Esto es un mensaje para ver en consola :v");
//   models.materia
//     .findAll({
//       attributes: ["id", "nombre","id_carrera","id_profesor"]
//     })
//     .then(materias => res.send(materias))
//     .catch(() => res.sendStatus(500));
// });

router.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 5;

    const offset = (page - 1) * pageSize;

    const materias = await models.materia.findAll({
      attributes: ['id', 'nombre', 'id_carrera','id_profesor'],
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [['createdAt', 'ASC']],
    });

    res.json(materias);
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.post("/", (req, res) => {
  models.materia
    .create({ nombre: req.body.nombre, id_carrera:req.body.id_carrera, id_profesor:req.body.id_profesor})
    .then(materia => res.status(201).send({ id: materia.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materia con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  models.materia
    .findOne({
      attributes: ["id", "nombre","id_carrera","id_profesor"],
      where: { id }
    })
    .then(materia => (materia ? onSuccess(materia) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findMateria(req.params.id, {
    onSuccess: materia => res.send(materia),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .update({ nombre: req.body.nombre, id_carrera:req.body.id_carrera, id_profesor:req.body.id_profesor}, { fields: ["nombre","id_carrera","id_profesor"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materia con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = materia =>
    materia
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
