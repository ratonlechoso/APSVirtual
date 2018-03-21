var express = require('express');
var app = express();
var router = express.Router();
var projSchema = require('../../models/proyecto');
var config = require('../../config');
//var fileManage = require('../../tools/fileManage');
var auth = require('../middleware/auth');
var moment = require('moment')
var multer = require("multer");
var async = require('async')
var fs = require('fs');
const sqlConn = require('../../DB/sqlConnection')


router.get('/images', (req, res) => {
    let projId = req.body.id || req.query.id || req.headers['x-access-token'];
    console.log("obteniendo Imagenes del proyecto con ID ", projId)
    let images = []
    let sQuery =
        "SELECT nombre_fichero FROM adjuntos_proyectos " +
        "WHERE proyecto_id = " + projId
    sqlConn.pool.query(sQuery, function (err, adjuntos, fields) { //SELECT IMAGES
        if (err) {
            console.log("ERROR: ", err)
            res.send(err)
            return;
        }
        res.send({ status: "OK", ficheros: adjuntos })
        return;
    })
})

router.get('/proyecto', (req, res) => {
    let projId = req.body.id || req.query.id || req.headers['x-access-token'];
    console.log("obteniendo proyecto con ID ", projId)
    let sQuery =
        "SELECT " +
        "proyectos.id as `idProj`, proyectos.nombre as `nombre_proyecto`, proyectos.descripcion as `descripcion_proyecto`, " +
        "proyectos.fecha_inicio, proyectos.fecha_fin, proyectos.cupo_estudiantes, " +
        "estados_proyectos.id as `id_estado`, " +
        "estados_proyectos.nombre as `nombre_estado`, " +
        "entidades.id as 'entidad_id', " +
        "entidades.nombre as 'nombre_entidad', " +
        "entidades.descripcion as 'descripcion_entidad', " +
        "entidades.email as 'email_entidad', " +
        "entidades.tfno as 'tfno_entidad', " +
        "entidades.municipio as 'municipio_entidad', " +
        "provincias.id as 'id_provincia', " +
        "provincias.nombre as 'nombre_provincia', " +
        "proyectos.descripcion as `desc`, " +
        "ambitos.nombre as `nombre_ambito`, " +
        "proyectos.ambito_id, " +
        "universidades.nombre as `nombre_uni`, especialidades.nombre as `nombre_especialidad` " +
        "FROM proyectos " +
        "LEFT JOIN entidades on proyectos.entidad_id = entidades.id " +
        "LEFT JOIN estados_proyectos on proyectos.estado_id = estados_proyectos.id " +
        "LEFT JOIN ambitos on proyectos.ambito_id = ambitos.id " +
        "LEFT JOIN especialidades on proyectos.especialidad_id = especialidades.id " +
        "LEFT JOIN universidades on proyectos.universidad_id = universidades.id  " +
        "LEFT JOIN provincias on entidades.provincia_id = provincias.id  " +
        "WHERE proyectos.id = " + projId
    //CALLBACK HELL !!!! (Se debería evitar esta construcción mediante herramientas de sincronización)

    sqlConn.pool.query(sQuery, function (err, proj, fields) { //SELECT PROYECTOS
        console.log("SQL: ", this.sql)
        if (err) {
            console.log("error al obtener proyectos: ", err)
            res.send(err)
            return;
        }
        let sQuery = "SELECT cupo_estudiantes - count(*) as 'plazas' " +
            "FROM proyectos " +
            "INNER JOIN proyecto_alumno ON proyectos.id = proyecto_alumno.proyecto_id " +
            "WHERE proyectos.id = " + projId
        var proyecto = projSchema;
        sqlConn.pool.query(sQuery, function (err, plazas, fields) { //SELECT PLAZAS
            if (err) {
                console.log("error al obtener proyectos: ", err)
                res.send(err)
                return;
            }
            proyecto.setProyecto(proj[0])
            proyecto.plazas = plazas[0].plazas

            //console.log("proyecto: ", proyecto)
            sQuery = "SELECT coordinadores.id, nombre, email " +
                "FROM coordinadores " +
                "INNER JOIN proyecto_coordinador ON coordinadores.id = proyecto_coordinador.coordinador_id " +
                "WHERE ?";
            sqlConn.pool.query(sQuery, { 'proyecto_id': projId }, function (err, coord, fields) { //SELECT COORDINADORES
                if (err) res.send(err)
                proyecto.setCoordinadores(coord)
                let sQuery = "SELECT * FROM `adjuntos_proyectos` WHERE ?"
                sqlConn.pool.query(sQuery, { proyecto_id: projId }, function (err, adj, fields) { //SELECT ADJUNTOS
                    if (err) res.send(err)
                    proyecto.setAdjuntos(adj)

                    let sQuery = "SELECT alumnos.id, nombre, email, universidad_id " +
                        "FROM `alumnos` " +
                        "INNER JOIN `proyecto_alumno` on proyecto_alumno.alumno_id = alumnos.id " +
                        "WHERE proyecto_alumno.proyecto_id = " + projId
                    sqlConn.pool.query(sQuery, function (err, alumnos, fields) { //SELECT ALUMNOS
                        if (err) return res.send(err)
                        console.log("Alumnos: ", alumnos)
                        proyecto.setAlumnos(alumnos)

                        let content = {
                            proj: (proyecto),
                            success: true,
                            message: 'ok'
                        };
                        res.send(content)
                        return
                    }) //SELECT alumnos
                }) //SELECT adjuntos
            }) //SELECT coordinadores
        }) //SELECT plazas
    }) //SELECT proyectos
}); //metodo


