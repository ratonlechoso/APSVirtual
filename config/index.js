'use strict'

module.exports = {
    port: process.env.PORT || 3567,
    db: process.env.MONGODB || 'mongodb://localhost:27017/apsVirtualDB',
    secret: 'miclavedetokens' //Debe ser mas largo y mas complicado
}