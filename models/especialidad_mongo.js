var mongoose = require('mongoose');

// Especialidad dentro de un area de conocimiento o ambito sobre la que se desarrolla un proyecto.
var especialidadSchema = mongoose.Schema({
    nombre: { 
        type: String, 
        required: true
    },
    descripcion: { 
        type: String, 
        required: true
    },
    // FK's
    ambito: {
        type: String, 
        required: true
    }    
});

module.exports = mongoose.model('especialidad', userSchema);