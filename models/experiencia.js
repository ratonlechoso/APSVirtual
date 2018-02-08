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
    multimedias: [{
        multimedia_id: Number,  //FK
        nombre_archivo: String,
        texto: String
    }],
    fecha: String,
    ambito: String,
    especialidad: String,
    universidad: String,

    setExperiencia: function (experiencia) {
        this.id = experiencia.idExpe
        this.nombre = experiencia.nombre_experiencia
        this.destinatario = experiencia.destinatario
        this.descripcion = experiencia.desc
        this.fecha = experiencia.fecha
        this.ambito = experiencia.nombre_ambito
        this.especialidad = experiencia.nombre_especialidad
        this.universidad = experiencia.nombre_uni
    },

    setCoordinadores: function (coordinadores) {
        this.coordinadores = coordinadores;
    },

    setMultimedias: function (multimedias) {
        this.multimedias = multimedias
    }

}