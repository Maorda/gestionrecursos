import { Module } from '@nestjs/common';
import { AsistenciapersonalController } from './controllers/asistenciapersonal.controller';
import { PlanillaController } from './controllers/planilla.controller';
import { PersonalService } from './services/personal.service';

@Module({
  controllers: [AsistenciapersonalController, PlanillaController],
  providers: [PersonalService]
})
export class GestionpersonalModule {}
