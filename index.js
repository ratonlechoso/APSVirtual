'use strict'
const mongoose = require ('mongoose')
const app = require('./app')
const config = require('./config/index')

const port = config.port

const sqlConn = require('./DB/sqlConnection')

app.listen(port, () => {
    console.log(`API REST corriendo en localhost:${port}`);
});

 

/***PROBANDO EL POOLQUERY */
// sqlConn.pool.query('SELECT * from users', function(err, rows, fields) {
//     if (!err)
//       console.log('The solution is: ', rows);
//     else
//       console.log('Error while performing Query.');
// });
 

// mongoose.connect(config.db, {useMongoClient: true}, (err, res) => {
//     if (err) {
//         return console.log(`error al conectar a la base de datos: ${err}`)
//     }
//     console.log('Conexión a la BD establecida')
//     app.listen(port, () => {
//         console.log(`API REST corriendo en localhost:${port}`);
//     });
// });
 