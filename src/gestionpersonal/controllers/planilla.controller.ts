import { Controller, Get } from '@nestjs/common';

@Controller('planilla')
export class PlanillaController {
    @Get('insertafilaplanilla')
    async insertPersonal() {
        //los dias trabajados se tienen que calcular segun las asistencias semanales de la persona
        
    }
}
