import { HttpException, Injectable } from '@nestjs/common';
import { GoogleXlsxService } from 'src/managergooglexls/services/google.manager.xls.service';
import { PersonalDto, PlanillaDto } from '../dtos/gestion.personal.dto';
import { obtenerPropiedades } from 'src/decorators/column.decorator';
import { consecutivo } from 'src/utilidades/utils';



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
    rowInit: number = 6;
    colInit: string = "E";
    colFinal: string = "AE";
    colData:string = "A";
    row_h_permiso: number = 0;
    row_h_tardanzas: number = 0;
    row_h_extras: number = 0;
    spredSheetId: string = "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8";
    constructor(
            private readonly googleXlsxService: GoogleXlsxService,
    ) { }

    /**
     * @see considerar que si es que no regresa antes de sus 8 horas de trabajo hacer los calculos y validaciones respectivas
     * @param dataAsistencia 
     * @param mes 
     */
    async setIniciaHoraPermiso(dataAsistencia: Array<Array<string>>, mes: string,idpersonal:string) {
      const PERU_TIMEZONE = 'America/Lima';
      const today: Date = new Date();
      const monthName = today.toLocaleString('default', { month: 'long' });
      const allPersonal: string[][] =await this.googleXlsxService.getRows(monthName,"A3","A",this.spredSheetId)
      const nroCols = await this.googleXlsxService.getRows(monthName,"A3","AE3",this.spredSheetId)
      const rowtarget: number = encontrarPosicion(allPersonal, idpersonal)
      console.log(rowtarget,nroCols)
      try {
        const horaPeruana: string = today.toLocaleTimeString('es-PE', {
          timeZone: PERU_TIMEZONE,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false // Formato de 24 horas
      });  
      const hora_inicia_pedido: string = generarFechaFormateada(today);
      const hora_permiso = await this.googleXlsxService.setRow([[hora_inicia_pedido]],"AG4","1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")
      return hora_permiso
      
      //  
      //  const minutosDeDiferencia: number = calcularDiferenciaEnMinutos(recupera_hora_permiso[0][0], horaPeruana);        
      //  console.log(minutosDeDiferencia)

        /*const info = await this.googleXlsxService.getLastColumnInfoInRow(this.spredSheetId, monthName,5,"E",5);
        if (info) {
          console.log(`El último valor encontrado es: "${info.lastValue}"`);
          console.log(`Ubicado en la celda: ${info.range}`);
      }*/
        
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error("Ocurrió un error desconocido al calcular la diferencia de minutos.");
    }
    }   
    }
    //el cronometro se detienhe solo por un supervisor que serciora que esta regresando al trabajo
    //una vez hecho esto la celda se modificará con la sgiguiente informacion [hora de salida] hasta [hora de llegada] minutos trabajados [minutos trabajados]
    // en caso que ya no regrese el boton de apagado del cronometro seguira activo
    // el cronometro será apagdo por el supervisor llenando en la celda solo las horas trabajadas 8hras - hora que inicia
    async detenerCronometroPorPermiso(dataAsistencia: Array<Array<string>>, mes: string,idpersonal:string) {
      const PERU_TIMEZONE = 'America/Lima';
      const today: Date = new Date();
      const monthName = today.toLocaleString('default', { month: 'long' });
      const recupera_hora_permiso:string[][] = await this.googleXlsxService.getRows(monthName,"AG4","AG4",this.spredSheetId)
      
  

    }
    async setHorasTardanzas(){
        const lastRow = await this.googleXlsxService.getLastValueInColumnv2(nameSheets.REGISTROPERSONAL, "E", "AE", this.spredSheetId)

    }
    async setHorasExtras(){
        const lastRow = await this.googleXlsxService.getLastValueInColumnv2(nameSheets.REGISTROPERSONAL, "E", "AE", this.spredSheetId)

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
    async insertaPersonal(data: PersonalDto) {
      this.googleXlsxService.updateCellBackgroundColor("1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8","September","C4",{red:0,blue:1,green:0})
        let nuevoPersonal = new PersonalDto()
        nuevoPersonal.nombresapellidos = data.nombresapellidos.toUpperCase()
        nuevoPersonal.dni = data.dni.toUpperCase()
        nuevoPersonal.celular = data.celular.toUpperCase()
        nuevoPersonal.activo = data.activo

        //const atributos = obtenerPropiedades(nuevoPersonal);
        const vector = Object.keys(nuevoPersonal).map(key => nuevoPersonal[key]);

        const lastPersonal = await this.googleXlsxService.getLastValueInColumnv2("REGISTROPERSONAL", "A", "A", "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")
        vector[0] = consecutivo("PER",lastPersonal)
        console.log(nuevoPersonal)
        //el idpersonal nuevo se tiene que agregar a la planilla
        
        const newPersonal = await this.googleXlsxService.setRow([vector], `REGISTROPERSONAL!A${lastPersonal + 1}:E${lastPersonal + 1}`, "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")
        return newPersonal

    }
    async insertaPlanilla(planilla: PlanillaDto) {
        let nuevoPlanilla = new PlanillaDto()
        nuevoPlanilla.idpersonal = planilla.idpersonal.toUpperCase()
        nuevoPlanilla.categoria = planilla.categoria.toUpperCase()
        nuevoPlanilla.fechaingreso = planilla.fechaingreso.toUpperCase()
        nuevoPlanilla.adelanto_monto = planilla.adelanto_monto
        nuevoPlanilla.adelanto_fecha = planilla.adelanto_fecha.toUpperCase()
        nuevoPlanilla.dias_trabajados = planilla.dias_trabajados
        nuevoPlanilla.horas_extra = planilla.horas_extra
        nuevoPlanilla.pago_x_dia = planilla.pago_x_dia
        nuevoPlanilla.observacion = planilla.observacion.toUpperCase()

        nuevoPlanilla.idplanilla = consecutivo("PLA", 1)
        //const atributos = obtenerPropiedades(nuevoPlanilla);
        const vector = Object.keys(nuevoPlanilla).map(key => nuevoPlanilla[key]);

        const lastPlanilla = await this.googleXlsxService.getLastValueInColumnv2("PLANILLA", "A", "A", "1jrBtnOQQJSBLoR4PTPfThuHnCpci-BCPfeHQn-6u0b8")
        vector[0] = consecutivo("PLA", lastPlanilla)
        console.log(nuevoPlanilla)
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

/**
 * Función para encontrar el índice del array que contiene el valor buscado.
 * @param array El array anidado a buscar.
 * @param valorBuscado El string a encontrar dentro de los arrays internos.
 * @returns El índice del array encontrado, o -1 si el valor no se encuentra.
 */
function encontrarPosicion(array: string[][], valorBuscado: string): number {
  // Utilizamos findIndex para encontrar el índice del primer elemento (array interno)
  // que cumpla la condición. La condición es que el primer elemento de ese array interno
  // sea igual al valorBuscado.
  const indice: number = array.findIndex(
      (elementoInterno: string[]) => elementoInterno[0] === valorBuscado
  );

  return indice;
}
/**
 * Calcula la diferencia absoluta en minutos entre dos cadenas de fecha dadas
 * en el formato Día/Mes/Año, HH:mm:ss.
 *
 * @param fecha1 La primera cadena de fecha/hora (ej: "28/09/2025, 23:44:53").
 * @param fecha2 La segunda cadena de fecha/hora (ej: "28/09/2025, 12:44:53").
 * @returns La diferencia en minutos (un número flotante) entre las dos fechas.
 */
function calcularDiferenciaEnMinutos(fecha1: string, fecha2: string): number {
  // 1. Parsea las fechas usando la función robusta.
  const date1: Date = parsearFechaDMA(fecha1);
  const date2: Date = parsearFechaDMA(fecha2);

  // 2. Obtiene el tiempo en milisegundos y calcula la diferencia absoluta.
  const ms1: number = date1.getTime();
  const ms2: number = date2.getTime();
  const diferenciaMs: number = Math.abs(ms1 - ms2);

  // 3. Convierte milisegundos a minutos.
  const msEnUnMinuto: number = 60000; // 1000 ms/s * 60 s/min
  const diferenciaMinutos: number = diferenciaMs / msEnUnMinuto;

  return diferenciaMinutos;
}
/**
 * Genera una cadena de fecha/hora formateada en la zona horaria de Perú (24 horas).
 * El formato resultante será similar a "28/09/2025, 19:12:32".
 * @param date El objeto Date a formatear.
 * @returns Una cadena de fecha y hora localizada.
 */
function generarFechaFormateada(date: Date): string {
  const PERU_TIMEZONE: string = 'America/Lima';
  return date.toLocaleString('es-PE', {
      timeZone: PERU_TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Formato de 24 horas
  });
}

/**
 * Parsea una cadena de fecha con formato Día/Mes/Año, HH:mm:ss
 * y devuelve un objeto Date válido.
 *
 * @param fechaCadena La cadena de fecha en formato DD/MM/YYYY, HH:mm:ss (ej: "28/09/2025, 19:21:59").
 * @returns Un objeto Date.
 */
function parsearFechaDMA(fechaCadena: string): Date {
  // Expresión regular para capturar los componentes: DD/MM/YYYY, HH:mm:ss
  const regex = /(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2}):(\d{2})/;
  const partes = fechaCadena.match(regex);

  if (!partes) {
      throw new Error(`Formato de fecha no válido: "${fechaCadena}". Se esperaba DD/MM/YYYY, HH:mm:ss.`);
  }

  // parts[1] = Día, parts[2] = Mes, parts[3] = Año
  // parts[4] = Hora, parts[5] = Minuto, parts[6] = Segundo

  const dia = parseInt(partes[1], 10);
  const mes = parseInt(partes[2], 10);
  const año = parseInt(partes[3], 10);
  const hora = parseInt(partes[4], 10);
  const minuto = parseInt(partes[5], 10);
  const segundo = parseInt(partes[6], 10);

  // NOTA IMPORTANTE: El mes en el constructor Date() es base 0 (0 = Enero, 11 = Diciembre).
  // Por eso restamos 1 al valor del mes capturado.
  return new Date(año, mes - 1, dia, hora, minuto, segundo);
}