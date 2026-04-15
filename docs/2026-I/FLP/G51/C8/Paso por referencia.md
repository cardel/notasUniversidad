# Paso por referencia

Ahora queremos que cuando se pase una variable, lo que se haga dentro del procedimiento también la afecte externamente.

```scheme
let
    a = 3
    f = proc(x) begin set x = 10; x end
in
    (f a)
```

En este caso, cuando `set x = 10`, debería ser equivalente a `set a = 10`.

Para esto debemos introducir algunos cambios:

1. Introducir lo que son TAD de **targets**:
   - **Directos**: Mismo comportamiento que paso por valor.
   - **Indirectos**: Apuntan a un target directo (nunca a un indirecto).

2. Modificamos el comportamiento del `let`: genera ahora targets directos.

3. Modificamos el comportamiento de `app-exp`: cuando recibe una variable genera un target indirecto que contiene la referencia de la variable que estamos pasando; si es otro tipo de expresión, entonces genera un target directo.

4. Modificamos el comportamiento de `setref!`: ahora al recibir el target, si es directo hace la modificación; si es indirecto, extrae el target directo interno y ahí hace la modificación.

5. Modificamos el comportamiento de `deref`: ahora si se emite un target directo extrae el valor; si es un target indirecto, extrae el target directo interno y a este le extrae el valor.

El problema más importante del paso por referencia es el **aliasing**, que ocurre cuando dos variables apuntan a la misma referencia y no es fácil ver que estas dos están relacionadas.

---

## Tabla de resumen

| Concepto | Descripción | Ejemplo/Comentario |
|----------|-------------|-------------------|
| **Paso por referencia** | Mecanismo donde se pasa la referencia a una variable, permitiendo modificarla dentro del procedimiento. | En `(f a)`, si `f` modifica su parámetro, `a` cambia externamente. |
| **Target directo** | Representa un valor pasado directamente (equivalente a paso por valor). | Se usa para expresiones que no son variables (ej. `(f (+ 1 2))`). |
| **Target indirecto** | Representa una referencia a una variable (apunta a un target directo). | Se genera cuando se pasa una variable como argumento. |
| **Modificación de `let`** | Ahora genera targets directos para las ligaduras. | Asegura que las variables locales sean mutables dentro de su ámbito. |
| **Modificación de `app-exp`** | Decide si crear target directo o indirecto según el argumento. | Variable → indirecto; otra expresión → directo. |
| **Modificación de `setref!`** | Maneja ambos tipos de targets para realizar la asignación. | Indirecto: desreferencia primero al target directo interno. |
| **Modificación de `deref`** | Extrae el valor según el tipo de target. | Indirecto: accede al target directo interno y luego a su valor. |
| **Aliasing** | Situación donde múltiples variables referencian la misma ubicación de memoria. | Dificulta la razonabilidad del código y puede causar efectos laterales inesperados. |

## Comentarios adicionales

- El paso por referencia introduce mayor flexibilidad pero también mayor complejidad, especialmente en la depuración.
- La distinción entre targets directos e indirectos es una forma de implementar el paso por referencia de manera explícita en el intérprete.
- El aliasing es un problema clásico en lenguajes con mutabilidad y paso por referencia, ya que cambios a través de una variable afectan a todas las demás que compartan la misma referencia.
- Esta implementación asegura que solo las variables pasadas como argumentos puedan ser modificadas externamente, manteniendo un control sobre los efectos secundarios.
- En contraste con el paso por valor, el paso por referencia permite escribir procedimientos que modifican sus argumentos, lo cual es útil para operaciones in-place (ej. modificar un array).