import { HttpException, Injectable } from '@nestjs/common';
import { GoogleXlsxService } from 'src/managergooglexls/services/google.manager.xls.service';

interface GeneralObject {
    [key: string]: any
}

const nombreColumna: GeneralObject = {}
nombreColumna["1"] = "E";
nombreColumna["2"] = "F";
nombreColumna["3"] = "G";
nombreColumna["4"] = "H";
nombreColumna["5"] = "I";
nombreColumna["6"] = "J";
nombreColumna["7"] = "K";
nombreColumna["8"] = "L";
nombreColumna["9"] = "M";
nombreColumna["10"] = "N";
nombreColumna["11"] = "O";
nombreColumna["12"] = "P";
nombreColumna["13"] = "Q";
nombreColumna["14"] = "R";
nombreColumna["15"] = "S";
nombreColumna["16"] = "T";
nombreColumna["17"] = "U";
nombreColumna["18"] = "V";
nombreColumna["19"] = "W";
nombreColumna["20"] = "X";
nombreColumna["21"] = "Y";
nombreColumna["22"] = "Z";
nombreColumna["23"] = "AA";
nombreColumna["24"] = "AB";
nombreColumna["25"] = "AC";
nombreColumna["26"] = "AD";
nombreColumna["27"] = "AE";



  export enum nameSheets{
    REGISTROPERSONAL="REGISTROPERSONAL",
    PLANILLA="PLANILLA",
    
  }
  



@Injectable()
export class PersonalService {
    spredSheetId: string = "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8";
    constructor(
            private readonly googleXlsxService: GoogleXlsxService,
    ) { }

    async setAsistenciaPersonal(dataAsistencia: Array<Array<string>>, mes: string) {

        const lastRow = await this.googleXlsxService.getLastValueInColumnv2(nameSheets.REGISTROPERSONAL, "E", "AE", this.spredSheetId)
        const addAsistencia = await this.googleXlsxService.setRow(dataAsistencia, `${nameSheets.PLANILLA}!A${lastRow + 1}:L${lastRow + 1}`, this.spredSheetId)
        return addAsistencia
    }
    //las asistencias, se deben mostrar por periodos
    //semanales o mensuales.
    async getAllAsistenciaMonth(mes: string) {
        const today = new Date();
        //la respuesta se da en ingles
        const monthName = today.toLocaleString('default', { month: 'long' });
        console.log(monthName)

        //return this.googleXlsxService.getRows(nameSheets.ASISTENCIA, "E", "AE", this.spredSheetId)
    }
    async getAsistenciaMonth(mes: string,personal:string) {
        const today = new Date();
        //la respuesta se da en ingles
        const monthName = today.toLocaleString('default', { month: 'long' });
        const lastRow =await this.googleXlsxService.getLastValueInColumnv2(monthName, "E", "AE", this.spredSheetId)
        const payloadRange:any =  await this.googleXlsxService.getRows(monthName, "E1", `AE${lastRow}`, this.spredSheetId)
        const payload = payloadRange.data.values
        console.log(payload[0],payload[1])
        return payload
        //return this.googleXlsxService.getRows(nameSheets.ASISTENCIA, "E", "AE", this.spredSheetId)
    }
    async insertaAsistencia(idpersonas: Array<number[]>) {
        const today = new Date();
        //la respuesta se da en ingles
        const monthName = today.toLocaleString('default', { month: 'long' });


        let diaMes: number = 0;//representa la fecha que coincide con la fecha actual
        let personal: Array<any> //representa al registro del trabajador
        const payloadColumna: any = await this.googleXlsxService.getRows(monthName, "E1", "AE1", "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")
        const ve = payloadColumna.data.values[0]

        ve.forEach((element, index) => {
            if (esFechaActual(element)) {
                //fechaActual=element
                diaMes = index + 1
            }
            else {
                throw new HttpException('la fecha de hoy no coincide con los dias de trabajo', 404)
            }
        });
        const ultimoRegistroAsistencias = await this.googleXlsxService.getLastValueInColumnv2(monthName, "A", "A", "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")


        const payloadFila: any = await this.googleXlsxService.getRows(monthName, "A2", "E", "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")
        personal = payloadFila.data.values

        //dentro de la lista del personal, identificar en que fila se encuentra el trabajador
        //raul fila 1, carlos fila 3
        personal.forEach(element => {

            //console.log(element[0])
        });

        //se hace este script considerando que los datos obtenidos siepre van en la misma seccuencia
        //si se tiene mas de 900 registros, se tiene que redefinir el escript puesto que la secuencia de retorno de los datos
        //no sigue el mismo orden.
        await this.googleXlsxService.setRow(idpersonas, `${monthName}!${nombreColumna[diaMes]}3:${nombreColumna[diaMes]}${ultimoRegistroAsistencias}`, "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")

        return ve
    }
    async insertaPersonal(data: Array<any[]>) {
        const lastPersonal = await this.googleXlsxService.getLastValueInColumnv2("REGISTROPERSONAL", "A", "A", "171QJrvwwwfZ0HozPwTkF8fkz7Ufq7vgaD96uAmgTmK4")
        console.log(`REGISTROPERSONAL!A${lastPersonal}:AE${lastPersonal}`)
        const newPersonal = await this.googleXlsxService.setRow(data, `REGISTROPERSONAL!A${lastPersonal + 1}:E${lastPersonal + 1}`, "171QJrvwwwfZ0HozPwTkF8fkz7Ufq7vgaD96uAmgTmK4")
        return newPersonal

    }
}

/**
 * Compara si una fecha dada en formato MM/DD/YYYY es igual a la fecha actual.
 *
 * @param fechaStr La fecha en formato de cadena 'MM/DD/YYYY'.
 * @returns {boolean} Retorna 'true' si la fecha es igual a la fecha actual, de lo contrario 'false'.
 */
function esFechaActual(fechaStr: string): boolean {
    // 1. Parsear la fecha de entrada
    const partes = fechaStr.split('/');
    if (partes.length !== 3) {
        console.error('Formato de fecha inválido. Utilice MM/DD/YYYY.');
        return false;
    }

    const mes = parseInt(partes[0], 10) - 1; // El mes es 0-indexado en JavaScript (0 = Enero, 11 = Diciembre)
    const dia = parseInt(partes[1], 10);
    const anio = parseInt(partes[2], 10);

    // Crear un objeto Date con la fecha de entrada.
    // Es importante usar 'new Date(anio, mes, dia)' para evitar problemas de zona horaria.
    const fechaEntrada = new Date(anio, mes, dia);

    // 2. Obtener la fecha actual
    const fechaHoy = new Date();
    console.log(fechaHoy)
    console.log(fechaEntrada)
    // 3. Comparar las fechas
    const mismoAnio = fechaEntrada.getFullYear() === fechaHoy.getFullYear();
    const mismoMes = fechaEntrada.getMonth() === fechaHoy.getMonth();
    const mismoDia = fechaEntrada.getDate() === fechaHoy.getDate();
    console.log("mes", mismoMes)
    return mismoAnio && mismoMes && mismoDia;
}