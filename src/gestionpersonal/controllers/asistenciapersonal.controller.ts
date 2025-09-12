import { Controller, Get } from '@nestjs/common';
import { GoogleXlsxService } from 'src/managergooglexls/services/google.manager.xls.service';
import { PersonalService } from '../services/personal.service';

@Controller('asistenciapersonal')
export class AsistenciapersonalController {
    constructor(
        private readonly personalService: PersonalService,
    ){}

    @Get('listapormes')
    async listaPorMes(){
        return await this.personalService.getAsistenciaMonth("September","PER01")

    }
    @Get('listaporsemana')
    async listaPorSemana(){
        return ""//await this.googleXlsxService.getRows(nameSheets.ASISTENCIA, "E", "AE", this.spredSheetId)

    }
}
