var mongoose = require('mongoose');

// Universidad donde se desarrolla el proyecto. Este objeto no está vinculado a los usuarios de la app cuyo rol es 'universidad'
var universidadSchema = mongoose.Schema({
    nombre: { 
        type: String, 
        required: true
    },
    descripcion: { 
        type: String, 
        required: true
    },
    imagen_corporativa: String
});

module.exports = mongoose.model('universidad', userSchema);