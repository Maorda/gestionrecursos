import { Module } from '@nestjs/common';
import { AsistenciapersonalController } from './asistenciapersonal/asistenciapersonal.controller';
import { PlanillaController } from './planilla/planilla.controller';

@Module({
  controllers: [AsistenciapersonalController, PlanillaController]
})
export class GestionpersonalModule {}
