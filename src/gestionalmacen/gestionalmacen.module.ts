import { Module } from '@nestjs/common';
import { ComprasController } from './controllers/compras.controller';
import { SalidasController } from './controllers/salidas.controller';
import { AlmacenController } from './controllers/almacen.controller';
import { GestionAlmacenService } from './services/gestion.almacen.service';

@Module({
    controllers: [ComprasController,AlmacenController,SalidasController],
    providers: [GestionAlmacenService]
})
export class GestionalmacenModule {}
