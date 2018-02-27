'use strict'

//Aquí va la funcionalidad de express

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const userController = require('./http/controllers/user.js')
const expController = require('./http/controllers/experiencia.js')
const commonController = require('./http/controllers/common.js')
const path = require('path');
const morgan = require('morgan');

// middlewares
app.use(morgan('dev')) //muestra todas las peticiones que llegan al servidor

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false }))


// OTRA FORMA DE INVOCAR A LAS VISTAS
// // view engine setup
// app.engine('html', ejs.renderFile);
// app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'html');


// set the view engine to ejs
/*app.set('views', path.join(__dirname, 'views'))  //set you own view path
app.set('view engine', 'ejs');
*/

//OJO. Las rutas dependen tanto de esta configuración como del loquesea.service.ts de angular
app.use('/api/user', userController)
app.use('/api/exp', expController)
app.use('/api/common', commonController)

// Add headers
app.use(function (req, res, next) {
  
      // Website you wish to allow to connect 
      res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4000'); //ESTO ESTA HARDCODEADO!!!!!
  
      // Request methods you wish to allow
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
      // Request headers you wish to allow
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,x-access-token');
  
      // Set to true if you need the website to include cookies in the requests sent
      // to the API (e.g. in case you use sessions)
      res.setHeader('Access-Control-Allow-Credentials', true);
  
      // Pass to next layer of middleware
      next();
});


//Ruta de las vistas de angular ...
app.use(express.static(path.join(__dirname + '/public/dist')))
app.use(express.static(path.join(__dirname + '/uploads')))
app.all('*', (req, res, next) => {
  console.log("Enrutando a través de Angular...")
  res.sendFile(path.resolve('./public/dist/index.html'))
})


// catch 404 and forward to error handler s

app.use( (req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
 });
  
// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
  

module.exports = app;