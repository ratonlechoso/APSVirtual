var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var bcrypt = require('bcrypt-nodejs');
//mongoose.Promise = require('bluebird');
var userSchema = mongoose.Schema({
    email: { 
        type: String, 
        unique: true, 
        lowercase: true, 
        required: true
    },
    first_name: String,
    last_name: String,
    avatar: String,
    // password: { type: String, select: false},
    password: { 
        type: String
    },
    signupDate: {type: Date, default: Date.now()},
    lastLogin: Date,
    roles: {
        type: [{
            type: String,
            enum: ['guest', 'user', 'admin']
        }],
        default: ['user']
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);