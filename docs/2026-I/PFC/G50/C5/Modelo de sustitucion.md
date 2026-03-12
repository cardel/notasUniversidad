# Modelo de sustitución

Al tener una clase de este estilo:

```scala
// Definición de una clase C1 con parámetros de constructor a y b
class C1(a: Int, b: Int) {
    
    // Método m que recibe dos parámetros x e y y retorna un Int
    def m(x: Int, y: Int): Int = {
        // Cuerpo del método (implementación no especificada)
        // ...
    }
}
```

Por ejemplo, al crear una instancia y llamar a un método:

```scala
// Creación de una instancia de C1 con a=1 y b=3
val objC1 = new C1(1, 3)
/**
 * Esto crea un objeto: C1(a / 1, b / 3)
 * Donde 'a' se sustituye por 1 y 'b' por 3 en el contexto del objeto
 */

// Llamada al método m sobre el objeto objC1 con parámetros 5 y 6
val res = objC1.m(5, 6)
/*
 * Esto se expande a: m(this/C1(a / 1, b / 3), x/5, y/6)
 * Donde:
 * - 'this' se refiere al objeto objC1 (C1 con a=1, b=3)
 * - 'x' se sustituye por 5
 * - 'y' se sustituye por 6
 */
```

En otras palabras, lo que se está diciendo es que cuando ejecutas un método dentro de una clase, se tiene implícitamente a `this` (de forma implícita) como un parámetro adicional que representa la instancia actual sobre la cual se invoca el método.

`this` es la forma en que la clase se da cuenta de que fue instanciada y puede acceder a sus propios atributos y métodos.

---

## Tabla de resumen

Concepto | Descripción | Ejemplo/Implementación |
| --- | --- | --- |
| **Modelo de sustitución** | Proceso mental/formal de reemplazar identificadores por sus valores durante la evaluación de expresiones. | Sustituir `a` por 1 y `b` por 3 en `new C1(1, 3)`. |
| **Parámetro implícito `this`** | Referencia automática a la instancia actual dentro de los métodos de instancia. | En `objC1.m(5,6)`, `this` se refiere a `objC1`. |
| **Instanciación** | Creación de un objeto concreto a partir de una clase, asignando valores a sus parámetros. | `val objC1 = new C1(1, 3)` crea una instancia con `a=1, b=3`. |
| **Invocación de método** | Llamada a un método sobre una instancia, pasando argumentos explícitos e implícitos. | `objC1.m(5, 6)` pasa `5` a `x`, `6` a `y`, e implícitamente `objC1` a `this`. |
| **Contexto de objeto** | Estado interno de una instancia (valores de sus atributos) disponible a través de `this`. | Dentro de `m`, `this.a` accedería a 1, `this.b` a 3 (si fueran accesibles). |
| **Sustitución de parámetros** | Reemplazo formal de parámetros formales por argumentos reales durante la ejecución. | En `m(x, y)`, `x` se sustituye por 5, `y` por 6 al llamar `m(5, 6)`. |

## Comentarios adicionales

- El modelo de sustitución es fundamental para entender la semántica de la programación orientada a objetos: cómo se evalúan las llamadas a métodos y cómo se accede al estado del objeto.
- En Scala, `this` es siempre implícito en los métodos de instancia (no estáticos). En métodos de clase (objeto compañero) no existe `this`.
- La sustitución ocurre en múltiples niveles:
  1. Sustitución de parámetros del constructor al crear la instancia.
  2. Sustitución del parámetro implícito `this` al invocar un método.
  3. Sustitución de parámetros del método al realizar la llamada.
- Este modelo explica por qué diferentes instancias de la misma clase pueden tener comportamientos diferentes: cada una tiene su propio `this` con estado distinto.
- En lenguajes funcionales puros, no existe el concepto de `this`, pero en Scala (que combina paradigmas OO y funcional), `this` es esencial para la programación orientada a objetos.
- La notación `objC1.m(5, 6)` es azúcar sintáctica para `C1.m(objC1, 5, 6)` en algunos lenguajes, donde el primer parámetro es explícitamente la instancia.
- Comprender este modelo ayuda a depurar código, ya que permite rastrear mentalmente qué valores toman las variables en cada contexto de ejecución.