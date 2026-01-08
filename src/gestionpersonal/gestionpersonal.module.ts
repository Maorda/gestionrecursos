import { Module } from '@nestjs/common';
import { AsistenciapersonalController } from './controllers/asistenciapersonal.controller';
import { PlanillaController } from './controllers/planilla.controller';
import { PersonalService } from './services/personal.service';
import { SancionesController } from './controllers/sanciones/sanciones.controller';

@Module({
  controllers: [AsistenciapersonalController, PlanillaController, SancionesController],
  providers: [PersonalService]
})
export class GestionpersonalModule {}
