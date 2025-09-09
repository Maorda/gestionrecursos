import { Module } from '@nestjs/common';
import { AsistenciapersonalController } from './asistenciapersonal/asistenciapersonal.controller';
import { PlanillaController } from './planilla/planilla.controller';
import { AlmacenService } from './services/almacen/almacen.service';

@Module({
  controllers: [AsistenciapersonalController, PlanillaController],
  providers: [AlmacenService]
})
export class GestionpersonalModule {}