router.get('/proyectos', (req, res) => {
    let reqId = parseInt(req.headers['x-access-token'], 10)
    let campo = ''
    let valor = 0
    if (reqId >= 10) {
        campo = 'ambito_id'
        valor = reqId / 10
    } else {
        campo = 'estado_id'
        valor = reqId
    }
    let sQuery =
        "SELECT " +
        "proyectos.id as `idProj`, proyectos.nombre as `nombre_proyecto`, proyectos.descripcion as `descripcion_proyecto`, " +
        "proyectos.fecha_inicio, proyectos.fecha_fin, proyectos.cupo_estudiantes, " +
        "estados_proyectos.id as `id_estado`, " +
        "estados_proyectos.nombre as `nombre_estado`, " +
        "entidades.id as 'entidad_id', " +
        "entidades.nombre as 'nombre_entidad', " +
        "entidades.descripcion as 'descripcion_entidad', " +
        "entidades.email as 'email_entidad', " +
        "entidades.tfno as 'tfno_entidad', " +
        "entidades.municipio as 'municipio_entidad', " +
        "provincias.id as 'id_provincia', " +
        "provincias.nombre as 'nombre_provincia', " +
        "proyectos.descripcion as `desc`, " +
        "ambitos.nombre as `nombre_ambito`, " +
        "proyectos.ambito_id, " +
        "universidades.nombre as `nombre_uni`, especialidades.nombre as `nombre_especialidad` " +
        "FROM proyectos " +
        "LEFT JOIN entidades on proyectos.entidad_id = entidades.id " +
        "LEFT JOIN estados_proyectos on proyectos.estado_id = estados_proyectos.id " +
        "LEFT JOIN ambitos on proyectos.ambito_id = ambitos.id " +
        "LEFT JOIN especialidades on proyectos.especialidad_id = especialidades.id " +
        "LEFT JOIN universidades on proyectos.universidad_id = universidades.id  " +
        "LEFT JOIN provincias on entidades.provincia_id = provincias.id  " +
        "WHERE proyectos." + campo + " = " + valor

    sqlConn.pool.query(sQuery, function (err, proj, fields) { //SELECT PROYECTOS
        //console.log("Query: ", this.sql)
        if (err) {
            console.log("error: ", err)
            let content = {
                success: false,
                message: 'Error listando proyectos',
                err: err
            };
        }

        //TRATAMIENTO DE LA ASINCRONIA: 
        //Por cada fila en proj extrae un element sobre el que realizar las consultas de coordinador y de ficheros adjuntos
        //Por medio del waterfall nos aseguramos de tener la estructura de datos comepleta antes de hacer push en el objeto resultado
        var proyectos = [];
        var proyecto = projSchema;
        async.eachSeries(proj, (element, eachCallback) => {
            let sQuery = "SELECT coordinadores.id, nombre, email " +
                "FROM coordinadores " +
                "INNER JOIN proyecto_coordinador ON coordinadores.id = proyecto_coordinador.coordinador_id " +
                "WHERE ?";
            sqlConn.pool.query(sQuery, { 'proyecto_id': element.idProj }, function (err, coord, fields) { //SELECT COORDINADORES
                if (err) eachCallback(err)
                proyecto.setProyecto(element)
                console.log("nombre_uni: ", proyecto.universidad)
                proyecto.setCoordinadores(coord)
                proyectos.push(JSON.parse(JSON.stringify(proyecto)))
                eachCallback(null, proyectos)
            }) //sql 
        }, function (err) {
            if (err) res.send(err)
            let content = {
                proj: (proyectos),
                success: true,
                message: 'ok'
            };
            res.send(content)
            return
        }
        ) //EACH
    }) //SELECT PROYECTO
});



