var express = require('express');
var app = express();
var router = express.Router();
var experiencia = require('../../models/experiencia_mongo');
var expSchema = require('../../models/experiencia');
var config = require('../../config');
var auth = require('../middleware/auth');
var moment = require('moment')
var multer = require("multer");
var async = require('async')

const sqlConn = require('../../DB/sqlConnection')


router.get('/experiencia', (req, res) => {
  let expId = req.body.id || req.query.id || req.headers['x-access-token'];
  console.log("obteniendo experiencia con ID ", expId)
  let sQuery =
    "SELECT " +
    "destinatario, fecha, experiencias.id as `idExpe`, experiencias.nombre as `nombre_experiencia`, " +
    "experiencias.descripcion as `desc`, " +
    "ambitos.nombre as `nombre_ambito`, " +
    "universidades.nombre as `nombre_uni`, especialidades.nombre as `nombre_especialidad` " +
    "FROM experiencias " +
    "INNER JOIN ambitos on experiencias.ambito_id = ambitos.id " +
    "INNER JOIN especialidades on experiencias.especialidad_id = especialidades.id " +
    "INNER JOIN universidades on experiencias.universidad_id = universidades.id  " +
    "WHERE experiencias.id = " + expId
  sqlConn.pool.query(sQuery, function (err, exp, fields) { //SELECT EXPERIENCIAS
    if (err) res.send(err)
    var experiencia = expSchema;
    experiencia.setExperiencia(exp[0])
    let sQuery = "SELECT coordinadores.id, nombre, email " +
      "FROM coordinadores " +
      "INNER JOIN experiencia_coordinador ON coordinadores.id = experiencia_coordinador.coordinador_id " +
      "WHERE ?";
    sqlConn.pool.query(sQuery, { 'experiencia_id': expId }, function (err, coord, fields) { //SELECT COORDINADORES
      if (err) res.send(err)
      console.log("Coord: ", coord)
      experiencia.setCoordinadores(coord)
      //console.log(experiencia)
      let content = {
        exp: (experiencia),
        success: true,
        message: 'ok'
      };
      res.send(content)
      return
    }) //SELECT coordinadores
  }) //SELECT experiencias
}); //metodo


router.get('/experiencias', (req, res) => {
  let ambitoId = req.body.id || req.query.id || req.headers['x-access-token'];
  console.log("listando experiencias del ambito ", ambitoId)
  //try {
  let sQuery =
    "SELECT " +
    "destinatario, fecha, experiencias.id as `idExpe`, experiencias.nombre as `nombre_experiencia`, " +
    "experiencias.descripcion as `desc`, " +
    "ambitos.nombre as `nombre_ambito`, " +
    "universidades.nombre as `nombre_uni`, especialidades.nombre as `nombre_especialidad` " +
    "FROM experiencias " +
    "INNER JOIN ambitos on experiencias.ambito_id = ambitos.id " +
    "INNER JOIN especialidades on experiencias.especialidad_id = especialidades.id " +
    "INNER JOIN universidades on experiencias.universidad_id = universidades.id  " +
    "WHERE experiencias.ambito_id = " + ambitoId

  sqlConn.pool.query(sQuery, function (err, exp, fields) { //SELECT EXPERIENCIAS
    if (err) {
      console.log("error: ", err)
      let content = {
        success: false,
        message: 'Error listando experiencias',
        err: err
      };
    }
    //TRATAMIENTO DE LA ASINCRONIA: 
    //Por cada fila en exp extrae un element sobre el que realizar las consultas de coordinador y de ficheros multimedia
    //Por medio del waterfall nos aseguramos de tener la estructura de datos comepleta antes de hacer push en el objeto resultado
    var experiencias = [];
    var experiencia = expSchema;
    async.eachSeries(exp, (element, eachCallback) => {
      let sQuery = "SELECT coordinadores.id, nombre, email " +
        "FROM coordinadores " +
        "INNER JOIN experiencia_coordinador ON coordinadores.id = experiencia_coordinador.coordinador_id " +
        "WHERE ?";
      sqlConn.pool.query(sQuery, { 'experiencia_id': element.idExpe }, function (err, coord, fields) { //SELECT COORDINADORES
        if (err) eachCallback(err)
        experiencia.setExperiencia(element)
        experiencia.setCoordinadores(coord)
        experiencias.push(JSON.parse(JSON.stringify(experiencia)))
        eachCallback(null, experiencias)
      }) //sql 
    }, function (err) {
      if (err) res.send(err)
      let content = {
        exp: (experiencias),
        success: true,
        message: 'ok'
      };
      res.send(content)
      return
    }
    ) //EACH
  }) //SELECT EXP
});

