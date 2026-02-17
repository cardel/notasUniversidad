# Especificación Recursiva de Programas

La especificación recursiva de programas es una técnica fundamental para diseñar funciones que operan sobre estructuras de datos recursivas. El proceso consiste en:

1. Describir los **casos base**: qué hace la función cuando recibe datos primitivos o listas vacías
2. Describir los **casos recursivos**: cómo construye la función el resultado a partir de los resultados recursivos de partes más pequeñas del dato

El caso recursivo debe llevar paulatinamente hacia el caso base, reduciendo la complejidad del problema en cada paso recursivo. Esto garantiza la **terminación** de la función.

## Principios Clave

**Hipótesis de Inducción**: En el caso recursivo, asumimos que la función funciona correctamente en datos más pequeños. Este supuesto nos permite construir la solución para datos más grandes sin necesidad de entender todos los detalles de cómo funciona en niveles más profundos de recursión.

**Reducción del Problema**: Cada llamada recursiva debe operar sobre un dato "más pequeño" o "más simple" que el dato original. Para listas, significa operar sobre el `cdr`; para árboles, sobre los subárboles.

**Correspondencia con la Estructura de Datos**: El diseño de la función debe seguir la estructura de la especificación inductiva o BNF del dato. Cada caso en la especificación corresponde a una rama en el código.

## Ejemplo

```scheme
#lang eopl

#|
Gramática BNF para árboles binarios:
<arb> ::= <int>
      ::= <symbol> <arb> <arb>

Interpretación:
- Un árbol es o bien un número (hoja),
- o bien un símbolo como raíz seguido de dos subárboles.
|#

; sumar-arbol: árbol → número
; Suma todos los números (hojas) presentes en el árbol binario.
; 
; Especificación recursiva:
; Caso base: Si el árbol es un número, retorna ese número.
; Caso recursivo: Si el árbol es una rama (símbolo + dos subárboles),
;                 suma los resultados de sumar recursivamente ambos subárboles.
;                 Nota: los números internos (raíces) no se suman, solo las hojas.
(define sumar-arbol
  (lambda (arb)
    (if
     (number? arb)                                  ; Caso base: árbol es una hoja (número)
     arb                                            ; Retorna el número directamente
     (+                                             ; Caso recursivo: combina resultados de subárboles
      (sumar-arbol (cadr arb))                      ; Suma recursiva del subárbol izquierdo
      (sumar-arbol (caddr arb))                     ; Suma recursiva del subárbol derecho
      )
     )
    )
  )

(newline)
(display "Suma de árboles:")
(newline)
(display (sumar-arbol 5))                          ; 5 - un solo número (hoja)
(newline)
(display (sumar-arbol '(k 1 2)))                   ; 3 - suma de hojas 1 y 2
(newline)
(display (sumar-arbol '(k (s (t 1 2) (u 2 3)) (t 1 2))))
                                                    ; 11 - suma de todas las hojas: 1+2+2+3+1+2
(newline)

; arb->listaSym: árbol → lista de símbolos
; Extrae todos los símbolos (raíces de nodos internos) del árbol binario,
; ordenados en una lista.
;
; Especificación recursiva:
; Caso base: Si el árbol es un número (hoja), no contiene símbolos,
;            retorna lista vacía.
; Caso recursivo: Si el árbol es una rama (símbolo + dos subárboles),
;                 construye una lista que contiene:
;                 1. El símbolo de la raíz actual
;                 2. Los símbolos extraídos del subárbol izquierdo
;                 3. Los símbolos extraídos del subárbol derecho
;
; Nota: Se utiliza 'append' para concatenar las listas resultantes.
;       El orden de los símbolos sigue un recorrido en preorden del árbol.
(define arb->listaSym
  (lambda (arb)
    (cond
      [(number? arb) '()]                           ; Caso base: hoja numérica, sin símbolos
      [else
       (append
        (list (car arb))                            ; Extrae el símbolo de la raíz actual
        (arb->listaSym (cadr arb))                  ; Extrae símbolos del subárbol izquierdo recursivamente
        (arb->listaSym (caddr arb)))                ; Extrae símbolos del subárbol derecho recursivamente
       ]
      )
    )
  )

(newline)
(display "Extracción de símbolos:")
(newline)
(display (arb->listaSym 5))                        ; '() - número, sin símbolos
(newline)
(display (arb->listaSym '(k 1 2)))                 ; (k) - un solo símbolo en la raíz
(newline)
(display (arb->listaSym '(k (s (t 1 2) (u 2 3)) (t 1 2))))
                                                    ; (k s t u t) - símbolos en preorden
(newline)
```

