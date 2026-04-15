# Asignación

Hasta ahora, nuestra computación se ha basado directamente sobre valores; sin embargo, ahora requerimos **estado** (es decir, que los valores puedan cambiar).

## Ligadura vs. asignación

- **Ligadura** es una acción local: cada nueva asociación de un nombre a un valor crea un nuevo ambiente.
- **Asignación** es potencialmente global: modifica el valor de una ligadura en el ambiente y tiene efecto en todo el código que use esa ligadura.

Esto produce un efecto que es potencialmente global, dado que queda para futuras computaciones.

## Cambios en el intérprete

1. Incluimos `set-exp` y `begin-exp`:
   - `set-exp` permite cambiar el valor de una ligadura.
   - `begin-exp` permite secuenciación: necesitamos secuenciación dado que hay computaciones que cambian el estado y no devuelven un valor.

## Referencias

Cuando tenemos una clausura que guarda los argumentos, el cuerpo y el ambiente en el que fue creada, este último ambiente es una copia; por lo tanto, si alguna de las ligaduras cambia, no se propaga a esta copia.

Para esto creamos las **referencias** (o localizaciones), que son un par (vector, posición). Estas tienen los siguientes procedimientos:

1. `a-ref` construye una referencia.
2. `de-ref` extrae el valor expresado de una referencia.
3. `setref!` cambia el valor al que apunta una referencia.

## Cambios en los ambientes

Para adaptar la asignación, debemos cambiar el almacenamiento: inicialmente era una lista (que es inmutable) a un **vector** (que es mutable). Este vector será nuestro almacén de valores mutables y también se conoce como **celda mutable**.

Todo lo que tenga que ver con ambientes debe enviar un vector de valores en lugar de una lista de valores. Es necesario adaptar las partes del código donde se utilizan ambientes.

---

## Tabla de resumen

| Concepto | Descripción | Ejemplo/Comentario |
|----------|-------------|-------------------|
| **Estado** | Capacidad de que los valores cambien durante la ejecución. | Introducido para modelar programas con efectos secundarios. |
| **Ligadura** | Asociación local de un nombre a un valor en un ambiente. | Cada nueva ligadura crea un nuevo ambiente (inmutable). |
| **Asignación** | Modificación del valor de una ligadura existente en el ambiente. | Efecto potencialmente global; afecta a todo el código que use esa ligadura. |
| `set-exp` | Expresión que permite cambiar el valor de una ligadura. | Sintaxis: `(set <var> <valor>)`. |
| `begin-exp` | Expresión que permite secuenciar varias expresiones. | Necesaria porque algunas computaciones cambian el estado y no devuelven un valor. |
| **Referencia** | Par (vector, posición) que representa una localización mutable. | Implementa una indirección para permitir mutabilidad compartida. |
| `a-ref` | Procedimiento que construye una referencia. | Crea una nueva celda mutable. |
| `de-ref` | Procedimiento que extrae el valor de una referencia. | Accede al contenido actual de la celda. |
| `setref!` | Procedimiento que cambia el valor al que apunta una referencia. | Modifica el contenido de la celda mutable. |
| **Ambiente mutable** | Almacenamiento basado en vectores (mutables) en lugar de listas (inmutables). | Permite que las ligaduras puedan ser actualizadas. |
| **Celda mutable** | Unidad básica de almacenamiento mutable (implementada como un vector de un elemento). | Usada internamente por las referencias. |

## Comentarios adicionales

- La introducción de asignación cambia fundamentalmente la semántica del lenguaje: de un paradigma funcional puro a uno con estado.
- Las referencias son una abstracción clave para implementar la mutabilidad de manera controlada, evitando efectos laterales inesperados.
- La secuenciación (`begin-exp`) es necesaria porque las expresiones con efectos secundarios (como `set-exp`) pueden no producir un valor útil, pero deben ejecutarse en orden.
- Al modificar los ambientes para usar vectores, se debe tener cuidado de actualizar todas las operaciones que acceden o modifican ambientes (como `extend-env`, `apply-env`, etc.).
- Este enfoque sigue el modelo de **ambiente como almacenamiento mutable**, típico en lenguajes imperativos.