router.put('/experiencias', (req, res) => {
  var reqExp = req.body;
  try {
      let campos = {
        nombre: reqExp.nombre,
        destinatario: reqExp.destinatario,
        descripcion: reqExp.descripcion,
        fecha: reqExp.fecha,
        ambito_id: reqExp.ambito.id,
        especialidad_id: reqExp.especialidad.id,
        universidad_id: reqExp.universidad.id
      }
      let sQuery = "UPDATE `experiencias` " +
        "SET ?  WHERE id = " + reqExp.id
        sqlConn.pool.query(sQuery, campos, function (err, exp) { //UPDATE experiencia
          if (err) throw err
        sQuery = "DELETE FROM  `experiencia_coordinador` " +
          "WHERE  ? "
          sqlConn.pool.query(sQuery, { 'experiencia_id': reqExp.id }, function (err, rows) { //DELETE experiencia
            if (err) throw err

          ////////////////RECORRER COORDINADORES ...
          async.eachSeries(reqExp.coordinadores, (element, eachCallback) => {
            //reqExp.coordinadores.forEach(element => {
            sQuery = "SELECT * FROM coordinadores where ? "
            console.log("email vale ", element.email)
            sqlConn.pool.query(sQuery, { 'email': element.email }, function (err, results) { //SELECT COORDINADORES
              console.log("select coordinador")
              if (err) throw err
              if (results == "") { //Se crea el coordinador y la entrada en la tabla intermedia

                sQuery = "INSERT INTO `coordinadores` " +
                  "SET ? "
                campos = {
                  nombre: element.nombre,
                  email: element.email,
                  universidad_id: reqExp.universidad
                }
                sqlConn.pool.query(sQuery, campos, function (err, newCoord, fields) { //INSERTAR COORDINADORES
                  if (err) throw err
                  let coordId = newCoord.insertId
                  sQuery = "INSERT INTO experiencia_coordinador " +
                    "SET ?"
                  campos = {
                    coordinador_id: coordId,
                    experiencia_id: reqExp.id
                  }
                  sqlConn.pool.query(sQuery, campos, function (err, results, fields) { //INSERTAR EXPERIENCIA_COORDINADOR
                    console.log("insertando en tabla experiencia_coordinador 1 ...")
                    if (err) throw err
                    eachCallback(null)
                  })
                })
              } else {//solo la entrada en la tabla intermedia experiencia_coordinador
                console.log("coordinador ya existente. Se asocia en la tabla intermedia: ", results[0])
                sQuery = "INSERT INTO experiencia_coordinador " +
                  "SET ?"
                campos = {
                  coordinador_id: results[0].id,
                  experiencia_id: reqExp.id
                }
                sqlConn.pool.query(sQuery, campos, function (err, results, fields) { //INSERTAR EXPERIENCIA_COORDINADOR
                  console.log("insertando en tabla experiencia_coordinador 2 ...")
                  if (err) throw err
                  eachCallback(null)
                })
              } //else
              
            }) //SELECT COORDINADORES
          }, function (err) {
            console.log("fin de eachseries")
            let content = {
              success: true,
              message: 'ok'
            };
            res.send(content)
            return
          }
          ) //ASYNC EACHSERIES
        })
      })

  } catch (err) {
    console.log("ERROR: ", err)
  }
});


