export interface Coordinador {
    id: number
    nombre: string
    email: string
}

export interface Adjunto {
    id: number
    nombre_fichero: string
    descripcion: string
    proyecto_id: number
 }

export interface Alumno {
    id: number
    nombre: string
    email: string
    universidad_id: number
}

export interface Estado {
    id: number
    nombre: string
    descripcion: string
}

export interface Entidad {
    id: number
    nombre: string
    descripcion: string
    provincia_id: string
    municipio: string
    tfno: string
    email: string
}

export interface Proyecto {
    id: string
    nombre: string
    descripcion: string
    coordinadores: Coordinador []
    cupo_estudiantes: number,
    alumnos: Alumno []
    entidad: Entidad
    adjuntos: Adjunto []
    fecha_inicio: String
    fecha_fin: String
    estado: Estado
    universidad: string
    ambito: string
    especialidad: string
}