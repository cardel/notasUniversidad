# Implementación de letrec

Para implementar `letrec` en el intérprete, hay varios pasos:

## 1. Modificar la gramática

```scheme
(expresion ("letrec" (arbno identificador "(" (separated-list identificador ",") ")" "=" expresion) "in" expresion) letrec-exp)
```

Esta construcción tendrá:

1. **Lista de símbolos** que son los nombres de los procedimientos.
2. **Lista de listas de símbolos** que son los argumentos de los procedimientos.
3. **Lista de expresiones** que son los cuerpos de los procedimientos.
4. **Una expresión** que es el cuerpo del `letrec`.

**Ejemplo:**
```scheme
letrec
    f(x,y) = if >(x,0) then (f sub1(x) y) else 10
    g(n,m) = if >(n,0) then (g -(n,2) +(1,m)) else *(m,2)
    h(a,b) = if >(a,0) then (h -(a,3) *(2,b)) else b
in
    (f 10 20)
```

- **Procedimientos:** `'(f g h)`
- **Argumentos:** `'((x y) (n m) (a b))`
- **Cuerpos:** `'(if >(x,0).... if >(n,0) ... if >(a,0) ...)`
- **Cuerpo del letrec:** `(f 10 20)`

## 2. Modificación del ambiente

Se define un nuevo tipo de ambiente para soportar recursión mutua:

```scheme
(ambiente-extendido-recursivo
   (nombre-procedimientos (list-of symbol?))
   (argumentos-proc (list-of (list-of symbol?)))
   (cuerpos-proc (list-of expresion?))
   (old-env ambiente?))
```

Este ambiente **no contiene clausuras preconstruidas**, porque las clausuras se generan en tiempo de ejecución cuando se referencian los procedimientos (evaluación perezosa).

La modificación del ambiente implica extender el observador `apply-env` para manejar este nuevo caso:

```scheme
(ambiente-extendido-recursivo (procnames lidss cuerpos old-env)
    (letrec
        (
            ;; Función auxiliar para buscar una variable en el marco recursivo
            (buscar-variable (lambda (procnames lidss cuerpos old-env)
                (cond
                    ;; Caso 1: Variable no encontrada en este marco → buscar en el ambiente anterior
                    [(null? procnames) (apply-env old-env var)]
                    
                    ;; Caso 2: Variable encontrada → generar clausura con el ambiente actual (¡no old-env!)
                    [(equal? (car procnames) var)
                     (closure
                      (car lidss)        ; Parámetros formales del procedimiento
                      (car cuerpos)      ; Cuerpo del procedimiento
                      env)               ; Ambiente actual (incluye referencias a sí mismo)
                    ]
                    
                    ;; Caso 3: No coincide con este procedimiento → seguir buscando en el marco
                    [else
                     (buscar-variable (cdr procnames) (cdr lidss) (cdr cuerpos) old-env)]
                )
            ))
        )
        ;; Iniciar búsqueda en el marco recursivo
        (buscar-variable procnames lidss cuerpos old-env)
    )
)
```

**Nota clave:** Cuando se encuentra un procedimiento dentro del ambiente extendido recursivo, se genera una clausura que contiene **el mismo ambiente** (`env`), no el ambiente anterior (`old-env`). Esto permite que los procedimientos se referencien a sí mismos y entre sí, implementando así la recursión mutua.

## 3. Modificación del evaluador

Cuando se encuentra una expresión `letrec`, se evalúa su cuerpo en un ambiente extendido recursivo:

```scheme
(letrec-exp (procnames idss cuerpos cuerpo-letrec)
    (evaluar-expresion 
        cuerpo-letrec                     ; Cuerpo del letrec
        (ambiente-extendido-recursivo     ; Ambiente extendido con procedimientos recursivos
            procnames                     ; Nombres de procedimientos
            idss                          ; Listas de parámetros
            cuerpos                       ; Cuerpos de procedimientos
            amb)                          ; Ambiente anterior
    )
)
```

## Conceptos teóricos importantes

### 1. **Recursión mutua**
`letrec` permite definir múltiples procedimientos que pueden referenciarse entre sí, no solo a sí mismos. Esto es esencial para implementar algoritmos que requieren funciones auxiliares mutuamente recursivas.

### 2. **Evaluación perezosa (call-by-name)**
La implementación presentada genera clausuras **solo cuando se referencian los procedimientos**, no durante la extensión del ambiente. Esto es una forma de evaluación perezosa que:
- Diferencia el costo de construcción de clausuras hasta que son necesarias
- Permite referencias circulares sin causar bucles infinitos durante la construcción

### 3. **Consistencia de ambientes**
La restricción de que `letrec` solo puede ligar procedimientos garantiza que:
- No se pueden crear referencias circulares con valores no procedurales
- El ambiente mantiene consistencia semántica

### 4. **Diferencia con `let` y `let*`**
- `let`: Ligaduras independientes, sin referencias entre ellas
- `let*`: Ligaduras secuenciales, cada una puede referenciar las anteriores
- `letrec`: Ligaduras mutuamente recursivas, todas pueden referenciarse entre sí

## Tabla de resumen

| Concepto | Descripción | Implementación clave |
|----------|-------------|----------------------|
| **Gramática extendida** | Nueva regla para `letrec` con múltiples definiciones procedurales | `(expresion ("letrec" (arbno identificador "(" (separated-list identificador ",") ")" "=" expresion) "in" expresion) letrec-exp)` |
| **Ambiente recursivo** | Estructura especial para soportar referencias mutuas | `(ambiente-extendido-recursivo procnames idss cuerpos old-env)` |
| **Búsqueda de variables** | Algoritmo que genera clausuras al encontrar procedimientos | Función `buscar-variable` en `apply-env` |
| **Generación de clausuras** | Creación diferida de clausuras con ambiente actual | `(closure (car lidss) (car cuerpos) env)` |
| **Evaluación del cuerpo** | Cuerpo del `letrec` evaluado en ambiente extendido recursivo | `(evaluar-expresion cuerpo-letrec (ambiente-extendido-recursivo ...))` |
| **Recursión mutua** | Capacidad de procedimientos para referenciarse entre sí | Ambiente compartido entre todas las clausuras generadas |
| **Evaluación perezosa** | Clausuras generadas solo al ser referenciadas | Implementación en `buscar-variable` vs. construcción anticipada |

## Comentarios adicionales

1. **Ventaja de implementación:** Al generar clausuras solo cuando se referencian, se evita construir estructuras innecesarias para procedimientos que nunca se usan en el cuerpo del `letrec`.

2. **Limitación semántica:** Esta implementación asume que todas las ligaduras en `letrec` son procedurales. Algunos lenguajes permiten `letrec` con valores no procedurales mediante "cajas" (mutable cells).

3. **Complejidad temporal:** La búsqueda de procedimientos es lineal respecto al número de definiciones en el `letrec`. Para muchos procedimientos, podría considerarse una estructura de datos más eficiente.

4. **Extensibilidad:** Este patrón puede extenderse para soportar `letrec*` (similar a `let*` pero con recursión) combinando múltiples ambientes extendidos recursivos.

5. **Verificación estática:** En un intérprete real, se debería verificar que el número de argumentos en cada definición coincida con su uso, aunque esto no se muestra en la implementación básica.

6. **Relación con Y-combinator:** `letrec` puede verse como azúcar sintáctica que encapsula el uso del combinador de punto fijo para implementar recursión, pero de forma más legible y directa.