router.put('/proyectos', (req, res) => {
    var reqProj = req.body;
    var upd_action = req.headers['x-access-upd-action'];
    console.log("acción : ", upd_action)
    if (upd_action == 0) {
        try {
            let campos = {
                nombre: reqProj.nombre,
                descripcion: reqProj.descripcion,
                fecha_inicio: reqProj.fecha_inicio,
                fecha_fin: reqProj.fecha_fin,
                estado_id: reqProj.estado.id,
                //cupo_estudiantes: reqProj.cupo_estudiantes,  
                ambito_id: reqProj.ambito.id,
                especialidad_id: (reqProj.especialidad != null) ? reqProj.especialidad.id : null,
                universidad_id: (reqProj.universidad != null) ? reqProj.universidad.id : null
            }
            let sQuery = "UPDATE `proyectos` " +
                "SET ?  WHERE id = " + reqProj.id
            sqlConn.pool.query(sQuery, campos, function (err, proj) { //UPDATE proyectos
                if (err) {
                    console.log("error al actualizar el proyecto: ", err)
                    throw err
                }

                async.waterfall([
                    insertar_entidad(reqProj, reqProj.id, sqlConn.pool),
                    insertar_adjuntos(reqProj, reqProj.id, sqlConn.pool),
                    insertar_coordinadores(reqProj, reqProj.id, sqlConn.pool),
                    insertar_alumnos(reqProj, reqProj.id, sqlConn.pool)
                ], function (error, success) {
                    if (error) { console.log('Algo ha ido mal!'); }
                    let content = {
                        success: true,
                        message: 'ok'
                    };
                    res.send(content)
                    return
                });
            })
        } catch (err) {
            console.log("ERROR: ", err)
        }
    } else if (upd_action == 1) {
        //console.log("instar coordinadores", reqProj)
        async.waterfall([
            insertar_coordinadores(reqProj, reqProj.id, sqlConn.pool),
            apadrinar(reqProj, reqProj.id, sqlConn.pool)
            //insertar_adjuntos(reqProj, projId, db)
        ], function (error, success) {
            if (error) { console.log('Algo ha ido mal!'); }
            console.log("Hecho!")
            let content = {
                success: true,
                message: 'ok'
            };
            res.send(content)
            return
        });
    } else if (upd_action == 2) {  //Asignar cupo de estudiantes y estado de reclutamiento de alumnos
        try {
            console.log("upd2")
            let campos = {
                cupo_estudiantes: reqProj.cupo_estudiantes,
                estado_id: 3
            }
            let sQuery = "UPDATE proyectos SET ? WHERE  id = " + reqProj.id
            sqlConn.pool.query(sQuery, campos, function (err, entidad, fields) { //ACTUALIZANDO PROYECTO
                if (err) {
                    console.log(err)
                    throw err
                }
                console.log("Hecho!")
                let content = {
                    success: true,
                    message: 'ok'
                };
                res.send(content)
                return
            })
        } catch (err) {
            console.log("upd2 error: ", err)
        }
    } else if (upd_action == 3) {  //Asignar alumno en estado de reclutamiento de alumnos y actualizar numero de plazas
        console.log("PASA")
        async.waterfall([
            insertar_alumnos(reqProj, reqProj.id, sqlConn.pool)
        ], function (error, success) {
            if (error) { console.log('Algo ha ido mal!'); }
            console.log("Hecho!")
            let content = {
                success: true,
                message: 'ok'
            };
            res.send(content)
            return
        });
    } else if (upd_action == 4) {  //Asignar alumno en estado de reclutamiento de alumnos y actualizar numero de plazas
        console.log("PASA 4")
        async.waterfall([
            iniciar_proyecto(reqProj, reqProj.id, sqlConn.pool)
        ], function (error, success) {
            if (error) { console.log('Algo ha ido mal!'); }
            console.log("Hecho!")
            let content = {
                success: true,
                message: 'ok'
            };
            res.send(content)
            return
        });
    } else if (upd_action == 5) {  //Asignar alumno en estado de reclutamiento de alumnos y actualizar numero de plazas
        console.log("PASA 5")
        async.waterfall([
            finalizar_proyecto(reqProj, reqProj.id, sqlConn.pool)
        ], function (error, success) {
            if (error) { console.log('Algo ha ido mal!'); }
            console.log("Hecho!")
            let content = {
                success: true,
                message: 'ok'
            };
            res.send(content)
            return
        });
    }
});

