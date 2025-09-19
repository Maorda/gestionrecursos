/**
 * @description funcion que me permite tener el consecutivo de un registro
 */
export function consecutivo(prefix:string,consecutivo:number ) {
    const secuencia = consecutivo +1
    console.log(prefix + secuencia)
    return prefix + secuencia
}