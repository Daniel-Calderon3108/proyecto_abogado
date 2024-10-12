export interface Customers {
    cliente_id?: any;
    nombre?: string;
    direccion?: string;
    telefono?: string;
    correo?: string;
    tipo_cliente?: string;
    usuario_registra?: string;
    fecha_registra?: string;
    usuario_actualiza?: string;
    fecha_actualiza?: string;
    tipo_documento?: string;
    documento?: string;
    estado?: string;
    usuario: {
        usuario_id? : string;
        nombre: string;
        clave: string;
        usuario_registra: string;
        fecha_registra: string;
        usuario_actualiza: string;
        fecha_actualiza: string;
        avatar: string;
        estado: string;
    }
}

export interface Lawyers {
    abogado_id?: string;
    nombre?: string;
    telefono?: string;
    correo?: string;
    especialidad?: string;
    usuario_registra?: string;
    fecha_registra?: string;
    usuario_actualiza?: string;
    fecha_actualiza?: string;
    tipo_documento?: string;
    documento?: string;
    estado?: string;
    usuario: {
        usuario_id?: string;
        nombre: string;
        clave: string;
        usuario_registra: string;
        fecha_registra: string;
        usuario_actualiza: string;
        fecha_actualiza: string;
        avatar: string;
        estado: string;
    }
}