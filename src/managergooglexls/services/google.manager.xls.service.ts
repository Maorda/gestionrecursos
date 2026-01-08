import { HttpException, Inject, Injectable } from '@nestjs/common';

import { Observable, catchError, from, map, throwError } from 'rxjs';
import { GoogleAuthService } from './google.auth.service';

interface GeneralObject{
    [key:string]:any
  }
 interface IXlsConfig {
  sheetId:string;
  hojas:Array<string>;
 }
@Injectable()
export class GoogleXlsxService extends GoogleAuthService {
  /**
   * Cambia el color de fondo de una celda específica.
   * @param spreadsheetId El ID de la hoja de cálculo.
   * @param sheetName El nombre de la hoja.
   * @param range La celda o rango en notación A1 (ej. 'A1').
   * @param color El color en formato RGB (red, green, blue).
   */
  async updateCell(
    spreadsheetId: string,
    sheetName: string,
    range: string,
    color: { red: number; green: number; blue: number },
  ) {
    const sheetId = await this.getSheetIdByName(spreadsheetId, sheetName);

    if (sheetId === null) {
      throw new Error(`No se encontró una hoja con el nombre: "${sheetName}"`);
    }

    const formattedRange = this.getGridRangeFromA1(range, sheetId);

    const requests = [
      {
        updateCells: {
          range: formattedRange,
          rows: [
            {
              values: [
                {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: color.red,
                      green: color.green,
                      blue: color.blue,
                    },
                  },
                },
              ],
            },
          ],
          fields: 'userEnteredValue,userEnteredFormat.backgroundColor',
        },
      },
    ];

    try {
      const response = await this.xlsx.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests },
      });
      console.log('Respuesta de la API:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al actualizar la celda:', err);
      throw err;
    }
  }
  /**
   * Cambia el color de fondo de una celda específica.
   * @param spreadsheetId El ID de la hoja de cálculo.
   * @param sheetName El nombre de la hoja.
   * @param range La celda o rango en notación A1 (ej. 'A1').
   * @param color El color en formato RGB (red, green, blue).
   */
  async updateCellBackgroundColor(
    spreadsheetId: string,
    sheetName: string,
    range: string,
    color: { red: number; green: number; blue: number },
  ) {
    const sheetId = await this.getSheetIdByName(spreadsheetId, sheetName);

    if (sheetId === null) {
      throw new Error(`No se encontró una hoja con el nombre: "${sheetName}"`);
    }

    const formattedRange = this.getGridRangeFromA1(range, sheetId);

    const requests = [
      {
        updateCells: {
          range: formattedRange,
          rows: [
            {
              values: [
                {
                  userEnteredFormat: {
                    backgroundColor: {
                      red: color.red,
                      green: color.green,
                      blue: color.blue,
                    },
                  },
                },
              ],
            },
          ],
          fields: 'userEnteredFormat.backgroundColor',
        },
      },
    ];

    try {
      const response = await this.xlsx.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests },
      });
      console.log('Respuesta de la API:', response.data);
      return response.data;
    } catch (err) {
      console.error('Error al actualizar la celda:', err);
      throw err;
    }
  }

  private getGridRangeFromA1(a1Range: string, sheetId: number) {
    const match = a1Range.match(/^([A-Z]+)(\d+)$/);
    if (!match) throw new Error('Rango A1 inválido');
    const [, columnStr, rowStr] = match;

    const startColumnIndex = columnStr
      .split('')
      .reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
    const startRowIndex = parseInt(rowStr, 10) - 1;

    return {
      sheetId,
      startRowIndex,
      endRowIndex: startRowIndex + 1,
      startColumnIndex,
      endColumnIndex: startColumnIndex + 1,
    };
  }
  
  /**
   * 
   * @param spreadsheetId id de la hoja de calculo, por defecto viene en la configurwacion del modulo app, en caso se tenga otro, indicar en el modulo app
   * @param nameSheet es el nombre de la hoja que se va a agregar. 
   * @returns retorna un observable con el estado de la operacion
   */
  public createSheet(nameSheet:string,spreadSheetId:string){
        
    try {
            const res:Observable<any> = this.xlsx.spreadsheets.batchUpdate({
              spreadsheetId:spreadSheetId,
              requestBody: {
                requests: [{

                  addSheet: {
                    properties: {
                      title: nameSheet,
                    }
                  }
                }]
              }
            })
            //console.log(this.googleXlsxSpreadSheetId)
            
            return res
        
          } catch (err) {
            // TODO (developer) - Handle exception
            throw err;
          }
    }
    public async getRows(sheetName:string,columnLetterInitial:string,columnLetterFinal:string,spreadSheetId:string):Promise<string[][]>  {
      const range = `${sheetName}!${columnLetterInitial}:${columnLetterFinal}`;
      const spreadsheetId:string = spreadSheetId
      try {
            const res:any= await this.xlsx.spreadsheets.values.get({spreadsheetId,range})
            return res.data.values
          } catch (err) {
            // TODO (developer) - Handle exception
            throw err;
          }
    }
  /**
   * @param spreadsheetId = 'TU_ID_DEL_DOCUMENTO_AQUI'; // El ID largo de la URL del Google Sheet
   * @param sheetName = 'Hoja1'; // El nombre de la hoja (tab)
   * @param rowNumber = 7; // La fila de inicio es ahora la fila 7
   * @param startColumnLetter  'C'; // La fila inicia en la columna C
   * @param startColumnIndex C es la 3ra columna (A=1, B=2, C=3)
   * @returns 
   */
    async getLastColumnInfoInRow(
      spreadsheetId: string, 
      sheetName: string, 
      rowNumber: number,
      startColumnLetter: string,
      startColumnIndex: number
  ): Promise<{ lastValue: string; columnLetter: string; range: string } | undefined> {
       
      // Rango de búsqueda: 'Hoja1!C7:ZZZ7' (usamos ZZZ para cubrir un rango muy amplio)
      const range = `${sheetName}!${startColumnLetter}${rowNumber}:ZZ${rowNumber}`;
      
      try {
          const response = await this.xlsx.spreadsheets.values.get({
              spreadsheetId,
              range,
              // Pedimos que la respuesta sea un array de filas (aunque solo sea una)
              majorDimension: 'ROWS', 
          });
  
          // La API devuelve un array de filas; tomamos la primera (y única)
          const rowData = response.data.values?.[0]; 
  
          if (rowData && rowData.length > 0) {
              // 1. Encontrar el índice del último valor en el array (0-based)
              const lastDataIndex = rowData.length - 1; 
              const lastValue = rowData[lastDataIndex];
              
              // 2. Calcular el índice absoluto de la columna (1-based)
              // Índice inicial (C=3) + Desplazamiento desde el inicio del rango
              const absoluteColumnIndex = startColumnIndex + lastDataIndex;
              
              // 3. Convertir el índice numérico a su letra A1
              const columnLetter = columnToLetter(absoluteColumnIndex);
  
              return { 
                  lastValue, 
                  columnLetter, 
                  range: `${columnLetter}${rowNumber}` 
              };
          } else {
              console.log(`No se encontraron datos en el rango ${range}.`);
              return undefined;
          }
      } catch (error) {
          console.error('Error al obtener datos de Google Sheets:', error);
          throw error;
      }
    }
    async getLastValueInColumnv2(sheetName:string, columnLetterInitial:string,columnLetterFinal:string,spreadSheetId:string) {
      //const range = `${sheetName}!${columnLetterInitial}:${columnLetterFinal}`;
      const response:any = await this.getRows(sheetName,columnLetterInitial,columnLetterFinal,spreadSheetId)
      
      const allRows = response.data.values || [];
      
      // 4. Extract the last value
      if (allRows && allRows.length > 0) {
        //const lastRow = allRows[allRows.length - 1];
        
        return allRows.length; // Assuming the column has single values per row
      } else {
        return null; // Column is empty
      }
  
    }


    public async getLastValueInColumn(spreadsheetId, sheetName, numRowsToFetch):Promise<any> {
      try {
        const range = `${sheetName}!A:Z`; // Fetch a wide range to ensure you get all data
        const response = await this.xlsx.spreadsheets.values.get({
            spreadsheetId,
            range,
        });

        const allRows = response.data.values || [];

        // Filter out empty rows if necessary (optional, depending on your data structure)
        const nonEmptyRows = allRows.filter(row => row.some(cell => cell !== ''));

        // Get the last 'numRowsToFetch' rows
        const lastRows = nonEmptyRows.slice(Math.max(0, nonEmptyRows.length - numRowsToFetch));

        return lastRows;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
    }
    public async setRow<T>(data:T,range:string,spreadSheetId:string){
        const valueInputOption='USER_ENTERED'
        const dataInput: T = data
        const spreadsheetId:string = spreadSheetId;
          try {
            const res = await this.xlsx.spreadsheets.values.append({
              spreadsheetId,
              range,
              valueInputOption,
              requestBody: {
                majorDimension: 'ROWS',
                values: dataInput,
              },
            })
            
            return res.status
          } catch (err) {
            // TODO (developer) - Handle exception
            throw err;
          }
    }
    defaultActiveValues: any[] = ['true', '1', 'yes'];


  
  /*public get<T>(
    spreadsheetId: string,
    worksheetName: string,
    attributesMapping: object | string[]
  ): Observable<T[]> {
    return this.getRows(spreadsheetId, worksheetName).pipe(
      map((rows: string[][]) =>
        this.rowsToEntries(rows).map(
          (entry: object) =>
            this.getObjectFromEntry(entry, attributesMapping) as T
        )
      )
    );
  }*/
/*
  public getActive<T>(
    spreadsheetId: string,
    worksheetName: string,
    attributesMapping: GeneralObject | string[],
    isActiveColumnName: string = 'Active',
    activeValues: string[] | string | null = null
  ): Observable<T[]>  {


    if (activeValues === null) {
      activeValues = this.defaultActiveValues;
    } else if (!Array.isArray(activeValues)) {
      activeValues = [activeValues];
    }
    return this.getRows(spreadsheetId, worksheetName).pipe(
      map((rows: any) =>
        this.rowsToEntries(rows.data.values) 
          .filter((obj: GeneralObject) =>
            
            activeValues.includes(obj[isActiveColumnName]//.toLowerCase()
          ))
          .map(
            (entry: GeneralObject) =>
              this.getObjectFromEntry(entry, attributesMapping) as T
          )
         
      )
    );
  }*/

  

  /*private getRows(
    spreadsheetId: string,
    worksheetName: string
  ): Observable<string[][]> | any{
    return from(this.getRow())//las hojas de calculo de google spread sheet retornan promesas. para comvertir a observables se usa from
    .pipe(
      map((jsonRes) => jsonRes),
      catchError(this.handleError)
    );
  }*/

  public rowsToEntries(rows: string[][]): GeneralObject[] {
    const columns: Array<string> = rows[0].map(this.cleanColumnName);
    return rows.slice(1).map((row: Array<string>) =>
      columns.reduce((entry: GeneralObject, columnName: string, idx: number) => {
        entry[columnName] = row.length > idx ? row[idx] : '';
        return entry;
      }, {})
    );
  }

  public cleanColumnName(columnName: string): string {
    return columnName.trim();
  }

  private arrayToObject(array: string[]): GeneralObject {
    return array.reduce((acc, cur) => {
      acc[cur] = cur;
      return acc;
    }, {});
  }

  private getObjectFromEntry(
    entry: GeneralObject,
    attributesMapping: GeneralObject | string[]
  ): unknown {
    if (Array.isArray(attributesMapping)) {
      attributesMapping = this.arrayToObject(attributesMapping);
    }

    return this.getObjectFromEntryObject(entry, attributesMapping);
  }

  private getObjectFromEntryObject(
    entry: GeneralObject,
    attributesMapping: GeneralObject,
    columnNamePrefix: string = ''
  ): GeneralObject {
    const obj: GeneralObject = {};
    for (const attr in Object(attributesMapping)) {
      if (
        attributesMapping.hasOwnProperty(attr) &&
        !['_prefix', '_listField'].includes(attr)
      ) {
        if (typeof attributesMapping[attr] === 'string') {
          obj[attr] = this.getValueFromEntry(
            entry,
            columnNamePrefix + attributesMapping[attr]
          );
        } else if (typeof attributesMapping[attr] === 'object') {
          let columnName = '';
          if (attributesMapping[attr].hasOwnProperty('_prefix')) {
            columnName = attributesMapping[attr]._prefix;
          }

          if (attributesMapping[attr]._listField) {
            obj[attr] = this.getListFromEntry(
              entry,
              columnNamePrefix + columnName
            );
          } else {
            obj[attr]<= this.getObjectFromEntryObject(
              entry,
              attributesMapping[attr],
              columnNamePrefix + columnName
            );
          }
        } else {
          console.log(`Unknown type for ${attr}`);
        }
      }
    }

    return obj;
  }

  private getValueFromEntry(entry: GeneralObject, attribute: string): string {
    attribute = this.cleanColumnName(attribute);
   // if (entry.hasOwnProperty(attribute)) {
      return entry[attribute];
    /*} else {
      return null;
    }*/
  }

  private getListFromEntry(entry: GeneralObject, attribute: string): string[] {
    const list: string[] = [];

    let i = 1;
    let curElement: string = this.getValueFromEntry(entry, `${attribute}${i}`);
    while (curElement) {
      list.push(curElement);
      i++;
      curElement = this.getValueFromEntry(entry, `${attribute}${i}`);
    }

    return list;
  }

  private handleError(error: HttpException): Observable<never> {
    return  throwError('algo a sucedido; please try again later.');
  }

  /**
   * Obtiene el ID de una hoja por su nombre.
   * @param spreadsheetId El ID de la hoja de cálculo.
   * @param sheetName El nombre de la hoja.
   * @returns El ID de la hoja o null si no se encuentra.
   */
  private async getSheetIdByName(spreadsheetId: string, sheetName: string): Promise<number | null> {
    try {
      const response = await this.xlsx.spreadsheets.get({
        spreadsheetId,
        fields: 'sheets.properties',
      });

      const sheets = response.data.sheets;
      const sheet = sheets.find(s => s.properties.title === sheetName);

      return sheet ? sheet.properties.sheetId : null;
    } catch (err) {
      console.error('Error al obtener el ID de la hoja:', err);
      throw err;
    }
  }

}
function getGridRangeFromA1(a1Range: string, sheetId: number) {
  const match = a1Range.match(/^([A-Z]+)(\d+)$/);
  if (!match) throw new Error('Rango A1 inválido');
  const [, columnStr, rowStr] = match;

  const startColumnIndex = columnStr
    .split('')
    .reduce((sum, char) => sum * 26 + char.charCodeAt(0) - 64, 0) - 1;
  const startRowIndex = parseInt(rowStr, 10) - 1;

  return {
    sheetId,
    startRowIndex,
    endRowIndex: startRowIndex + 1,
    startColumnIndex,
    endColumnIndex: startColumnIndex + 1,
  };
}

/**
 * Función auxiliar para convertir un índice de columna (1-based) a su letra de notación A1.
 * @param column El índice de columna (ej. 1 -> 'A', 26 -> 'Z', 27 -> 'AA').
 * @returns La letra de la columna.
 */
function columnToLetter(column: number): string {
  let temp: number, letter = '';
  while (column > 0) {
      temp = (column - 1) % 26;
      letter = String.fromCharCode(temp + 65) + letter;
      column = (column - temp - 1) / 26;
  }
  return letter;
}
