'use strict'

module.exports = {
    port: process.env.PORT || 8080,
    db: process.env.SQLMONGODB || 'mongodb://localhost:27017/apsVirtualDB',
    secret: 'miclavedetokens', //Debe ser mas largo y mas complicado

    //MYSQL
    hostDbSql: process.env.SQLHOST || 'r42ii9gualwp7i1y.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    schemaDbSql: process.env.SQLSCHEMA || 'yr3yzb75mbcq6uyw',
    userDbSql: process.env.SQLUSER || 'j2z8kee35yp9x63q',
    passwordDbSql: process.env.SQLPASSWORD || 'ipk19uqhwo0ocfsl',
    portDbSql: process.env.SQLPORT || 3306,

    //MAILER
    emailUser: process.env.EMAILUSER || 'hectoram@gmail.com', //HARDCODEAR AQUI UN USUARIO',
    emailPassword: process.env.EMAILPASSWORD || 'Clara2011',
    emailService: 'Gmail'
}