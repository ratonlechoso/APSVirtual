export interface Coordinador {
    id: number
    nombre: string
    email: string
}

export interface Multimedia {
    id: number
    nombre_archivo: string
    text: string
}

export interface Experiencia {
    id: string
    nombre: string
    coordinadores: Coordinador []
    destinatario: string
    descripcion: string
    multimedias: Multimedia []
    fecha: String
    universidad: string
    ambito: string
    especialidad: string
    imagen: String
}