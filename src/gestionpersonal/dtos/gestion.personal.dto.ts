import { Propiedad } from "src/decorators/column.decorator";

export class PersonalDto {
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

export class PlanillaDto {
    @Propiedad
    idplanilla: string;
    @Propiedad
    idpersonal: string;
    @Propiedad
    categoria: string;
    @Propiedad
    fechaingreso: string;
    @Propiedad
    adelanto_monto: number;
    @Propiedad
    adelanto_fecha: string;
    @Propiedad
    dias_trabajados: number;
    @Propiedad
    horas_extra: number;
    @Propiedad
    pago_x_dia:number;
    @Propiedad
    observacion:string
}