router.post('/proyectos', (req, res) => {
    var reqProj = req.body;
    try {
        sqlConn.inTransaction(sqlConn.pool, function (db, next) {
            let sQuery = "SELECT 1 FROM proyectos where ? "
            db.query(sQuery, { 'nombre': reqProj.nombre }, function (err, rows, fields) { //SELECT proyecto
                if (err) return next(err)
                if (rows != "") {
                    console.log("Ya existe el proyecto: ", reqProj.nombre)
                    let content = {
                        success: false,
                        message: 'Ya existe un proyecto con ese nombre. Por favor, compruebe que no lo está duplicando o asigne otro nombre'
                    };
                    res.send(content);
                    return;
                }
                //  NO EXISTE EL PROYECTO EN LA BD ->INSERTAR ...
                sQuery = "INSERT INTO `proyectos` " +
                    "SET ?"
                let campos = {
                    nombre: reqProj.nombre,
                    descripcion: reqProj.descripcion,
                    estado_id: 1,
                    ambito_id: reqProj.ambito,
                }
                db.query(sQuery, campos, function (err, proyecto, fields) { //INSERTANDO PROYECTO
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    console.log("proyecto insertado", proyecto.insertId)
                    projId = proyecto.insertId

                    //GESTION DE LA ASINCRONIA EN EL ACCESO A LA BD. ESTA ES LA FORMA CORRECTA!!!!!!!!!!!!!!!!!!!!!!!
                    async.waterfall([
                        insertar_entidad(reqProj, projId, db),
                        insertar_adjuntos(reqProj, projId, db)
                    ], function (error, success) {
                        if (error) { console.log('Algo ha ido mal!'); }
                        console.log("hecho")
                        return next(err)
                    });


                }) //INSERT PROYECTO
            }) //SELECT PROYECTO
        }, function (err) {
            if (err) { console.log('Algo ha ido mal!'); }
            console.log("All done, transaction ended and connection released");
            let content = {
                success: true,
                message: 'ok'
            };
            res.send(content)
            return
        });
    } catch (err) {
        console.log("ERROR: ", err)
    }
})

function apadrinar(reqProj, projId, db) {
    return function (callback) {
        //ACTUALIZAR ESTADO
        let campos = {
            estado_id: 2
        }
        let sQuery = "UPDATE proyectos SET ? WHERE  id = " + projId
        db.query(sQuery, campos, function (err, entidad, fields) { //ACTUALIZANDO PROYECTO
            if (err) {
                console.log(err)
                throw err
            }
            callback(null);
        })
    }
}

function iniciar_proyecto(reqProj, projId, db) {
    return function (callback) {
        //ACTUALIZAR ESTADO
        let campos = {
            estado_id: 4,
            fecha_inicio: moment().format().toString()
        }
        let sQuery = "UPDATE proyectos SET ? WHERE  id = " + projId
        db.query(sQuery, campos, function (err, entidad, fields) { //ACTUALIZANDO PROYECTO
            if (err) {
                console.log(err)
                throw err
            }
            callback(null);
        })
    }
}

