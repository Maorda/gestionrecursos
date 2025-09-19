import { HttpException, Injectable } from '@nestjs/common';
import { GoogleXlsxService } from 'src/managergooglexls/services/google.manager.xls.service';
import {Personal, PersonalDto } from '../dtos/personal.dto';
import { obtenerPropiedades } from 'src/decorators/column.decorator';
import { consecutivo } from 'src/utilidades/utils';
import { string } from 'joi';



interface GeneralObject {
    [key: string]: any
}
// Define la interfaz para el vector de doble entrada, que representa el calendario de la semana.
type WeekCalendar = [string, string][];

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
        const lastRow = await this.googleXlsxService.getLastValueInColumnv2(monthName, "A", "A", this.spredSheetId)
        const payloadRange:any = await this.googleXlsxService.getRows(monthName,"A3",`AE${lastRow}`,this.spredSheetId)
        const range:string[][]  = payloadRange.data.values
        const sumaDobleEntrada = sumarValoresPorElemento(range)
        return sumaDobleEntrada
    }
    async getAsistenciaMonth(mes: string,personal:string) {
        const today = mes || new Date();
        //la respuesta se da en ingles
        const monthName = today.toLocaleString('default', { month: 'long' });
        console.log(monthName)
        const lastRow =await this.googleXlsxService.getLastValueInColumnv2(monthName, "E", "AE", this.spredSheetId)
        const payloadRange:any =  await this.googleXlsxService.getRows(monthName, "A3", `AE${lastRow}`, this.spredSheetId)
        const payload:string[][]  = payloadRange.data.values
        const resultado = sumarValores(payload, personal);
        return resultado
        
    }
  async getAsistenciaWeek(fecha : string) {
    // Ejemplo de uso con la fecha "24/09/2025"
    const date = fecha;
    const weekDays = getWeekDaysList(date);
    const fe = [
      ["Lunes", "22/09/2025"],
      ["Martes", "23/09/2025"],
      ["Miércoles", "24/09/2025"],
      ["Jueves", "25/09/2025"],
      ["Viernes", "26/09/2025"],
      ["Sábado", "27/09/2025"]
    ]

    return weekDays

    

    // Resultado esperado: 22/09/2025 - 27/09/2025
  }

    async insertaAsistencia(idpersonas: Array<number[]>) {
        const today = new Date();
        //la respuesta se da en ingles
        const monthName = today.toLocaleString('default', { month: 'long' });


        let diaMes: number = 0;//representa la fecha que coincide con la fecha actual
        let personal:Array<any>  //representa al registro del trabajador
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
    async insertaPersonal(data: Personal) {
        let nuevoPersonal = new Personal()
        nuevoPersonal.nombresapellidos = data.nombresapellidos.toUpperCase()
        nuevoPersonal.dni = data.dni.toUpperCase()
        nuevoPersonal.celular = data.celular.toUpperCase()
        nuevoPersonal.activo = data.activo

        //const atributos = obtenerPropiedades(nuevoPersonal);
        const vector = Object.keys(nuevoPersonal).map(key => nuevoPersonal[key]);

        const lastPersonal = await this.googleXlsxService.getLastValueInColumnv2("REGISTROPERSONAL", "A", "A", "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")
        vector[0] = consecutivo("PER",lastPersonal)
        console.log(nuevoPersonal)
        const newPersonal = await this.googleXlsxService.setRow([vector], `REGISTROPERSONAL!A${lastPersonal + 1}:E${lastPersonal + 1}`, "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")
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
/**
 * @description este script permite sumar elementos a considerando numeros a partir del segundo elemento
 * @argument arr es el arreglo de este formato string[][]
 * @argument busqueda es el primer elemento que será buscando en el array
 * @example const resultado = sumarValores(datos, "dos");
console.log(resultado); // Imprimirá 3
 */
function sumarValores(arr: string[][], busqueda: string): number {
    const elemento = arr.find(item => item[0] === busqueda);
  
    if (elemento) {
      // Filtrar los elementos vacíos y sumar los que tienen valores numéricos
      return elemento.slice(1).reduce((suma, valor) => {
        // Reemplaza la coma por un punto para que el valor sea un decimal válido
        const valorNumerico = parseFloat(valor.replace(',', '.'));
        // Si el valor no es un número válido, lo trata como 0
        return suma + (isNaN(valorNumerico) ? 0 : valorNumerico);
      }, 0);
    }
  
    return 0; // Retorna 0 si no se encuentra el elemento
  }
/**
 * @description este script permite sumar elementos a considerando numeros a partir del segundo elemento const datos: string[][]
 * @argument arr es el arreglo de este formato string[][]
 * @argument busqueda es el primer elemento que será buscando en el array
 * @example const resultado = sumarValoresPorElemento(datos)
 */
  function sumarValoresPorElemento(arr: string[][]): [string, number][] {
    const resultados: [string, number][] = [];
  
    for (const elemento of arr) {
      const clave = elemento[0];
      const suma = elemento.slice(1).reduce((total, valor) => {
        // Reemplaza la coma por un punto para un correcto parseo a float
        const valorNumerico = parseFloat(valor.replace(',', '.'));
        // Agrega el valor solo si es un número válido, de lo contrario suma 0
        return total + (isNaN(valorNumerico) ? 0 : valorNumerico);
      }, 0);
  
      resultados.push([clave, suma]);
    }
  
    return resultados;
  }
/**
 * Obtiene un vector de doble entrada con los días de la semana y sus fechas correspondientes,
 * excluyendo el domingo.
 * @param dateString La fecha en formato "DD/MM/YYYY".
 * @returns Un array de arrays, donde cada sub-array contiene el nombre del día y la fecha.
 */
function getWeekDaysList(dateString: string): WeekCalendar {
  // Parseamos la fecha de entrada.
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day);

  // Array de nombres de días de la semana en español.
  const daysOfWeekNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  // Ajustamos el día de la semana para que el lunes sea 0.
  let dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }

  // Calculamos el lunes de la semana.
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek - 1));

  // Formateamos las fechas a "DD/MM/YYYY".
  const format = (d: Date): string => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Creamos el vector de doble entrada.
  const weekList: WeekCalendar = [];
  for (let i = 0; i < 6; i++) { // Iteramos 6 veces para incluir de lunes a sábado.
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);

    const dayName = daysOfWeekNames[currentDay.getDay()];
    const formattedDate = format(currentDay);

    weekList.push([dayName, formattedDate]);
  }

  return weekList;
}

