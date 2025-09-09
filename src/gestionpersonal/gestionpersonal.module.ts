import { Module } from '@nestjs/common';
import { AsistenciapersonalController } from './asistenciapersonal/asistenciapersonal.controller';
import { PlanillaController } from './planilla/planilla.controller';
import { PersonalService } from './services/personal.service';

@Module({
  controllers: [AsistenciapersonalController, PlanillaController],
  providers: [PersonalService]
})
export class GestionpersonalModule {}
