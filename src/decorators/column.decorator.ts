// Define el decorador de propiedades
export function Propiedad(target: any, key: string) {
    // Crea un array en el prototipo de la clase si no existe
    if (!target._propiedades) {
      target._propiedades = [];
    }
    // Añade el nombre de la propiedad al array
    target._propiedades.push(key);
  }

// Función para obtener las propiedades decoradas de una instancia
export function obtenerPropiedades<T>(clase: T): string[] {
    const constructor = Object.getPrototypeOf(clase).constructor;
    // Retorna las propiedades si existen, de lo contrario un array vacío
    return constructor.prototype._propiedades || [];
  }