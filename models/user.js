'use strict'
var bcrypt = require('bcrypt-nodejs');
var moment = require('moment')

module.exports = {
    id: Number,
    email: String,
    first_name: String,
    last_name: String,
    password: String,
    signUpDate: String,
    lastLogin: String,
    roles: String,
    resetPasswordToken: String,
    resetPasswordExpires: String,
    pendiente: Boolean,
    bloqueado: Boolean,


    generateHash: function (password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },

    validPassword: function (password, encrypted_pwd) {
        try {
            console.log("password", password)
            console.log("encriptado", encrypted_pwd)
            console.log("this", this.password)
            return bcrypt.compareSync(password, this.password);
        } catch (err) {
            console.log("error al validar el password: ", err)
        }
    },

    setUser: function (user) {
        this.id = user.id
        this.email = user.email
        this.first_name = user.first_name
        this.last_name = user.last_name
        this.lastLogin = moment();
        this.signUpDate = user.sign_up_date
        this.roles = user.rol_nombre
        this.pendiente = user.pendiente | false
        this.bloqueado = user.bloqueado | false
    }

}
