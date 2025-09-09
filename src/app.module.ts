import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GestionalmacenModule } from './gestionalmacen/gestionalmacen.module';
import { GestionpersonalModule } from './gestionpersonal/gestionpersonal.module';
import { ComprasController } from './compras/compras.controller';
import { AlmacenController } from './almacen/almacen/almacen.controller';
import { SalidasController } from './almacen/salidas/salidas.controller';
import { GestionpersonalController } from './asistencia/gestionpersonal/gestionpersonal.controller';

@Module({
  imports: [GestionalmacenModule, GestionpersonalModule],
  controllers: [AppController, ComprasController, AlmacenController, SalidasController, GestionpersonalController],
  providers: [AppService],
})
export class AppModule {}