// Ejemplo de uso con la fecha "24/09/2025"
const date = "24/09/2025";
const weekDays = getWeekDaysList(date);

console.log(`Lista de días de la semana para la fecha ${date}:`);
console.log(weekDays);

/* Resultado esperado:
[
  ["Lunes", "22/09/2025"],
  ["Martes", "23/09/2025"],
  ["Miércoles", "24/09/2025"],
  ["Jueves", "25/09/2025"],
  ["Viernes", "26/09/2025"],
  ["Sábado", "27/09/2025"]
]
*/
// Define la interfaz para el rango de fechas.
interface DateRange {
  startDate: string;
  endDate: string;
}

/**
 * Obtiene el rango de fechas (lunes a sábado) para la semana de una fecha dada,
 * omitiendo el domingo.
 * @param dateString La fecha en formato "DD/MM/YYYY".
 * @returns Un objeto DateRange con las fechas de inicio y fin de la semana.
 */
function getWeekRangeExcludingSunday(dateString: string): DateRange {
  // Parseamos la fecha del formato "DD/MM/YYYY" a un objeto Date.
  const [day, month, year] = dateString.split('/').map(Number);
  const date = new Date(year, month - 1, day); // month - 1 porque los meses en Date son de 0 a 11.

  // Obtenemos el día de la semana (0 = domingo, 1 = lunes, etc.).
  let dayOfWeek = date.getDay();

  // Ajustamos el día de la semana para que el lunes sea 0.
  // Si el día es domingo (0), lo cambiamos a 7 para que el cálculo sea correcto.
  if (dayOfWeek === 0) {
    dayOfWeek = 7;
  }
  
  // Calculamos el lunes de la semana.
  const monday = new Date(date);
  monday.setDate(date.getDate() - (dayOfWeek - 1));

  // Calculamos el sábado de la semana, sumando 5 días al lunes.
  // Esto omite el domingo que sería el séptimo día de la semana.
  const saturday = new Date(monday);
  saturday.setDate(monday.getDate() + 5);

  // Formateamos las fechas a "DD/MM/YYYY".
  const format = (d: Date): string => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    startDate: format(monday),
    endDate: format(saturday),
  };
}

// Ejemplo de uso con la fecha "24/09/2025"
const date1 = "24/09/2025";
const weekRange = getWeekRangeExcludingSunday(date1);

console.log(`Fecha de entrada: ${date1}`);
console.log(`Rango de la semana (sin domingo): ${weekRange.startDate} - ${weekRange.endDate}`);

// Resultado esperado: 22/09/2025 - 27/09/2025
