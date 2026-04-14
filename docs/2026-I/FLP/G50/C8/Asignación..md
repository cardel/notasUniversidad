# Asignación y Referencias en Lenguajes de Programación

El problema que tenemos es que si cambiamos un valor directamente, existen elementos como las clausuras que tienen copias del ambiente y por lo cual no podemos propagarlo.

Cuando hacemos asignación aparecen los denominados **efectos laterales** (side effects), dado que la computación ya no produce únicamente un valor, sino que produce un efecto potencialmente global sobre el estado del programa.

```scheme
let
    a = 10
in
    let
        f = proc(x) +(x, a)  ; Clausura que captura 'a' en el momento de su creación
    in
        begin
            set a = 20;       ; Asignación: modifica el valor de 'a'
            (f 20)            ; Llamada a la clausura. ¿Qué valor de 'a' usa?
        end
```

Observe que si no tenemos un mecanismo para propagar el cambio de `a` a 20, `f` seguirá viendo `a = 10`. El mecanismo para resolver esto son las **referencias**.

## Modelo de Valores

1.  **Valores expresados (expressed values):** Número + Booleano + ProcVal (valor de procedimiento/clausura). Son los valores que las expresiones evalúan *directamente*.
2.  **Valores denotados (denoted values):** Ref(valor expresado). Son los valores almacenados en las variables del ambiente. Una variable ya no contiene directamente un valor expresado, sino una **referencia** (o puntero) a una ubicación de memoria que lo contiene.

Las variables ahora son referencias que apuntan a valores que sí pueden cambiar. Cuando copiamos una referencia (por ejemplo, al capturarla en una clausura), los cambios se pueden propagar, dado que la referencia en sí misma apunta a una **ubicación en memoria** (una celda mutable) cuyo contenido puede ser modificado.

En este paso pasamos del paradigma de **programación funcional** (sin estado mutable) al de **programación imperativa** (con estado y efectos laterales).

Dado que algunas operaciones son de efecto (no producen valores directamente, como `set`), necesitamos **secuenciación** (por ejemplo, con `begin`) para garantizar que las expresiones se evalúen en un orden específico y que la construcción completa siga devolviendo un valor (el de su última expresión).

# Elementos Añadidos al Intérprete

### Gramática Extendida

Incluimos dos nuevas formas de expresión:
1.  `set` para asignación: `set <identificador> = <expresión>`
2.  `begin` para secuenciación: `begin <expresión1>; <expresión2>; ...; <expresiónN> end`

## Ambientes (Environments)

El ambiente cambia fundamentalmente. En lugar de almacenar directamente valores expresados, ahora almacena **referencias** (que a su vez apuntan a celdas mutables que contienen los valores).

El procedimiento observador `apply-env` debe modificarse para manejar este nuevo nivel de indirección.

## Tipo Abstracto de Datos (TAD): Referencia

Añadimos un tipo de dato que representa una referencia, que contiene:
1.  Un **número** (o identificador) que representa la posición o dirección.
2.  Un **vector** (o almacenamiento mutable) del cual se puede leer o escribir.

### Observadores del TAD Referencia

1.  `a-ref`: Constructor. Crea una nueva referencia, asignándole una ubicación en el almacenamiento mutable.
2.  `de-ref`: Observador. Obtiene el valor expresado almacenado en la ubicación a la que apunta la referencia.
3.  `setref!`: Mutador. Modifica el valor expresado almacenado en la ubicación a la que apunta la referencia.

### Cambios Adicionales en la Implementación

1.  **Separación de responsabilidades en `apply-env`:**
    1.  `apply-env-ref`: Busca un identificador en el ambiente y retorna la **referencia** asociada a él.
    2.  `apply-env`: Se redefine para aplicar `de-ref` al resultado de `apply-env-ref`. Es decir, obtiene la referencia y luego el valor al que apunta.
