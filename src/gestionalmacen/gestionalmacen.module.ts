import { Module } from '@nestjs/common';
import { ComprasController } from './compras/compras.controller';
import { SalidasController } from './salidas/salidas.controller';
import { AlmacenController } from './almacen/almacen.controller';

@Module({
    controllers: [ComprasController,AlmacenController,SalidasController]
})
export class GestionalmacenModule {}
