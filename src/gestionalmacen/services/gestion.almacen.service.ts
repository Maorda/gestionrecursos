import { HttpException, Injectable } from '@nestjs/common';
import { GoogleXlsxService } from 'src/managergooglexls/services/google.manager.xls.service';

enum nameSheets {
    CONFIGURACION = "CONFIGURACION",
    COMPRAS = "COMPRAS",
    ALMACEN = "ALMACEN",
    ASISTENCIA = "ASISTENCIA"
}

export type ProductId = string;
export enum EPreformat {
    IDCOMPRA = "COM",
    IDCATEGORIAINSUMO = "CATINS",
    IDINSUMO = "INS",
    IDCATEGORIAPERSONAL = "CATPER",
    IDPERSONAL = "PER"
}
@Injectable()
export class GestionAlmacenService {
    spredSheetId: string = "171QJrvwwwfZ0HozPwTkF8fkz7Ufq7vgaD96uAmgTmK4";
    constructor(
        private readonly googleXlsxService: GoogleXlsxService,
    ) { }
    async setInsumo(dataInsumo: Array<Array<string>>) {

        const lastRow = await this.googleXlsxService.getLastValueInColumnv2(nameSheets.CONFIGURACION, "D", "G", this.spredSheetId)
        const addinsumo = await this.googleXlsxService.setRow(dataInsumo, `${nameSheets.CONFIGURACION}!D${lastRow + 1}:G${lastRow + 1}`, this.spredSheetId)
        return addinsumo

    }
    async setCategoria(dataCategoria: Array<Array<string>>) {

        const lastRow = await this.googleXlsxService.getLastValueInColumnv2(nameSheets.CONFIGURACION, "A", "B", this.spredSheetId)
        const addinsumo = await this.googleXlsxService.setRow(dataCategoria, `${nameSheets.CONFIGURACION}!A${lastRow + 1}:B${lastRow + 1}`, this.spredSheetId)
        return lastRow
    }
    async setCompras(dataCompras: Array<Array<string>>) {
        const lastRow = await this.googleXlsxService.getLastValueInColumnv2(nameSheets.COMPRAS, "A", "E", this.spredSheetId)
        const addinsumo = await this.googleXlsxService.setRow(dataCompras, `${nameSheets.COMPRAS}!A${lastRow + 1}:E${lastRow + 1}`, this.spredSheetId)
        return addinsumo
    }
    async setAlmacen(dataAlmacen: Array<Array<string>>) {
        const lastRow = await this.googleXlsxService.getLastValueInColumnv2(nameSheets.ALMACEN, "A", "L", this.spredSheetId)
        const addinsumo = await this.googleXlsxService.setRow(dataAlmacen, `ALMACEN!A${lastRow + 1}:L${lastRow + 1}`, this.spredSheetId)
        return addinsumo
    }
    async getInsumos() {
        return this.googleXlsxService.getRows(nameSheets.CONFIGURACION, "D", "G", this.spredSheetId)
    }
    async getCategorias() {
        return this.googleXlsxService.getRows(nameSheets.CONFIGURACION, "A", "B", this.spredSheetId)
    }
    async getCompras() {
        return this.googleXlsxService.getRows(nameSheets.COMPRAS, "D", "G", this.spredSheetId)
    }
    async getAlmacen() {
        return this.googleXlsxService.getRows(nameSheets.ALMACEN, "A", "L", this.spredSheetId)
    }
    
}