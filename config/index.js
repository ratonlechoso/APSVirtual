'use strict'

module.exports = {
    port: process.env.PORT || 8080,
    db: process.env.SQLMONGODB || 'mongodb://localhost:27017/apsVirtualDB',
    secret: 'miclavedetokens', //Debe ser mas largo y mas complicado
    hostDbSql: 'r42ii9gualwp7i1y.chr7pe7iynqr.eu-west-1.rds.amazonaws.com',
    schemaDbSql: 'yr3yzb75mbcq6uyw',
    userDbSql: 'j2z8kee35yp9x63q',
    passwordDbSql: 'ipk19uqhwo0ocfsl',
    portDbSql: 3306

}