---

## Tabla de Resumen

| Concepto | Definición | Características | Ejemplo |
|----------|-----------|-----------------|---------|
| **Especificación Recursiva** | Técnica de diseño de funciones que operan sobre estructuras recursivas | Descompone el problema en casos base y casos recursivos | Diseño de `sumar-arbol` |
| **Caso Base** | Condición que detiene la recursión, operando sobre datos primitivos | Debe ser alcanzable desde cualquier entrada válida; corresponde a las producciones no-recursivas de BNF | `(number? arb)` en árbol |
| **Caso Recursivo** | Define el resultado combinando llamadas recursivas en datos más pequeños | Asume que las llamadas recursivas funcionan correctamente (hipótesis de inducción) | Sumar subárboles izquierdo y derecho |
| **Reducción del Problema** | Propiedad que cada llamada recursiva opera sobre un dato estrictamente más pequeño | Garantiza la terminación de la función | `(cadr arb)` es subárbol de `arb` |
| **Hipótesis de Inducción** | Suposición de que la función funciona correctamente en datos más pequeños | Permite diseñar sin entender detalles profundos de la recursión | Asumir que `(sumar-arbol sub-izq)` funciona |
| **Composición de Resultados** | Construcción del resultado final combinando resultados parciales recursivos | Depende del tipo de operación y estructura de datos | `(+ (sumar-arbol izq) (sumar-arbol der))` |
| **Correspondencia Estructura-Código** | El código debe reflejar la estructura de la especificación de datos (BNF o inductiva) | Facilita la validación y mantenimiento del código | Ramas `cond` corresponden a alternativas BNF |
| **Recorrido de Árbol** | Orden en que se visitan los nodos durante la operación recursiva | Puede ser preorden, inorden o postorden según el algoritmo | Preorden en `arb->listaSym`: raíz antes que subárboles |
| **Acumulación de Resultados** | Técnica de combinar resultados parciales mediante operaciones asociativas | Común en funciones que producen valores o listas a partir de estructuras | `(+)` en `sumar-arbol`; `(append)` en `arb->listaSym` |
| **Terminación** | Propiedad que garantiza que la función siempre termina en un tiempo finito | Debe haber un caso base alcanzable y cada recursión reduce el problema | Garantizado si cada recursión opera sobre dato más pequeño |

### Comentarios Adicionales

- **Validez de la Hipótesis de Inducción**: Es crucial entender que no "engañamos" al asumir que la función funciona en datos más pequeños. Esto es válido por **inducción matemática**: si funciona en el caso base y el caso recursivo está bien definido, entonces funciona para todos los datos válidos.

- **Complejidad de Análisis**: Aunque la recursión sobre árboles puede parecer compleja, el enfoque de "confiar en la hipótesis de inducción" simplifica enormemente el análisis. En lugar de seguir mentalmente todas las llamadas anidadas, solo verificamos que el caso base es correcto y que el caso recursivo combina correctamente los resultados.

- **Alternativas a Recursión**: Para estructuras profundas, la recursión puede causar problemas de pila (stack overflow). En estos casos, pueden utilizarse enfoques iterativos con pilas explícitas o algoritmos de acumulación (accumulator-passing style).

- **Recorridos de Árboles**: Los tres recorridos fundamentales son:
  - **Preorden**: raíz, izquierda, derecha (utilizado en `arb->listaSym`)
  - **Inorden**: izquierda, raíz, derecha
  - **Postorden**: izquierda, derecha, raíz
  
  El orden depende de cuándo se procesa la raíz respecto a los subárboles.

- **Función `append`**: Es importante notar que `append` es costosa en tiempo (O(n) en el tamaño del primer argumento). Para listas muy grandes, puede ser preferible utilizar técnicas de acumulación para evitar múltiples pasadas sobre los datos.

- **Pureza y Efectos Secundarios**: Las funciones especificadas aquí son **puras**: no tienen efectos secundarios y siempre retornan el mismo resultado para la misma entrada. Esto facilita el razonamiento sobre el código y su corrección.

- **Extensión a Más Operaciones**: El patrón de especificación recursiva es general. Se puede aplicar a:
  - Búsqueda de elementos en estructuras
  - Transformación de estructuras en otras estructuras
  - Validación de propiedades
  - Cálculo de métricas (altura, profundidad, etc.)