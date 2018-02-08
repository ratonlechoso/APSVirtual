var express = require('express');
var app = express();
var router = express.Router();
var Experiencia = require('../../models/experiencia');
var config = require('../../config');
var auth = require('../middleware/auth');
var moment = require('moment')
var multer = require("multer");

router.get('/experiencias', (req, res) => {
  console.log("listando experiencias ...")
  Experiencia.find((err, exp) => {
    if (err)
      return done(err);
    if (!exp) return res.status(404).send({ message: `No hay experiencias` })
    let content = {
      exp: exp,
      success: true,
      message: 'ok'
    };
    res.send(content)
    return
  })
});


router.post('/experiencias', (req, res) => {

  var reqExp = req.body;
  // process.nextick nos asegura que la función pasada como parçametro va a ser llamada inmediatamente (en el proximo tick). 
  // con tick se refieren a la siguiente iteracción del "nodejs eventloop"
  process.nextTick(() => {

    //Busqueda insensitiva del nombre de la experiencia
    Experiencia.findOne({ 'nombre': { $regex: new RegExp(reqExp.nombre, "i") } }, (err, exp) => {
      if (err)
        return done(err);
      if (exp) {
        let content = {
          success: false,
          message: 'Ya existe una experiencia con ese nombre. Por favor, compruebe que no la está duplicando o asigne otro nombre'
        };
        res.send(content);
        return;
      } else {
        var newExp = new Experiencia(reqExp);
        console.log(newExp) //Se asigna directamente el JSON al documento Mongoose a través del constructor.

        newExp.save((err) => {
          if (err)
            throw err;
          let content = {
            exp: newExp,
            success: true,
            message: 'ok'
          };
          res.send(content);
          return;
        })
      }
    })
  })
});

router.delete('/experiencias', (req, res) => {
  let expId = req.body._id || req.query._id || req.headers['x-access-token'];
  Experiencia.remove({
    _id: expId
  }, (err, exp) => {
    if (err) {
      let content = {
        err:err,
        success: false,
        message: 'Error borrando experiencia'
      };
      res.send(content)
    }
    let content = {
      success: true,
      message: 'Borrada correctamente'
    };
    res.send(content);
    return;
  });
});


module.exports = router;
