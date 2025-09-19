import { Controller, Get } from '@nestjs/common';
import { GoogleXlsxService } from 'src/managergooglexls/services/google.manager.xls.service';
import { PersonalService } from '../services/personal.service';
import { Personal, PersonalDto } from '../dtos/personal.dto';

@Controller('personal')
export class AsistenciapersonalController {
    constructor(
        private readonly personalService: PersonalService,
    ){}
    @Get('busca/asitencia/por/mes')
    async listatodosPorMes(){
        return await this.personalService.getAllAsistenciaMonth("December")
    }
    @Get('busca/asistencia/por/personames')
    async listaPorMes(){
        return await this.personalService.getAsistenciaMonth("December","PER01")
    }
    @Get('busca/asistencia/por/semana')
    async listaPorSemana(){
        return await this.personalService.getAsistenciaWeek("24/09/2025")
    }
    @Get('insertasistencia')
    async insertAistentecia(){
        return await this.personalService.insertaAsistencia([[]])
    }
    @Get('insertpersonal')
    async insertPersonal(){
        const persona:Personal = {
            idpersonal:"123",
            nombresapellidos:"yo",
            dni:"12345678",
            celular:"9",
            activo:true,
        } 
            
        return await this.personalService.insertaPersonal(persona)
    }
}
