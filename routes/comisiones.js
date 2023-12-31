var express = require("express");
var router = express.Router();
var models = require("../models");

// router.get("/", (req, res) => {
//   console.log("Esto es un mensaje para ver en consola :v");
//   models.comision
//     .findAll({
//       attributes: ["id", "nombre", "id_materia"]
//     })
//     .then(comisiones => res.send(comisiones))
//     .catch(() => res.sendStatus(500));
// });

router.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = req.query.pageSize || 5;

    const offset = (page - 1) * pageSize;

    const comisiones = await models.comision.findAll({
      attributes: ['id', 'nombre', 'id_materia'],
      limit: parseInt(pageSize),
      offset: parseInt(offset),
      order: [['createdAt', 'ASC']],
    });

    res.json(comisiones);
  } catch (error) {
    console.error('Error en la consulta:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.post("/", (req, res) => {
  models.comision
    .create({ nombre: req.body.nombre, id_materia: req.body.id_materia })
    .then(comision => res.status(201).send({ id: comision.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra comision con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findcomision = (id, { onSuccess, onNotFound, onError }) => {
  models.comision
    .findOne({
      attributes: ["id", "nombre", "id_materia"],
      where: { id }
    })
    .then(comision => (comision ? onSuccess(comision) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findcomision(req.params.id, {
    onSuccess: comision => res.send(comision),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = comision =>
    comision
      .update({ nombre: req.body.nombre, id_materia: req.body.id_materia }, { fields: ["nombre","id_materia"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra comision con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findcomision(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = comision =>
    comision
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findcomision(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
