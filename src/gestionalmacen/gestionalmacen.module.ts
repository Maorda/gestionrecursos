import { Module } from '@nestjs/common';
import { ComprasController } from './compras/compras.controller';
import { SalidasController } from './salidas/salidas.controller';
import { AlmacenController } from './almacen/almacen.controller';
import { AlmacenService } from './services/almacen.service';

@Module({
    controllers: [ComprasController,AlmacenController,SalidasController],
    providers: [AlmacenService]
})
export class GestionalmacenModule {}
