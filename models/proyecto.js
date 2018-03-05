'use strict'

module.exports = {
    id: Number,
    nombre: String,
    descripcion: String,
    cupo_estudiantes: Number,
    estado: {
        id: Number,
        nombre: String,
        descripcion: String
    },
    coordinadores: [{
        coordinador_id: Number,
        nombre: String,
        email: String,
    }],
    alumnos: [{
        alumno_id: Number,
        nombre: String,
        email: String,
        universidad_id: Number,
        universidad: String
    }],
    entidad: {
        entidad_id: Number,
        nombre: String,
        descripcion: String,
        provincia_id: Number,
        provincia_nombre: String,
        email: String,
        tfno: String,
        email: String
    },
    adjuntos: [{
        id: Number,  //FK
        nombre_fichero: String,
        descripcion: String
    }],
    fecha_inicio: String,
    fecha_fin: String,
    ambito: String,
    ambito_id: Number, 
    especialidad_id: Number,
    especialidad: String,
    universidad_id: Number,
    universidad: String,

    setProyecto: function (proyecto) {
        this.id = proyecto.idProj
        this.nombre = proyecto.nombre_proyecto
        this.descripcion = proyecto.descripcion_proyecto
        this.fecha_inicio = proyecto.fecha_inicio
        this.fecha_fin = proyecto.fecha_fin
        this.estado.id = proyecto.id_estado
        this.estado.nombre = proyecto.nombre_estado
        this.cupo_estudiantes = proyecto.cupo_estudiantes
        this.ambito = proyecto.nombre_ambito
        this.ambito_id = proyecto.ambito_id
        this.especialidad = proyecto.nombre_especialidad
        this.universidad = proyecto.nombre_uni
        this.entidad.entidad_id = proyecto.entidad_id
        this.entidad.nombre = proyecto.nombre_entidad
        this.entidad.descripcion = proyecto.descripcion_entidad
        this.entidad.email = proyecto.email_entidad
        this.entidad.tfno = proyecto.tfno_entidad
        this.entidad.municipio = proyecto.municipio_entidad    
        this.entidad.provincia_id = proyecto.id_provincia
        this.entidad.provincia_nombre = proyecto.nombre_provincia
    },
    setAlumnos: function(alumnos) {
        this.alumnos = alumnos
    },

    setCoordinadores: function (coordinadores) {
        this.coordinadores = coordinadores;
    },

    setAdjuntos: function (adjuntos) {
        this.adjuntos = adjuntos
    }

}