router.post('/experiencias', (req, res) => {
  var reqExp = req.body;
  try {
    sqlConn.inTransaction(sqlConn.pool, function (db, next) {

      let sQuery = "SELECT 1 FROM experiencias where ? "
      db.query(sQuery, { 'nombre': reqExp.nombre }, function (err, rows, fields) { //SELECT experiencia
        if (err) return next(err)
        if (rows != "") {
          console.log("Ya existe la experiencia: ", reqExp.nombre)
          let content = {
            success: false,
            message: 'Ya existe una experiencia con ese nombre. Por favor, compruebe que no la está duplicando o asigne otro nombre'
          };
          res.send(content);
          return;
        }
        //  NO EXISTE LA EXPERIENCIA EN LA BD ->INSERTAR ...
        sQuery = "INSERT INTO `experiencias` " +
          "SET ?"
        let campos = {
          nombre: reqExp.nombre,
          destinatario: reqExp.destinatario,
          descripcion: reqExp.descripcion,
          fecha: reqExp.fecha,
          ambito_id: reqExp.ambito,
          especialidad_id: reqExp.especialidad,
          universidad_id: reqExp.universidad
        }
        db.query(sQuery, campos, function (err, experiencia, fields) { //INSERTANDO EXPERIENCIA
          console.log("experiencia insertada", experiencia.insertId)
          expId = experiencia.insertId

          //RECORRER COORDINADORES ...
          reqExp.coordinadores.forEach(element => {
            sQuery = "SELECT * FROM coordinadores where ? "
            console.log("email vale ", element.email)
            db.query(sQuery, { 'email': element.email }, function (err, results, fields) { //SELECT COORDINADORES
              console.log("select coordinador")
              if (err) return (next)
              if (results == "") { //Se crea el coordinador y la entrada en la tabla intermedia

                sQuery = "INSERT INTO `coordinadores` " +
                  "SET ? "
                campos = {
                  nombre: element.nombre,
                  email: element.email,
                  universidad_id: reqExp.universidad
                }
                db.query(sQuery, campos, function (err, newCoord, fields) { //INSERTAR COORDINADORES
                  if (err) return (next)
                  let coordId = newCoord.insertId
                  sQuery = "INSERT INTO experiencia_coordinador " +
                    "SET ?"
                  campos = {
                    coordinador_id: coordId,
                    experiencia_id: expId
                  }
                  db.query(sQuery, campos, function (err, results, fields) { //INSERTAR EXPERIENCIA_COORDINADOR
                    console.log("insertando en tabla experiencia_coordinador ...")
                    if (err) return (next)
                  })
                })
              } else {//solo la entrada en la tabla intermedia experiencia_coordinador
                console.log("coordinador: ", results[0])
                sQuery = "INSERT INTO experiencia_coordinador " +
                  "SET ?"
                campos = {
                  coordinador_id: results[0].id,
                  experiencia_id: expId
                }
                db.query(sQuery, campos, function (err, results, fields) { //INSERTAR EXPERIENCIA_COORDINADOR
                  console.log("insertando en tabla experiencia_coordinador ...")
                  if (err) return (next)
                })
              } //else
            }) //SELECT COORDINADORES
          }) //foreach COORDINADORES

          return next(err)
        }) //INSERT expe
      }) //SELECT expe
    }, function (err) {
      console.log("All done, transaction ended and connection released");
    });
  } catch (err) {
    console.log("ERROR: ", err)
  }
})

router.post('/experiencias_mongo', (req, res) => {
  var reqExp = req.body;
  // process.nextick nos asegura que la función pasada como parçametro va a ser llamada inmediatamente (en el proximo tick). 
  // con tick se refieren a la siguiente iteracción del "nodejs eventloop".
  // Esto evita condiciones de carrera con otras peticiones de otros usuarios.
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
  //Se borra la experiencia y los archivos multimedia asociados, pero no se borran los coordinadores.
  try {
    let expId = req.body.id || req.query.id || req.headers['x-access-token'];
    sQuery = "DELETE FROM `experiencias` " +
      "WHERE ? "
    console.log("expId vale: ", expId)
    sqlConn.pool.query(sQuery, { 'id': expId }, function (err, deletedExp) { //Eliminar experiencia
      console.log("datos de callback del delete: ", deletedExp)
      if (err) {
        let content = {
          err: err,
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
    })
  } catch (err) {
    console.log("Error en delete: ", err)
  }
});

router.get('/ambitos', (req, res) => {
  let sQuery = "SELECT * FROM ambitos"
  sqlConn.pool.query(sQuery, function (err, rows, fields) { //SELECT QUERY
    if (err) {
      console.log("error: ", err)
      let content = {
        success: false,
        message: 'Error al realizar la petición a la BBDD',
        err: err
      };
    }
    res.status(200).send(rows);
  })
});

router.get('/especialidades', (req, res) => {
  let ambitoId = req.body.id || req.query.id || req.headers['x-access-token'];
  console.log("Especialidades del ambito: ", ambitoId)
  let sQuery = "SELECT * FROM especialidades WHERE ?"
  sqlConn.pool.query(sQuery, { 'ambito_id': ambitoId }, function (err, rows, fields) { //SELECT QUERY
    if (err) {
      console.log("error: ", err)
      let content = {
        success: false,
        message: 'Error al realizar la petición a la BBDD',
        err: err
      };
    }
    res.status(200).send(rows);
  })
});

router.get('/universidades', (req, res) => {
  let sQuery = "SELECT * FROM universidades order by nombre asc"
  sqlConn.pool.query(sQuery, function (err, rows, fields) { //SELECT QUERY
    if (err) {
      console.log("error: ", err)
      let content = {
        success: false,
        message: 'Error al realizar la petición a la BBDD',
        err: err
      };
    }
    res.status(200).send(rows);
  })
});


//Mostrar el siguiente endpoint en contraposición con el anterior para ilustrar el incremento en complejidad a la hora de usar modelos relacionales.

router.get('/experiencias_mongo', (req, res) => {
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


module.exports = router;