function finalizar_proyecto(reqProj, projId, db) {
    return function (callback) {
        //ACTUALIZAR ESTADO
        let campos = {
            estado_id: 5,
            fecha_fin: moment().format().toString()
        }
        let sQuery = "UPDATE proyectos SET ? WHERE  id = " + projId
        db.query(sQuery, campos, function (err, entidad, fields) { //ACTUALIZANDO PROYECTO
            if (err) {
                console.log(err)
                throw err
            }
            callback(null);
        })
    }
}


function insertar_entidad(reqProj, projId, db) {
    return function (callback) {
        //COMPROBAR SI EXISTE LA ENTIDAD
        sQuery = "SELECT * FROM entidades where ? "
        sqlConn.pool.query(sQuery, { 'email': reqProj.email_entidad }, function (err, results) { //SELECT ENTIDADES
            if (err) {
                console.log(err)
                throw err
            }
            if (results == "") { //No existe. Se crea la entidad y se actualiza su id en el proyecto
                console.log("la entidad no existe")
                //INSERTAR ENTIDAD
                let campos = {
                    nombre: reqProj.nombre_entidad,
                    email: reqProj.email_entidad,
                    provincia_id: reqProj.provincia_entidad.id,
                    municipio: reqProj.municipio_entidad
                }
                sQuery = "INSERT INTO `entidades` SET ?"
                db.query(sQuery, campos, function (err, entidad, fields) { //INSERTANDO ENTIDAD
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    let entidadId = entidad.insertId
                    console.log("entidadId insertada : ", entidadId)
                    sQuery = "UPDATE proyectos SET ? WHERE  id = " + projId
                    db.query(sQuery, { entidad_id: entidadId }, function (err, entidad, fields) { //ACTUALIZANDO PROYECTO
                        if (err) {
                            console.log(err)
                            throw err
                        }
                        callback(null);
                    })
                })
            } else { //Ya existe la entidad. Se actualiza a través de su id
                //SI YA EXISTE LA ENTIDAD Y QUIERO MODIFICAR ALGUNO DE SUS CAMPOS DEBO HACER UPDATE DE ELLA    
                let campos = {
                    nombre: reqProj.nombre_entidad,
                    email: reqProj.email_entidad,
                    provincia_id: reqProj.provincia_entidad.id,
                    municipio: reqProj.municipio_entidad
                }
                sQuery = "UPDATE `entidades` SET ?  WHERE  id = " + reqProj.entidad.id
                db.query(sQuery, campos, function (err, entidad, fields) { //UPDATE ENTIDAD
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    callback(null);
                })
                // console.log("ya existe la ENTIDAD")
                // let entidadId = results[0].id
                // sQuery = "UPDATE proyectos SET ? WHERE  id = " + projId
                // db.query(sQuery, { entidad_id: entidadId }, function (err, entidad, fields) { //ACTUALIZANDO PROYECTO
                //     if (err) {
                //         console.log(err)
                //         throw err
                //     }
                //     console.log("lanzo callback")
                //     callback(null);
                // })
            }
        }) //SELECT ENTIDADES
    }
}

function actualizar_entidad(reqProj, projId, db) {
    return function (callback) {
        //console.log("REQPROJ en actalizar_entidad", reqProj)
        //COMPROBAR SI EXISTE LA ENTIDAD
        sQuery = "SELECT * FROM entidades where ? "
        sqlConn.pool.query(sQuery, { 'id': reqProj.entidad.id }, function (err, results) { //SELECT ENTIDADES
            if (err) {
                console.log(err)
                throw err
            }
            if (results == "") {//No existe. Error
                console.log("la entidad no existe")
                throw err
            } else { //ACTUALIZAR LA ENTIDAD
                console.log("la entidad Existe")
                let campos = {
                    nombre: reqProj.nombre_entidad,
                    email: reqProj.email_entidad,
                    provincia_id: reqProj.provincia_entidad.id,
                    municipio: reqProj.municipio_entidad
                }
                sQuery = "UPDATE `entidades` SET ?  WHERE  id = " + reqProj.entidad.id
                db.query(sQuery, campos, function (err, entidad, fields) { //UPDATE ENTIDAD
                    if (err) {
                        console.log(err)
                        throw err
                    }
                    callback(null);
                })
            }
        })
    }
}


