export function spreadSheet1(target:Function) {
    return function <T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            //a partir de aca ya es un a clase que se puede agregar metodos y atributos a decorar
            propiedades = Object.keys(target.prototype);
            constructor(...args: any[]) {
                
                super(...args);
                
                // Almacena los nombres de las propiedades en un array dentro del prototipo
                target.prototype._propiedades = this.propiedades;

                // No devuelve nada, solo modifica el prototipo
                //return target;
            }
        }
    }
}