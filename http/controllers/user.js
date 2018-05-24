var bluebird = require('bluebird');
var crypto = bluebird.promisifyAll(require('crypto'));
var nodemailer = require('nodemailer');
var express = require('express');
var app = express();
var router = express.Router();
var User = require('../../models/userMongo');
var UserSqlSchema = require('../../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var auth = require('../middleware/auth');
var moment = require('moment')

const sqlConn = require('../../DB/sqlConnection')

router.get('/users', (req, res) => {
  let sQuery = "SELECT r.nombre as rol_nombre, r.id as rol_id, u.*  " +
    "FROM users u, roles r " +
    "WHERE u.rol_id = r.id " +
    "ORDER BY pendiente desc, nombre"
  sqlConn.pool.query(sQuery, function (err, rows, fields) { //SELECT QUERY
    if (err) {
      console.log("error: ", err)
      let content = {
        success: false,
        message: 'Error al realizar la petición a la BBDD',
        err: err
      };
      return
    }
    let content = {
      usuarios: rows,
      success: true,
      message: 'No existen usuarios en la BD'
    };
    res.send(content);
    return;
  })
})

router.get('/getUser', (req, res) => {
  let userId = req.body._id || req.query._id || req.headers['x-access-token'];
  var user = UserSqlSchema;
  let sQuery = "SELECT r.nombre as rol_nombre, r.id as rol_id, u.*  " +
    "FROM users u, roles r " +
    "WHERE ? AND u.rol_id = r.id "

  sqlConn.pool.query(sQuery, { 'u.id': userId }, function (err, rows, fields) { //SELECT QUERY
    if (err) {
      console.log("error: ", err)
      let content = {
        success: false,
        message: 'Error al realizar la petición a la BBDD',
        err: err
      };
      return
    }
    if (rows == "") {
      let content = {
        success: false,
        message: 'No existe el usuario'
      };
      res.send(content);
      return;
    }
    user.setUser(rows[0])
    res.status(200).send({ user })

  })
});

router.get('/check-state', auth.verifyToken, (req, res) => {
  let userId = -1
  try {
    //privileged_roles = req.body.roles || req.query.roles || req.headers['x-access-roles'] || [1, 2, 3, 4, 5] ;
    privileged_roles = req.body.roles || req.query.roles || req.headers['x-access-roles'];
    userId = req.body.userId || req.query.userId || req.headers['x-access-id'];

    console.log("UserId: ", userId)

    if (privileged_roles != undefined) {
      if (privileged_roles == "") privileged_roles = [1,2,3,4,5]
      var user = UserSqlSchema;
      let sQuery = "SELECT *  " +
        "FROM users " +
        "WHERE  ? "
      sqlConn.pool.query(sQuery, { 'id': userId }, function (err, rows, fields) { //SELECT QUERY
        if (err) {
          console.log("Error en acceso a la tabla Users")
          res.send({ success: false, code: 'err_003', message: 'privilegios insuficientes.' });
          return
        }
        //COMPROBAR QUE NO ESTE BLOQUEADO EL USUARIO
        if (rows[0].bloqueado == 1) { 
          console.log("Usuario bloqueado")
          res.send({ success: false, code: 'err_004', message: 'usuario bloqueado.' });
          return
        }
        //SI ESTÁ PENDIENTE DE ACTIVACION SU NIVEL DE PRIVILEGIOS ES 1 ó 2
        console.log ("PR", privileged_roles)
        if ((rows[0].pendiente == 1 && privileged_roles.indexOf(1)=== -1 && privileged_roles.indexOf(2)=== -1) 
          || (privileged_roles != "" && privileged_roles.indexOf(rows[0].rol_id) === -1)){
          console.log("Privilegios insuficientes. Se necesita ", privileged_roles)
          res.send({ success: false, code: 'err_005', message: 'privilegios insuficientes.' });
          return
        }
        res.send({ success: true, message: 'Logeado correctamente. Bienvenido!' });
        return
      })
    } else {
      let content = {
        success: true,
        message: 'Logeado correctamente. Bienvenido!'
      }
      res.send(content);
    }
  } catch (err) {
    console.log(err)
  }
});

router.put('/user/:id', (req, res) => {
  try {
    var reqUser = req.body;
    let userId = req.params.id
    let content;
    var updateUser = UserSqlSchema;
    sQuery = "UPDATE USERS SET ? WHERE id = " + userId
    console.log("password en update: ", reqUser.password)
    let pass = updateUser.generateHash(reqUser.password)
    let fields;
    if (reqUser.password != "") {
      let pass = updateUser.generateHash(reqUser.password)
      fields = {
        first_name: reqUser.first_name,
        last_name: reqUser.last_name,
        email: reqUser.email,
        password: pass,
        rol_id: reqUser.roles | reqUser.rol_id,
        bloqueado: reqUser.bloqueado | '0',
        pendiente: reqUser.pendiente | '0'
      }
    } else {
      fields = {
        first_name: reqUser.first_name,
        last_name: reqUser.last_name,
        email: reqUser.email,
        rol_id: reqUser.roles | reqUser.rol_id,
        bloqueado: reqUser.bloqueado | '0',
        pendiente: reqUser.pendiente | '0'
      }
    }

    sqlConn.pool.query(sQuery, fields, function (err, results) { //UPDATE QUERY
      console.log("update: ", this.sql)
      if (err) {
        console.log("Error insertando usuario", err)
        res.send(content);
        return;
      }
      updateUser.setUser(reqUser)
      content = {
        user: updateUser,
        success: true,
        message: 'Perfil actualizado'
      };
      console.log("actualizado ...")
      res.send(content);
    })
  } catch (err) {
    console.log(err)
  }
})


router.post('/register', (req, res) => {
  var reqUser = req.body;
  var sQuery = ""
  try {
    var newUser = UserSqlSchema;
  } catch (err) {
    console.log(err)
  }
  process.nextTick(() => {
    sQuery = "SELECT * FROM users WHERE ? "
    sqlConn.pool.query(sQuery, { 'email': reqUser.email }, function (err, rows, fields) { //SELECT QUERY
      if (err) {
        console.log("error: ", err)
        return
      }
      if (rows != "") {
        let content = {
          success: false,
          message: 'El usuario ya existe'
        };
        res.send(content);
        return;
      } else {
        sQuery = "INSERT INTO USERS SET ? "
        let pass = newUser.generateHash(reqUser.password)
        let fields = {
          first_name: reqUser.first_name,
          last_name: reqUser.last_name,
          last_login: moment().format().toString(),
          sign_up_date: moment().format().toString(),
          email: reqUser.email,
          password: pass,
          rol_id: reqUser.roles,
          pendiente: reqUser.pendiente
        }
        console.log("pendiente: ", reqUser.pendiente)

        console.log("password generado", pass)
        sqlConn.pool.query(sQuery, fields, function (err, results, fields) { //INSERT QUERY
          if (err) {
            console.log("Error insertando usuario", err)
            res.send(content);
            return;
          }
          let token = jwt.sign(newUser, config.secret, {
            expiresIn: 60 * 60 * 24
          });
          console.log("registrando usuario", newUser)
          newUser.setUser(reqUser)
          newUser.id = results.insertId
          let content = {
            user: newUser,
            success: true,
            message: 'Has creado un nuevo usuario',
            token: token
          };
          if (reqUser.pendiente == 1)
            console.log("usuario pendiente de aprobación. Notificar al admin")
          res.send(content);
          return;
        })
      }
      return;
    })
  })
});

router.post('/login', (req, res) => {
  console.log("logeando ...")
  var reqUser = req.body;
  var user = UserSqlSchema;

  let sQuery = "SELECT r.nombre as rol_nombre, r.id as rol_id, u.*  " +
    "FROM users u, roles r " +
    "WHERE ? AND u.rol_id = r.id "
  sqlConn.pool.query(sQuery, { 'email': reqUser.email }, function (err, rows, fields) { //SELECT QUERY
    if (err) {
      console.log("error: ", err)
      return
    }
    if (rows == "") {
      let content = {
        success: false,
        message: 'No existe el usuario'
      };
      res.send(content);
      return;
    }
    user.password = rows[0].password
    if (!user.validPassword(reqUser.password)) {
      console.log("password invalido")
      let content = {
        success: false,
        message: 'Contraseña incorrecta'
      };
      res.send(content);
      return;
    }
    user.setUser(rows[0])
    user.lastLogin = moment().format().toString()
    sQuery = "UPDATE users SET ? WHERE id=" + user.id
    let campos = {
      last_login: moment().format().toString()
    }
    sqlConn.pool.query(sQuery, campos, function (err, results) { //UPDATE last_login QUERY
      if (err) {
        console.log("Error actualizando users.last_login", err) 
        res.status(404).send(err)
      }
      let token = jwt.sign(user, config.secret, {
        expiresIn: 60 * 60 * 24 //1 dia
      });
      if (user.roles == "Administrador") {
        obtener_pendientes((pendientes) => { //Los datos se devuelven el callback. IO async
          let content = {
            pendientes: pendientes,
            user: user,
            success: true,
            message: 'No estás logeado',
            token: token
          };
          res.send(content);
        })
      } else {
        let content = {
          user: user,
          success: true,
          message: 'No estás logeado',
          token: token
        };
        res.send(content);
      }
    })
  })
});

router.get('/pendientes', (req, res) => {
  obtener_pendientes((pendientes) => {
    res.send(pendientes)
    return;
  })
});

function obtener_pendientes(cb) { //Devolver los datos de las funciones asincronas en un callback
  let sQuery = "SELECT r.nombre as rol_nombre, r.id as rol_id, u.*  " +
    "FROM users u, roles r " +
    "WHERE u.rol_id = r.id and u.pendiente = 1"
  sqlConn.pool.query(sQuery, function (err, rows, fields) { //SELECT QUERY
    if (err) {
      let content = {
        success: false,
        message: err
      };
      cb(content);
    }
    if (rows == "") {
      let content = {
        success: false,
        message: 'No hay pendientes'
      };
      cb(content);
    } else {
      console.log("obtener_pendientes: ", rows)
      let content = {
        users: rows,
        success: true,
        message: 'Usuarios pendientes de aprobación'
      };
      cb(content);
    }
  })
}

router.post('/notify_activation', (req, res) => {
  try {
    var reqUser = req.body;
    console.log("Notificando activacion de : ", reqUser.email)
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var smtpTrans = nodemailer.createTransport({
      service: config.emailService,
      auth: {
        user: config.emailUser,
        pass: config.emailPassword,
        tls: { rejectUnauthorized: false }
      }
    });
    var mailOptions = {
      to: reqUser.email,
      from: '${config.emailUser}',
      subject: 'Portal sobre Aprendizaje-servicio. Activación de cuenta de usuario ',
      text: ' Hola ' + reqUser.email + '. Nos complace informarle de que su usuario ha sido activado.\n\n' +
        ' Reciba un cordial saludo.\n'
    };
    smtpTrans.sendMail(mailOptions, function (err, info) {
      if (err) {
        let content = {
          success: false,
          message: 'Error al enviar el correo de reseteo de contraseña.',
        }
        console.log(err)
        res.send(content)
        return
      }
      let content = {
        success: true,
        message: 'Email enviado',
      }
      console.log(info) //enviado
      res.send(content)
      return
    });
  } catch (err) {
    console.log("Error enviando notificación de activacion: ", err)
  }

})


router.post('/forgot', function (req, res) {
  var reqUser = req.body;

  var token = crypto.randomBytes(20).toString('hex');;
  console.log("EJECUTANDO forgot. toke: ", token)

  try {
    var user = UserSqlSchema;

    let sQuery = "SELECT *   " +
      "FROM users " +
      "WHERE ? "

    sqlConn.pool.query(sQuery, { 'email': reqUser.email }, function (err, rows, fields) { //SELECT QUERY
      if (err) {
        console.log("error: ", err)
        let content = {
          success: false,
          message: 'Error al realizar la petición a la BBDD',
          err: err
        };
        res.send(content)
        return
      }
      if (rows == "") {
        console.log('error', 'No existe una cuenta con esa dirección de email.');
        let content = {
          success: false,
          message: 'No existe una cuenta con esa dirección de email.',
        }
        res.send(content);
        return;
      }
      user.setUser(rows[0])
      user.resetPasswordToken = token;

      //user.resetPasswordExpires = Date.now() + 3600000; // 1 hour 
      user.resetPasswordExpires = moment().add(1, 'hour').format().toString()
      sQuery = "UPDATE users SET ? WHERE id=" + user.id
      console.log("fecha de expiración", user.resetPasswordExpires)
      let campos = {
        reset_password_expires: user.resetPasswordExpires,
        reset_password_token: user.resetPasswordToken
      }
      sqlConn.pool.query(sQuery, campos, function (err, results) { //UPDATE CAMPOS DE RESET PASSWORD
        if (err) {
          console.log("Error actualizando campos de expiración", err)
          res.status(404).send(err)
        }
        console.log(results)
      })
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
      var smtpTrans = nodemailer.createTransport({
        service: config.emailService,
        auth: {
          user: config.emailUser,
          pass: config.emailPassword,
          tls: { rejectUnauthorized: false }
        }
      });
      console.log("enviando mensaje a", user.email)
      var mailOptions = {
        to: user.email,
        from: '${config.emailUser}',
        subject: 'Portal sobre Aprendizaje-servicio. Restablecimiento de contraseña ',
        text: ' Hola ' + user.first_name + '. Estás recibiendo este mensaje porque tu (o algún otro) ha solicitado el restablecimiento de la contraseña.\n\n' +
          'Por favor, haz click en el siguiente link, o pegalo en tu navegador para completar el proceso:\n\n' +
          'http://' + req.headers.host + '/reset-pass?token=' + token + '\n\n' +
          'Si tu no has hecho esta petición, por favor, ignora este correo y tu contraseña permanecera sin cambios.\n'
      };
      smtpTrans.sendMail(mailOptions, function (err, info) {
        if (err) {
          let content = {
            success: false,
            message: 'Error al enviar el correo de reseteo de contraseña.',
          }
          console.log(err)
          res.send(content)
          return
        }
        let content = {
          success: true,
          message: 'Email enviado',
        }
        console.log(info) //enviado
        res.send(content)
        return
      });
    })
  } catch (err) {
    console.log(err)
  }
})

router.post('/reset/:token', function (req, res) {
  try {
    var user = UserSqlSchema;
    let sQuery = "SELECT *   " +
      "FROM users " +
      "WHERE ? "
    sqlConn.pool.query(sQuery, { 'reset_password_token': req.params.token }, function (err, rows, fields) { //SELECT QUERY
      if (err) {
        console.log("error: ", err)
        let content = {
          success: false,
          message: 'Error al realizar la petición a la BBDD',
          err: err
        };
        res.send(content)
        return
      }
      console.log("expira el: ", rows[0].reset_password_expires)
      let ahora = moment().format().toString()
      // var dateNow = moment(ahora)
      // var dateExpires = moment(rows[0].reset_password_expires)
      console.log("ahora es: ", ahora)
      if (moment(rows[0].reset_password_expires).isBefore(moment())) {
        console.log();
        let content = {
          success: false,
          message: 'El token de reseteo de contraseña es invalido o ha expirado',
        }
        res.send(content);
        return;
      }
      user.setUser(rows[0])
      console.log("Token valido. Usuario: ", user)
      sQuery = "UPDATE users SET ? WHERE id=" + user.id
      let campos = {
        password: user.generateHash(req.body.password),
        reset_password_expires: "",
        reset_password_token: ""
      }
      sqlConn.pool.query(sQuery, campos, function (err, results) { //UPDATE CAMPOS DE RESET PASSWORD
        if (err) {
          console.log("Error actualizando campos de expiración", err)
          res.status(404).send(err)
        }
      })
      let content = {
        success: true,
        message: 'Se ha restablecido la contraseña',
      }
      res.send(content);
      return;
    })
  } catch (err) {
    console.log(err)
  }
});

router.get('/roles', (req, res) => {
  console.log("PASA POR GETROLESS")
  let sQuery = "SELECT * FROM roles"
  sqlConn.pool.query(sQuery, function (err, rows, fields) { //SELECT QUERY
    if (err) {
      console.log("error: ", err)
      let content = {
        success: false,
        message: 'Error al realizar la petición a la BBDD',
        err: err
      };
    }
    console.log("roles: ", rows)
    res.status(200).send(rows);
  })
});


module.exports = router;
