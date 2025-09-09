import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GestionalmacenModule } from './gestionalmacen/gestionalmacen.module';
import { GestionpersonalModule } from './gestionpersonal/gestionpersonal.module';

import { ManagergooglexlsModule } from './managergooglexls/managergooglexls.module';


@Module({
  imports: [GestionalmacenModule, GestionpersonalModule, ManagergooglexlsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
