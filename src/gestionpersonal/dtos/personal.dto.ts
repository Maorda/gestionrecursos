import { Propiedad } from "src/decorators/column.decorator";

export class Personal {
    @Propiedad
    idpersonal: string;
    @Propiedad
    nombresapellidos: string;
    @Propiedad
    dni: string;
    @Propiedad
    celular: string;
    @Propiedad
    activo: boolean
}

export class PersonalDto{
    @Propiedad
    nombre: string;
    @Propiedad
    apellido: string;
    @Propiedad
    dni: string;
    @Propiedad
    celular: string;
    @Propiedad
    activo: boolean
}


