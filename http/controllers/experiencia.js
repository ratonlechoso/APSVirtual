var express = require('express');
var app = express();
var router = express.Router();
var experiencia = require('../../models/experiencia_mongo');
var expSchema = require('../../models/experiencia');
var config = require('../../config');
//var fileManage = require('../../tools/fileManage');
var auth = require('../middleware/auth');
var moment = require('moment')
var multer = require("multer");
var async = require('async')
var fs = require('fs');
const sqlConn = require('../../DB/sqlConnection')


router.get('/images', (req, res) => {
  let expId = req.body.id || req.query.id || req.headers['x-access-token'];
  console.log("obteniendo Imagenes de la experiencia ID ", expId)
  let images = []
  let sQuery =
    "SELECT nombre_fichero FROM adjuntos " +
    "WHERE experiencia_id = " + expId
  sqlConn.pool.query(sQuery, function (err, adjuntos, fields) { //SELECT IMAGES
    console.log("PASA")
    if (err) {
      console.log("ERROR: ", err)
      res.send(err)
      return;
    }
    res.send({ status: "OK", ficheros: adjuntos })
    return;
  })
})

router.get('/experiencia', (req, res) => {
  let expId = req.body.id || req.query.id || req.headers['x-access-token'];
  console.log("obteniendo experiencia con ID ", expId)
  let sQuery =
    "SELECT " +
    "experiencias.destinatario , experiencias.fecha, experiencias.id as `idExpe`, experiencias.nombre as `nombre_experiencia`, " +
    "experiencias.descripcion as `desc`, " +
    "ambitos.nombre as `nombre_ambito`, " +
    "experiencias.ambito_id, " +
    "universidades.nombre as `nombre_uni`, especialidades.nombre as `nombre_especialidad` " +
    "FROM experiencias " +
    "INNER JOIN ambitos on experiencias.ambito_id = ambitos.id " +
    "INNER JOIN especialidades on experiencias.especialidad_id = especialidades.id " +
    "INNER JOIN universidades on experiencias.universidad_id = universidades.id  " +
    "WHERE experiencias.id = " + expId
  sqlConn.pool.query(sQuery, function (err, exp, fields) { //SELECT EXPERIENCIAS
    if (err) {
      console.log("error al obtener experiencias: ", err)
      res.send(err)
      return;
    }
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
      let sQuery = "SELECT * FROM `adjuntos` WHERE ?"
      sqlConn.pool.query(sQuery, { experiencia_id: expId }, function (err, adj, fields) { //SELECT EXPERIENCIAS
        if (err) res.send(err)
        experiencia.setAdjuntos(adj)
        let content = {
          exp: (experiencia),
          success: true,
          message: 'ok'
        };
        res.send(content)
        return
      })
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
    //Por cada fila en exp extrae un element sobre el que realizar las consultas de coordinador y de ficheros adjuntos
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


      /// INSERTAR ADJUNTOS
      sQuery = "DELETE FROM `adjuntos` WHERE ?"
      sqlConn.pool.query(sQuery, { 'experiencia_id': reqExp.id }, function (err, rows) { //DELETE ADJUNTOS
        if (err) throw err
        async.eachSeries(reqExp.adjuntos, (element, eachCallback) => {
          sQuery = "INSERT INTO `adjuntos` " +
            "SET ? "
          campos = {
            nombre_fichero: element.nombre_fichero,
            descripcion: element.descripcion,
            experiencia_id: element.experiencia_id
          }
          sqlConn.pool.query(sQuery, campos, function (err, newCoord, fields) { //INSERTAR ADJUNTOS
            if (err) throw err
            eachCallback(null)
          })
        }), function (err) {
          console.log("fin de eachseries")
        }
      })

      sQuery = "DELETE FROM  `experiencia_coordinador` WHERE  ? "
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

          //INSERTAR ADJUNTOS

          sQuery = "INSERT INTO `adjuntos` (nombre_fichero, experiencia_id) VALUES ?"
          let records = []
          reqExp.adjuntos.forEach(element => {
            let value = []
            value.push(element.nombre_server)
            value.push(expId)
            records.push(value)
          });
          console.log("ARRAY DE ADJUNTOS: ", records)
          db.query(sQuery, [records], function (err, result) { //INSERTANDO ADJUNTOS

            if (err) {
              console.log("error insertando en adjuntos", err)
              return (next)
            }
          })

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


router.delete('/experiencias', (req, res) => {
  //Se borra la experiencia y los archivos adjuntos asociados, pero no se borran los coordinadores.
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

/*************************************************************************************************************/
/*********************************** SUB-API AMBITOS  ********************************************************/
/*************************************************************************************************************/

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

/*************************************************************************************************************/
/*********************************** SUB-API UNIVERSIDADES  **************************************************/
/*************************************************************************************************************/

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

router.post('/universidad', (req, res) => {
  var reqUniv = req.body;
  console.log("pasa")
  try {
    let sQuery = "SELECT 1 FROM `universidades` WHERE ? "
    sqlConn.pool.query(sQuery, { 'nombre': reqUniv.nombre }, function (err, rows, fields) { //SELECT UNIVERSIDAD
      if (err) {
        res.send({ success: false, message: "DB error 1" })
        return
      }
      if (rows != "") {
        console.log("Ya existe la universidad: ", reqUniv.nombre)
        let content = {
          success: false,
          message: 'Ya existe una universidad con ese nombre. Por favor, compruebe que no lo está duplicando o asigne otro nombre'
        };
        res.send(content);
        return;
      }
      //  NO EXISTE LA UNIVERSIDAD EN LA BD ->INSERTAR ...
      let campos = {
        nombre: reqUniv.nombre,
      }
      let sQuery = "INSERT INTO `universidades` " +
        "SET ? "
      sqlConn.pool.query(sQuery, campos, function (err, universidad, fields) { //INSERTANDO UNIVERSIDAD
        if (err) {
          res.send({ success: false, message: "DB error: " + err })
          return
        }
        let content = {
          success: true,
          message: 'universidad insertada'
        };
        res.send(content);
        return;
      });
    })
  } catch (err) {
    console.log("error: ", err)
    return next(err)
  }
})

router.put('/universidad', (req, res) => {
  try {
    var reqUniv = req.body;
    console.log("updating...", reqUniv)

    let campos = {
      nombre: reqUniv.nombre,
      descripcion: reqUniv.nombre,
    }
    let sQuery = "UPDATE `universidades` " +
      "SET ? WHERE  id=" + reqUniv.id
    sqlConn.pool.query(sQuery, campos, function (err, experiencia, fields) { //UPDATE UNIVERSIDADES
      if (err) {
        res.send({ success: false, message: "DB error: " + err })
        return
      }
      let content = {
        success: true,
        message: 'universidad actualizada'
      };
      res.send(content);
      return;
    });
  } catch (err) {
    console.log("error: ", err)
    return next(err)
  }
})

router.delete('/universidad', (req, res) => {
  try {
    let univId = req.body.id || req.query.id || req.headers['x-access-token'];
    sQuery = "DELETE FROM `universidades` " +
      "WHERE ? "
    sqlConn.pool.query(sQuery, { 'id': univId }, function (err, deletedUniv) { //Eliminar universidad
      console.log("datos de callback del delete: ", deletedUniv)
      if (err) {
        let content = {
          err: err,
          success: false,
          message: 'Error borrando universidad'
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

/*************************************************************************************************************/
/*********************************** SUB-API ESPECIALIDADES  *************************************************/
/*************************************************************************************************************/

router.get('/especialidades', (req, res) => {
  let ambitoId = req.body.id || req.query.id || req.headers['x-access-token'];
  if (ambitoId != 0) {
    let sQuery = "SELECT * FROM especialidades WHERE ?"
    sqlConn.pool.query(sQuery, { 'ambito_id': ambitoId }, function (err, rows, fields) { //SELECT QUERY
      if (err) {
        console.log("error: ", err)
        let content = {
          success: false,
          message: 'Error al realizar la petición a la BBDD',
          err: err
        };
        res.status(200).send(content);
      }
      res.status(200).send(rows);
    })
  }
  else {
    let sQuery = "SELECT * FROM especialidades ORDER by nombre asc"
    sqlConn.pool.query(sQuery, { 'ambito_id': ambitoId }, function (err, rows, fields) { //SELECT QUERY
      if (err) {
        console.log("error: ", err)
        let content = {
          success: false,
          message: 'Error al realizar la petición a la BBDD',
          err: err
        };
        res.status(200).send(content);
      }
      res.status(200).send(rows);
    })
  }
});


router.post('/especialidad', (req, res) => {
  var reqEspec = req.body;
  console.log("pasa")
  try {
    let sQuery = "SELECT 1 FROM `especialidades` WHERE ? "
    sqlConn.pool.query(sQuery, { 'nombre': reqEspec.nombre }, function (err, rows, fields) { //SELECT experiencia
      if (err) {
        res.send({ success: false, message: "DB error 1" })
        return
      }
      if (rows != "") {
        console.log("Ya existe la especialidad: ", reqEspec.nombre)
        let content = {
          success: false,
          message: 'Ya existe un grado con ese nombre. Por favor, compruebe que no lo está duplicando o asigne otro nombre'
        };
        res.send(content);
        return;
      }
      //  NO EXISTE LA ESPECIALIDAD EN LA BD ->INSERTAR ...
      let campos = {
        nombre: reqEspec.nombre,
        ambito_id: reqEspec.ambito,
      }
      let sQuery = "INSERT INTO `especialidades` " +
        "SET ? "
      sqlConn.pool.query(sQuery, campos, function (err, experiencia, fields) { //INSERTANDO EXPERIENCIA
        if (err) {
          res.send({ success: false, message: "DB error: " + err })
          return
        }
        let content = {
          success: true,
          message: 'Especialidad insertada'
        };
        res.send(content);
        return;
      });
    })
  } catch (err) {
    console.log("error: ", err)
    return next(err)
  }
})

router.put('/especialidad', (req, res) => {
  var reqEspec = req.body;
  console.log(reqEspec)
  try {
    let campos = {
      nombre: reqEspec.nombre,
      descripcion: reqEspec.nombre,
      ambito_id: reqEspec.ambito_id,
    }
    let sQuery = "UPDATE `especialidades` " +
      "SET ? WHERE  id=" + reqEspec.id
    sqlConn.pool.query(sQuery, campos, function (err, experiencia, fields) { //UPDATE ESPECIALIDAD
      if (err) {
        res.send({ success: false, message: "DB error: " + err })
        return
      }
      let content = {
        success: true,
        message: 'Especialidad actualizada'
      };
      res.send(content);
      return;
    });
  } catch (err) {
    console.log("error: ", err)
    return next(err)
  }
})


router.delete('/especialidad', (req, res) => {
  try {
    let especId = req.body.id || req.query.id || req.headers['x-access-token'];
    sQuery = "DELETE FROM `especialidades` " +
      "WHERE ? "
    console.log("especId vale: ", especId)
    sqlConn.pool.query(sQuery, { 'id': especId }, function (err, deletedEspec) { //Eliminar experiencia
      console.log("datos de callback del delete: ", deletedEspec)
      if (err) {
        let content = {
          err: err,
          success: false,
          message: 'Error borrando especialidad'
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


/*************************************************************************************************************/
/*********************************** SUB-API BIBLIOGRAFIAS EXTERNAS******************************************/
/*************************************************************************************************************/

router.get('/bibliografiaExt', (req, res) => {
  let sQuery = "SELECT * FROM bibliografia_externa order by titulo asc"
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


router.post('/bibliografiaExt', (req, res) => {
  var reqBib = req.body;
  console.log("pasa")
  try {
    let campos = {
      titulo: reqBib.titulo,
      descripcion: reqBib.descripcion,
    }
    let sQuery = "INSERT INTO `bibliografia_externa` " +
      "SET ? "
    sqlConn.pool.query(sQuery, campos, function (err, rows, fields) { //INSERTANDO Bib
      if (err) {
        res.send({ success: false, message: "DB error: " + err })
        return
      }
      let content = {
        success: true,
        message: 'Bibliografía insertada'
      };
      res.send(content);
      return;
    });
  } catch (err) {
    console.log("error: ", err)
    return next(err)
  }
})

router.put('/bibliografiaExt', (req, res) => {
  var reqBib = req.body;
  console.log(reqBib)
  try {
    let campos = {
      titulo: reqBib.titulo,
      descripcion: reqBib.descripcion,
    }
    let sQuery = "UPDATE `bibliografia_externa` " +
      "SET ? WHERE  id=" + reqBib.id
    sqlConn.pool.query(sQuery, campos, function (err, rows, fields) { //UPDATE BIB
      if (err) {
        res.send({ success: false, message: "DB error: " + err })
        return
      }
      let content = {
        success: true,
        message: 'Recurso bibliografico actualizado'
      };
      res.send(content);
      return;
    });
  } catch (err) {
    console.log("error: ", err)
    return next(err)
  }
})


router.delete('/bibliografiaExt', (req, res) => {
  try {
    let bibId = req.body.id || req.query.id || req.headers['x-access-token'];
    sQuery = "DELETE FROM `bibliografia_externa` " +
      "WHERE ? "
    console.log("bibId vale: ", bibId)
    sqlConn.pool.query(sQuery, { 'id': bibId }, function (err, deletedBib) { //ELIMINAR RECURSOS BIBLIOGRAFICO 
      console.log("datos de callback del delete: ", deletedBbib)
      if (err) {
        let content = {
          err: err,
          success: false,
          message: 'Error borrando recurso bibliográfico externo'
        };
        res.send(content)
      }
      let content = {
        success: true,
        message: 'Borrado correctamente'
      };
      res.send(content);
      return;
    })
  } catch (err) {
    console.log("Error en delete: ", err)
  }
});
/**********************************************************************************
 * UTILES
 **********************************************************************************/

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
    let pathToAssetsInDist = './public/dist/assets/uploads/'
    cb(null, pathToAssetsInDist);
  },
  filename: function (req, file, cb) {
    var datetimestamp = Date.now();
    //Se formatea el nombre para no incurrir en nombres duplicados
    cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
  }
});

var upload = multer({ //multer settings
  storage: storage
}).single('file');

router.post('/upload', function (req, res) {
  upload(req, res, function (err) {
    console.log(req.file)
    //SE DEBE DEVOLVER EL REQ.FILE.FILENAME QUE CONTIENE EL NOMBRE DEL FICHERO EN EL BACKEND PARA QUE EL FRONT 
    //LO ENVIE AL ENDPOINT QUE ACTUA SOBRE LA BASE DE DATOS.
    if (err) {
      res.json({ error_code: 1, err_desc: err })
      return;
    }
    //Esto no se si es lo mas ortodoxo pero debo tener una copia de los ficheros que se suben en el assets/uploads de src 
    //para que las subidas sean permanentes respecto a los reinicios del servidor
    
    let pathToAssetsInDist = './public/dist/assets/uploads/'
    let pathToAssetsInSrc =  './public/src/assets/uploads/'
    console.log("copiando ",pathToAssetsInDist, req.file.filename, ' a ', pathToAssetsInSrc, req.file.filename )
    fs.createReadStream(pathToAssetsInDist+req.file.filename).pipe(fs.createWriteStream(pathToAssetsInSrc+req.file.filename));

    res.json({ error_code: 0, file: req.file.filename, err_desc: null })
  })
})




/*************************************************************************************************************/
/*********************************** EJEMPLOS DE MONGO *************************************************/
/*************************************************************************************************************/

//endpoints basados en Mongo en contraposición con los anterior para ilustrar el incremento en complejidad a la hora de usar modelos relacionales.

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

module.exports = router;


