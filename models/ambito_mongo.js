var mongoose = require('mongoose');

// El ámbito representa el área de conocimiento al que pertenece un proyecto.
var ambitoSchema = mongoose.Schema({
    nombre: { 
        type: String, 
        required: true
    },
    descripcion: { 
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('ambito', userSchema);