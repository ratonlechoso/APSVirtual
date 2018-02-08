var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var experienciaSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    coordinadores: [{
        nombre: {
            type: String,
            required: true
        },
        email: {
            type: String,
        }
    }],
    destinatario: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    multimedias: [{
        nombre_archivo: {
            type: String
        },
        texto: {
            type: String
        }
    }],
    fecha: {
        type: Date,
        default: Date.now(),
        required: true
    },
    ambito: {
        type: String,
        required: true
    },
    especialidad: {
        type: String,
        required: true
    },
    universidad: {
        type: String,
        required: true
    }
    // FK
    // especialidad_id:{
    //     type: Schema.Types.ObjectId, 
    //     ref: 'especialidad'
    // }
});

module.exports = mongoose.model('Experiencia', experienciaSchema);