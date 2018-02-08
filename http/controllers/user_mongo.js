var bluebird = require('bluebird');
var crypto = bluebird.promisifyAll(require('crypto'));
var nodemailer = require('nodemailer');
var express = require('express');
var app = express();
var router = express.Router();
var User = require('../../models/userMongo');
var UserSql = require('../../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var auth = require('../middleware/auth');
var moment = require('moment')

const sqlConn = require('../../DB/sqlConnection')

router.get('/getUser', (req, res) => {
  let userId = req.body._id || req.query._id || req.headers['x-access-token'];
  User.findById(userId, (err, user) => {
    if (err) return res.status(500).send({ message: `Error al realizar la petición: ${err}` })
    if (!user) return res.status(404).send({ message: `El usuario no existe` })
    console.log("getUser -> firstName: ", user.first_name)
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
  var reqUser = req.body;
  let content;
  var updateUser = new User(reqUser);
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return done(err)
    }
    updateUser.password = updateUser.generateHash(reqUser.password);
    //console.log(JSON.stringify(updateUser))
    User.update({ _id: req.params.id }, updateUser, (err, user) => {

      if (err) {
        console.log("error", JSON.stringify(err))
        content = {
          success: false,
          message: err
        };
      } else {
        console.log("Actualizado: ", JSON.stringify(user))
        content = {
          user: updateUser,
          success: true,
          message: 'Perfil actualizado'
        };
        //Actualizar campos calculados aquí  
      }
      res.send(content);
    })

  })
});

// router.post('/register', (req, res) => {

//   var reqUser = req.body;

//   process.nextTick( () => {
//     User.findOne({ 'email': reqUser.email }, (err, user) => {
//       if(err)
//         return done(err);
//       if(user){
//         let content = {
//           success: false,
//           message: 'El usuario ya existe'
//         };
//         res.send(content);
//         return;
//       } else {
//         var newUser = new User();
//         newUser.first_name = reqUser.first_name;
//         newUser.last_name = reqUser.last_name;
//         newUser.lastLogin = moment()
//         newUser.signUpdate = moment();
//         newUser.email = reqUser.email;
//         newUser.password = newUser.generateHash(reqUser.password);
//         newUser.save( (err) => {
//             if( err )
//                 throw err;
//             let token = jwt.sign(newUser, config.secret, {
//               expiresIn : 60*60*24
//             });
//             let content = {
//               user: newUser,
//               success: true,
//               message: 'Has creado un nuevo usuario',
//               token: token
//             };
//             res.send(content);
//             return;
//         })
//       }
//     })
//   })
// });

router.post('/register', (req, res) => {
  var reqUser = req.body;
  var sQuery = ""
  try {
    var newUser = UserSql;
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
      console.log("usuario: ", rows)
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
          last_login: moment(),
          sign_up_date: moment(),
          email: reqUser.email,
          password: pass,
          rol_id: 2
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
          newUser.id = results.insertId
          newUser.first_name = reqUser.first_name
          newUser.last_name = reqUser.last_name
          newUser.lastLogin = moment()
          newUser.signUpDate = reqUser.sign_up_date
          newUser.email = reqUser.email
          newUser.password = pass
          newUser.roles = "alumno" //<-- rol_id=2

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
  // try {
    var reqUser = req.body;
    var user = UserSql;
  
    let sQuery = "SELECT * FROM users, roles WHERE ? AND users.rol_id = roles.id "
    sqlConn.pool.query(sQuery, { 'email': reqUser.email }, function (err, rows, fields) { //SELECT QUERY
      if (err) {
        console.log("error: ", err)
        return
      }
      console.log("usuario: ", rows)
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
//      console.log("rows.id: ", rows[0].id)
      user.id = rows.id
      user.lastLogin = moment();
      user.first_name = rows[0].first_name
      user.last_name = rows[0].last_name
      user.signUpDate = rows[0].sign_up_date
      user.email = rows[0].email
      user.roles = rows[0].nombre
//      console.log("Actualizado fecha de ultimo login. UserID: ", user.id)
      sQuery = "UPDATE users SET ? " 
      let campos = {
        last_login: moment()
      }
      sqlConn.pool.query(sQuery, campos, function (err, results) { //UPDATE last_login QUERY
        if (err) {
          console.log("Error actualizando users.last_login", err)
          res.status(404).send(err)
        }
        let token = jwt.sign(user, config.secret, {
          expiresIn: 60 * 60 * 24 //1 dia
        });
//        console.log("usuario2: ", user)
        let content = {
          user: user,
          success: true,
          message: 'No estás logeado',
          token: token
        };
        res.send(content);
      })
    })

  // } catch (err) {
  //   console.log("se ha producido un error: ", err)
  // }
});

// router.post('/login', (req, res) => {
//   console.log("logeando ...")
//   var reqUser = req.body;
//   console.log("el email es: ", reqUser.email)
//   User.findOne({ 'email': reqUser.email }, (err, user) => {

//     if (err)
//       return done(err);

//     if (!user) {
//       let content = {
//         success: false,
//         message: 'No existe el usuario'
//       };
//       res.send(content);
//       return;
//     }

//     if (!user.validPassword(reqUser.password)) {
//       let content = {
//         success: false,
//         message: 'Contraseña incorrecta'
//       };
//       res.send(content);
//       return;
//     }
//     user.lastLogin = moment();
//     console.log("Actualizado fecha de ultimo login. UserID: ", user._id)
//     User.update({ _id: user._id }, {
//       lastLogin: moment()
//     }, (err, user) => {
//       if (err) {
//         res.status(404).send(err)
//       }
//     })

//     let token = jwt.sign(user, config.secret, {
//       expiresIn: 60 * 60 * 24 //1 dia
//     });
//     let content = {
//       user: user,
//       success: true,
//       message: 'No estás logeado',
//       token: token
//     };
//     res.send(content);

//   })
// });

router.post('/forgot', function (req, res) {
  console.log("EJECUTANDO forgot")
  var token = crypto.randomBytes(20).toString('hex');;
  console.log(token)
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err)
      return done(error)
    if (!user) {
      console.log('error', 'No existe una cuenta con esa dirección de email.');
      let content = {
        success: false,
        message: 'No existe una cuenta con esa dirección de email.',
      }
      res.send(content);
      return;
    }
    console.log(user)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour 
    user.save(function (err) {
      if (err)
        res.send("");
    });
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
  }); //findOne
}); //forgot


router.post('/reset/:token', function (req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
    if (err) {
      console.log("error")
      return done(error)
    }
    if (!user) {
      let content = {
        success: false,
        message: 'El token de reseteo de contraseña es invalido o ha expirado',
      }
      res.send(content);
      return;
    }
    user.password = user.generateHash(req.body.password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.save(function (err) {
      let content = {
        success: true,
        message: 'Se ha restablecido la contraseña',
      }
      res.send(content);
      return;
    });
  }); //findOne
});


module.exports = router;
