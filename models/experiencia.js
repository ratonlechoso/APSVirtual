'use strict'

module.exports = {
    id: Number,
    nombre: String,
    coordinadores: [{
        coordinador_id: Number,
        nombre: String,
        email: String,
    }],
    destinatario: String,
    descripcion: String,
    adjuntos: [{
        id: Number,  //FK
        nombre_fichero: String,
        descripcion: String
    }],
    fecha: String,
    ambito: String,
    ambito_id: Number, 
    especialidad: String,
    universidad: String,

    setExperiencia: function (experiencia) {
        this.id = experiencia.idExpe
        this.nombre = experiencia.nombre_experiencia
        this.destinatario = experiencia.destinatario
        this.descripcion = experiencia.desc
        this.fecha = experiencia.fecha
        this.ambito = experiencia.nombre_ambito
        this.ambito_id = experiencia.ambito_id
        this.especialidad = experiencia.nombre_especialidad
        this.universidad = experiencia.nombre_uni
    },

    setCoordinadores: function (coordinadores) {
        this.coordinadores = coordinadores;
    },

    setAdjuntos: function (adjuntos) {
        this.adjuntos = adjuntos
    }

}