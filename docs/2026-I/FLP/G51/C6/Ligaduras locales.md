# Ligaduras locales

Las ligaduras locales nos permiten introducir nuevas asociaciones entre identificadores y valores dentro de un alcance (scope) limitado, más allá de las ligaduras globales que ya tenemos. Para esto, vamos a introducir en la gramática la expresión `let`:

```scheme
    (expresion ("let" (arbno identificador "=" expresion) "in" expresion) let-exp) ; Expresión let con múltiples ligaduras
```

Una expresión `let-exp` tiene tres componentes:
1. Una lista de identificadores (los nombres que se van a ligar)
2. Una lista de expresiones (los valores que se asignarán a cada identificador)
3. Un cuerpo (la expresión donde estarán disponibles estas ligaduras)

Estas las procesamos en el evaluador:

```scheme
     (let-exp (ids rands body)
               (let
                   (
                    (lvalues (map (lambda (x) (evaluar-expresion x amb)) rands)) ; Evalúa cada expresión de inicialización
                    )
                 (evaluar-expresion body (ambiente-extendido ids lvalues amb)) ; Evalúa el cuerpo en el ambiente extendido
                 )
               )
      )
```

El proceso funciona de la siguiente manera:
1. Calculamos los valores de la lista de expresiones (`rands`) evaluando cada una en el ambiente actual.
2. Creamos un nuevo ambiente extendiendo el ambiente actual con las nuevas ligaduras (identificadores asociados a sus valores calculados).
3. Evaluamos el cuerpo (`body`) en este nuevo ambiente extendido, donde los identificadores del `let` están disponibles.

## Conceptos Teóricos

Las ligaduras locales (implementadas mediante la expresión `let`) son un mecanismo fundamental para:
- **Limitación de alcance**: Las variables introducidas en un `let` solo son visibles dentro de su cuerpo.
- **Evitar repetición**: Permiten calcular valores una vez y reutilizarlos múltiples veces.
- **Modularidad**: Facilitan la organización del código en bloques lógicos.

En la implementación presentada, `arbno` indica "cero o más repeticiones", permitiendo múltiples ligaduras en un solo `let`. La evaluación de las expresiones de inicialización ocurre **en el ambiente exterior** (no pueden referirse unas a otras a menos que se implemente `let*`), y todas las ligaduras se crean simultáneamente en el nuevo ambiente.

La función `ambiente-extendido` toma tres parámetros: la lista de identificadores, la lista de valores correspondientes, y el ambiente base, y retorna un nuevo ambiente donde estas ligaduras están disponibles sobre las existentes.

## Tabla de Resumen

| Concepto | Descripción | Ejemplo en Gramática | Función en el Evaluador |
|----------|-------------|----------------------|--------------------------|
| **Ligadura Local (`let`)** | Expresión que introduce nuevas asociaciones identificador-valor en un alcance limitado. | `(expresion ("let" (arbno identificador "=" expresion) "in" expresion) let-exp)` | `(let-exp (ids rands body) ...)` |
| **Identificadores (`ids`)** | Lista de nombres que se van a ligar a valores en el ambiente local. | Parte de la estructura `let-exp` | Se usan como claves en el ambiente extendido |
| **Expresiones de Inicialización (`rands`)** | Lista de expresiones cuyos valores se asignarán a los identificadores. | Parte de la estructura `let-exp` | Se evalúan con `(map (lambda (x) (evaluar-expresion x amb)) rands)` |
| **Cuerpo (`body`)** | Expresión donde las nuevas ligaduras están disponibles. | Parte de la estructura `let-exp` | Se evalúa en `(evaluar-expresion body (ambiente-extendido ids lvalues amb))` |
| **Valores Calculados (`lvalues`)** | Resultados de evaluar las expresiones de inicialización. | No aparece directamente en la gramática | `(map (lambda (x) (evaluar-expresion x amb)) rands)` |
| **Ambiente Extendido** | Nuevo ambiente que contiene las ligaduras locales además de las existentes. | No aparece en la gramática | `(ambiente-extendido ids lvalues amb)` |

## Comentarios Adicionales

- El `let` presentado evalúa todas las expresiones de inicialización **en paralelo** (en el mismo ambiente exterior). Esto significa que una expresión no puede referirse a otro identificador definido en el mismo `let`. Para permitir referencias secuenciales, se necesitaría implementar `let*`.
- El alcance (scope) de las variables introducidas por `let` es **estático** (léxico): se determina por la estructura del código, no por el flujo de ejecución.
- La implementación asume que la cantidad de identificadores coincide con la cantidad de expresiones de inicialización. En una implementación robusta, se debería validar esta condición.
- Las ligaduras locales son fundamentales para implementar **abstracciones** y evitar la contaminación del espacio de nombres global.
- En Scheme/Racket, `let` es azúcar sintáctica para una aplicación de lambda inmediata, pero en este intérprete se implementa como una construcción primitiva.
- El ambiente extendido crea un nuevo marco (frame) de ligaduras que se coloca sobre el ambiente actual, siguiendo el modelo de **ambientes encadenados**.