function insertar_adjuntos(reqProj, projId, db) {
    return function (callback) {
        /// INSERTAR ADJUNTOS
        sQuery = "DELETE FROM `adjuntos_proyectos` WHERE ?"
        //console.log("insertar_adjuntos para: ", reqProj)
        db.query(sQuery, { 'proyecto_id': reqProj.id }, function (err, rows) { //DELETE ADJUNTOS
            if (err) throw err
            async.eachSeries(reqProj.adjuntos, (element, cb) => {
                sQuery = "INSERT INTO `adjuntos_proyectos` " +
                    "SET ? "
                campos = {
                    nombre_fichero: element.nombre_fichero,
                    descripcion: "",
                    proyecto_id: projId
                }
                //console.log("Campos para insertar adjuntos: ", campos)
                db.query(sQuery, campos, function (err, newAdj, fields) { //INSERTAR ADJUNTOS
                    console.log("sql ", this.sql)
                    if (err) throw err
                    console.log("Insertados")
                    cb(null)
                })
            }, function (err) {
                if (err) throw err
                //console.log("fin de eachseries")
                callback(null);
            })
        })
        // //INSERTAR ADJUNTOS (ALTERNATIVA SIN SINCRONIZACIÓN FORZADA)
        // console.log("Insertando adjuntos")
        // sQuery = "INSERT INTO `adjuntos_proyectos` (nombre_fichero, proyecto_id) VALUES ?"
        // let records = []
        // reqProj.adjuntos.forEach(element => {
        //     let value = []
        //     value.push(element.nombre_server)
        //     value.push(projId)
        //     records.push(value)
        // });
        // console.log("ARRAY DE ADJUNTOS: ", records)
        // db.query(sQuery, [records], function (err, result) { //INSERTANDO ADJUNTOS
        //     if (err) {
        //         console.log("error insertando en adjuntos", err)
        //         throw err
        //     }
        //     callback(null);
        // })
    }
}

function insertar_coordinadores(reqProj, projId, db) {
    return function (callback) {
        try {
            console.log("coordiandores: ", reqProj.coordinadores)
            if (reqProj.coordinadores == null) {
                console.log("no hay coordiandores")
                callback(null)
            }
            sQuery = "DELETE FROM  `proyecto_coordinador` WHERE  ? "
            db.query(sQuery, { 'proyecto_id': reqProj.id }, function (err, rows) { //DELETE proyecto_coordinador
                if (err) throw err
                ////////////////RECORRER COORDINADORES ...
                async.eachSeries(reqProj.coordinadores, (element, eachCallback) => {
                    sQuery = "SELECT * FROM coordinadores where ? "
                    db.query(sQuery, { 'email': element.email }, function (err, results) { //SELECT COORDINADORES
                        console.log("sql: ", this.sql)
                        if (err) throw err
                        if (results == "") { //Se crea el  coordinador y la entrada en la tabla intermedia

                            sQuery = "INSERT INTO `coordinadores` " +
                                "SET ? "
                            campos = {
                                nombre: element.nombre,
                                email: element.email
                                // ,universidad_id: reqProj.universidad
                            }
                            db.query(sQuery, campos, function (err, newCoord, fields) { //INSERTAR COORDINADORES
                                console.log("sql: ", this.sql)
                                if (err) throw err
                                let coordId = newCoord.insertId
                                sQuery = "INSERT INTO proyecto_coordinador " +
                                    "SET ?"
                                campos = {
                                    coordinador_id: coordId,
                                    proyecto_id: reqProj.id
                                }
                                db.query(sQuery, campos, function (err, results, fields) { //INSERTAR PROYECTO_COORDINADOR
                                    console.log("insertando en tabla proyecto_coordinador 1 ...")
                                    if (err) throw err
                                    eachCallback(null)
                                })
                            })
                        } else {//solo la entrada en la tabla intermedia proyecto_coordinador
                            console.log("coordinador ya existente. Se asocia en la tabla intermedia: ", results[0])
                            sQuery = "INSERT INTO proyecto_coordinador " +
                                "SET ?"
                            campos = {
                                coordinador_id: results[0].id,
                                proyecto_id: reqProj.id
                            }
                            db.query(sQuery, campos, function (err, results, fields) { //INSERTAR PROYECTO_COORDINADOR
                                console.log("sql: ", this.sql)
                                console.log("insertando en tabla proyecto_coordinador 2 ...")
                                if (err) throw err
                                eachCallback(null)
                            })
                        } //else

                    }) //SELECT COORDINADORES
                }, function (err) {
                    if (err) throw err
                    console.log("fin de eachseries de coordinadores")
                    callback(null);
                })
            })
        } catch (err) {
            console.log(err)

        }
    }
}

