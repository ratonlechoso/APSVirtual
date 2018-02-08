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
    // user.id = rows[0].id
    // user.lastLogin = moment();
    // user.first_name = rows[0].first_name
    // user.last_name = rows[0].last_name
    // user.signUpDate = rows[0].sign_up_date
    // user.email = rows[0].email
    // user.roles = rows[0].rol_nombre
    console.log("getUser -> firstName: ", user.first_name)
    console.log("getUser -> ID: ", user.id)
    res.status(200).send({ user })

  })
});


router.get('/check-state', auth.verifyToken, (req, res) => {

  let content = {
    success: true,
    message: 'Logeado correctamente. Bienvenido!'
  }
  res.send(content);

});

router.put('/update/:id', (req, res) => {
  try {
    var reqUser = req.body;
    let userId = req.params.id
    let content;
    var updateUser = UserSqlSchema;
    sQuery = "UPDATE USERS SET ? WHERE id = " + userId
    let pass = updateUser.generateHash(reqUser.password)
    let fields = {
      first_name: reqUser.first_name,
      last_name: reqUser.last_name,
      email: reqUser.email,
      password: pass,
      rol_id: reqUser.roles
    }

    console.log("updateQuery: ", sQuery)
    sqlConn.pool.query(sQuery, fields, function (err, results) { //UPDATE QUERY
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
          rol_id: reqUser.roles
        }
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
          //          newUser.roles = "alumno"
          // newUser.id = results.insertId
          // newUser.first_name = reqUser.first_name
          // newUser.last_name = reqUser.last_name
          // newUser.lastLogin = moment()
          // newUser.signUpDate = reqUser.sign_up_date
          // newUser.email = reqUser.email
          // newUser.password = pass
          // newUser.roles = "alumno" //<-- rol_id=2

          let content = {
            user: newUser,
            success: true,
            message: 'Has creado un nuevo usuario',
            token: token
          };
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
    // user.id = rows[0].id
    // user.lastLogin = moment();
    // user.first_name = rows[0].first_name
    // user.last_name = rows[0].last_name
    // user.signUpDate = rows[0].sign_up_date
    // user.email = rows[0].email
    // user.roles = rows[0].rol_nombre
    //      console.log("Actualizado fecha de ultimo login. UserID: ", user.id)
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
      console.log("usuario2: ", user)
      let content = {
        user: user,
        success: true,
        message: 'No estás logeado',
        token: token
      };
      res.send(content);
    })
  })
});


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
        service: 'Gmail',
        auth: {
          user: 'hectoram@gmail.com',
          pass: 'Altair2011',
          tls: { rejectUnauthorized: false }
        }
      });
      console.log("enviando mensaje a", user.email)
      var mailOptions = {
        to: user.email,
        from: 'hectoram@gmail.com',
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
