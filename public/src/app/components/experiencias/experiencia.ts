export interface Coordinador {
    id: number
    nombre: string
    email: string
}

export interface Adjunto {
    id: number
    nombre_fichero: string
    descripcion: string
    experiencia_id: number
 }

export interface Experiencia {
    id: string
    nombre: string
    coordinadores: Coordinador []
    destinatario: string
    descripcion: string
    adjuntos: Adjunto []
    fecha: String
    universidad: string
    ambito: string
    especialidad: string
    imagen: String
}