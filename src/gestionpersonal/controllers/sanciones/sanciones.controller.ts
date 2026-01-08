import { Controller, Get } from '@nestjs/common';
import { PersonalService } from 'src/gestionpersonal/services/personal.service';

@Controller('sanciones')
export class SancionesController {
    constructor(
            private readonly personalService: PersonalService,
        ){}
        @Get('horas/permiso')
        async horasPermiso(){
            return await this.personalService.setIniciaHoraPermiso([[]],"September","PER3")
        }
}