function insertar_alumnos(reqProj, projId, db) {
    return function (callback) {
        sQuery = "DELETE FROM  `proyecto_alumno` WHERE  ? "
        sqlConn.pool.query(sQuery, { 'proyecto_id': reqProj.id }, function (err, rows) { //DELETE proyecto_alumno
            if (err) throw err
            ////////////////RECORRER ALUMNOS ...
            async.eachSeries(reqProj.alumnos, (element, eachCallback) => {
                sQuery = "SELECT * FROM alumnos where ? "
                console.log("email vale ", element.email)
                sqlConn.pool.query(sQuery, { 'email': element.email }, function (err, results) { //SELECT ALUMNOS
                    console.log("select alumno")
                    if (err) throw err
                    if (results == "") { //Se crea el coordinador y la entrada en la tabla intermedia

                        sQuery = "INSERT INTO `alumnos` " +
                            "SET ? "
                        campos = {
                            nombre: element.nombre,
                            email: element.email,
                            universidad_id: reqProj.universidad
                        }
                        sqlConn.pool.query(sQuery, campos, function (err, newAlumno, fields) { //INSERTAR ALUMNOS
                            if (err) throw err
                            let alumnoId = newAlumno.insertId
                            sQuery = "INSERT INTO proyecto_alumno " +
                                "SET ?"
                            campos = {
                                alumno_id: alumnoId,
                                proyecto_id: reqProj.id
                            }
                            sqlConn.pool.query(sQuery, campos, function (err, results, fields) { //INSERTAR PROYECTO_ALUMNO
                                console.log("insertando en tabla proyecto_alumno 1 ...")
                                if (err) throw err
                                eachCallback(null)
                            })
                        })
                    } else {//solo la entrada en la tabla intermedia proyecto_alumno
                        console.log("alumno ya existente. Se asocia en la tabla intermedia: ", results[0])
                        sQuery = "INSERT INTO proyecto_alumno " +
                            "SET ?"
                        campos = {
                            alumno_id: results[0].id,
                            proyecto_id: reqProj.id
                        }
                        sqlConn.pool.query(sQuery, campos, function (err, results, fields) { //INSERTAR PROYECTO_ALUMNO
                            console.log("insertando en tabla proyecto_alumno 2 ...")
                            if (err) throw err
                            eachCallback(null)
                        })
                    } //else
                }) //SELECT ALUMNOS
            }, function (err) {
                console.log("fin de eachseries")
                callback(null)
            }) //ASYNC EACHSERIES
        }) //DELETE PROYECTO_ALUMNO
    }
}

router.delete('/proyectos', (req, res) => {
    //Se borra el proyecto y los archivos adjuntos asociados, pero no se borran los coordinadores ni los alumnos.
    try {
        let projId = req.body.id || req.query.id || req.headers['x-access-token'];
        sQuery = "DELETE FROM `proyectos` " +
            "WHERE ? "
        console.log("projId vale: ", projId)
        sqlConn.pool.query(sQuery, { 'id': projId }, function (err, deletedProj) { //Eliminar proyecto
            console.log("datos de callback del delete: ", deletedProj)
            if (err) {
                let content = {
                    err: err,
                    success: false,
                    message: 'Error borrando proyecto'
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

router.get('/estados', (req, res) => {
    let sQuery = "SELECT * FROM estados_proyectos order by nombre asc"
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

router.get('/provincias', (req, res) => {
    let sQuery = "SELECT * FROM provincias order by nombre asc"
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



module.exports = router;