2.  **Ambientes extendidos recursivos:** Cuando se construye un ambiente extendido recursivo (para procedimientos recursivos), debe asegurarse de que el vector que almacena las clausuras esté presente antes de que estas se construyan, para permitir la autorreferencia.
3.  **Estructura de ambientes:** Toda construcción de ambientes extendidos debe utilizar un vector (para mutabilidad) en lugar de una lista inmutable, para permitir la actualización de los valores denotados.

## Semántica de `begin`

Evalúa una secuencia de expresiones en el orden en que llegan, principalmente por sus **efectos laterales** (como asignaciones), y retorna el valor de la **última expresión** evaluada como el valor de toda la construcción `begin`.

```scheme
; Ejemplo: begin retorna el valor de la última expresión (30)
begin
    set x = 10;  ; Efecto lateral: modifica x
    set y = 20;  ; Efecto lateral: modifica y
    +(x, y)      ; Expresión cuyo valor (30) se retorna
end
```

---

## Tabla de Resumen de Conceptos

| Concepto | Descripción | Propósito/Implicación |
| :--- | :--- | :--- |
| **Asignación (`set`)** | Operación que modifica el valor asociado a una variable. | Introduce **estado mutable** y efectos laterales, cambiando el paradigma de funcional a imperativo. |
| **Referencia** | Valor denotado; un "puntero" o identificador para una ubicación de memoria (celda mutable). | Separa la variable (nombre/referencia) del valor almacenado, permitiendo que múltiples partes del código compartan y vean las actualizaciones de un mismo dato. |
| **Valor Expresado** | Valor que resulta de evaluar una expresión (números, booleanos, procedimientos). | El resultado "final" visible para el programador. |
| **Valor Denotado** | Valor almacenado en el ambiente para una variable. Ahora es una **referencia**. | Implementa el nivel de indirección necesario para la mutabilidad compartida. |
| **Efecto Lateral** | Cualquier cambio en el estado del programa (como modificar una variable) que ocurre al evaluar una expresión. | Hace que el orden de evaluación sea importante. Requiere mecanismos como la secuenciación. |
| **Secuenciación (`begin`)** | Construcción que evalúa expresiones en orden y retorna el valor de la última. | Controla el orden de ejecución de expresiones con efectos laterales, garantizando que estos ocurran en una secuencia predecible. |
| **Celdas Mutables** | Almacenamiento (usualmente implementado como un vector) donde residen los valores expresados. Las referencias apuntan a posiciones en este almacenamiento. | Proporciona el soporte de bajo nivel para la mutabilidad; el "heap" o memoria mutable del intérprete. |
| **Clausura en entorno mutable** | Una clausura captura el **ambiente** en el momento de su creación, el cual contiene **referencias**. | Si el valor en una celda mutable cambia, todas las clausuras que tengan una referencia a esa celda verán el cambio, resolviendo el problema de la captura "por valor" en un mundo inmutable. |

## Comentarios Adicionales sobre el Tema

*   **Costo de la Abstracción:** La introducción de referencias añade una capa de complejidad tanto conceptual (valores expresados vs. denotados) como de implementación (manejo de almacenamiento mutable). Es el precio por obtener la flexibilidad de la programación con estado.
*   **Aliasing:** Dos referencias diferentes pueden apuntar a la misma celda mutable (`aliasing`). Esto es poderoso pero peligroso, ya que una modificación a través de una referencia afectará a todas las demás, pudiendo causar efectos difíciles de rastrear.
*   **Orden de Evaluación:** En un lenguaje puramente funcional, el orden de evaluación de los argumentos de una función a menudo no es relevante. Con efectos laterales, el orden se vuelve **crucial** y debe estar bien definido por la semántica del lenguaje (por ejemplo, evaluación de izquierda a derecha).
*   **Transparencia Referencial:** Esta propiedad, típica de la programación funcional (una expresión puede ser reemplazada por su valor sin cambiar el comportamiento del programa), se pierde con la introducción de la asignación. La expresión `(f 20)` en el ejemplo inicial no puede ser entendida solo por su valor; depende del **momento** en que se evalúa respecto a otras asignaciones.