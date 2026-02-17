# Representación mediante BNF

Esta representación utiliza gramáticas en forma BNF (Backus-Naur Form). BNF es una notación formal para especificar la sintaxis de lenguajes y estructuras de datos, permitiendo una descripción clara y precisa de las reglas de composición.

Es importante aclarar que usaremos gramáticas **regulares por la izquierda**, dada la limitación de EOPL. Esto significa que las reglas deben tener la forma:

$$
A \implies aB
$$

donde el símbolo terminal está a la izquierda. Esta restricción es fundamental porque si colocamos dos producciones iniciando con el mismo símbolo, generaremos un **shift conflict**:

```scheme
var x
var x = 10
```

Ambas alternativas inician con `var`, lo que genera ambigüedad en el análisis sintáctico.

## Estructura BNF Básica

La notación BNF utiliza los siguientes elementos:

- **`<símbolo>`**: representa un no-terminal (regla a expandir)
- **`::=`**: significa "se define como" o "produce"
- **Alternativas**: separadas por `::=` en líneas diferentes o por `|`
- **Terminales**: elementos concretos que no se expanden (números, símbolos, cadenas)

Tenemos algunos ejemplos:

**Una lista de números:**

```ebnf
<lst> ::= '()
      ::= <int> <lst>
```

**Un árbol binario:**

```ebnf
<arb> ::= <int>
      ::= <symbol> <arb> <arb>
```

## Principio: "Follow the Grammar"

Las funciones que implementamos deben seguir la estructura de la gramática BNF. Esto significa que la recursión en el código debe corresponder directamente con la recursión en la gramática. Cada alternativa en la gramática se traduce en una rama del `cond`, y cada expansión no-terminal en la gramática se traduce en una llamada recursiva en el código.

## Ejemplo

```scheme
#lang eopl

#|
Gramática BNF para listas de números:
<lst-number> ::= '()
             ::= <int> <lst-number>

Interpretación:
- Una lista de números es o bien una lista vacía,
- o bien un número entero seguido de una lista de números.
|#

; in-L?: lst-number → booleano
; Verifica si un dato es una lista de números válida según la gramática.
; Sigue la estructura de la gramática:
;   - Caso 1: lista vacía (caso base)
;   - Caso 2: número seguido de una lista de números (caso recursivo)
(define in-L?
  (lambda (lst)
    (cond
      [(null? lst) #T]                              ; Primera alternativa: '()
      [else
       (and
        (number? (car lst))                         ; Verifica que el primer elemento sea un número
        (in-L? (cdr lst)))                          ; Verifica que el resto sea una lista válida
       ]
      )
    )
  )

(display "Lista de números")
(newline)
(display (in-L? '(1 2 3 4 5)))                     ; #T - válida
(newline)
(display (in-L? '(1 2 3 a 1 2 34)))                ; #F - inválida (contiene símbolo 'a')

#|
Gramática BNF para árboles binarios:
<b-tree> ::= <int>
         ::= <symbol> <b-tree> <b-tree>

Interpretación:
- Un árbol binario es o bien un número entero (hoja),
- o bien un símbolo como raíz seguido de dos subárboles (rama interna).
|#

; in-B?: árbol → booleano
; Verifica si un dato es un árbol binario válido según la gramática.
; Sigue la estructura de la gramática:
;   - Caso 1: un número (caso base - hoja)
;   - Caso 2: símbolo seguido de dos subárboles (caso recursivo - nodo interno)
(define in-B?
  (lambda (arb)
    (cond
      [(number? arb) #T]                            ; Primera alternativa: número (hoja)
      [else
       (and
        (symbol? (car arb))                         ; Verifica que la raíz sea un símbolo
        (in-B? (cadr arb))                          ; Verifica recursivamente el subárbol izquierdo
        (in-B? (caddr arb))                         ; Verifica recursivamente el subárbol derecho
        )
       ]
      )
    ))

(newline)
(display "Árboles binarios")
(newline)
(display (in-B? 5))                                ; #T - hoja válida
(newline)
(display (in-B? '(k 1 2)))                         ; #T - árbol válido con raíz 'k' y dos hojas
(newline)
(display (in-B? '(a (b (c 1 2) (d 3 2)) (f (g (h 1 2) 3) 4))))
                                                    ; #T - árbol binario complejo válido
```

---

## Tabla de Resumen

| Concepto | Definición | Características | Ejemplo |
|----------|-----------|-----------------|---------|
| **BNF (Backus-Naur Form)** | Notación formal para especificar la sintaxis de gramáticas y estructuras de datos | Clara, precisa y universalmente adoptada | `<lst> ::= '() \|\| <int> <lst>` |
| **No-Terminal** | Símbolo que representa una regla a expandir | Se denota con `<símbolo>`; se define mediante otras reglas | `<lst-number>`, `<b-tree>` |
| **Terminal** | Elemento concreto que no se expande | Aparece literalmente en los datos (números, símbolos, constantes) | `'()`, `<int>`, `<symbol>` |
| **Producción** | Regla que define una forma válida de construir un no-terminal | Cada no-terminal tiene una o más producciones | `<lst> ::= '()` |
| **Alternativa** | Diferentes formas de definir un no-terminal | Separadas por `::=`; corresponden a ramas `cond` en el código | Líneas alternativas en BNF |
| **Gramática Regular por la Izquierda** | Gramática donde los terminales aparecen a la izquierda de los no-terminales | Evita conflictos de análisis sintáctico (shift conflicts) | `A ::= aB` en lugar de `A ::= Ba` |
| **Caso Base** | Producción que no contiene no-terminales en su lado derecho | Detiene la recursión; corresponde a hojas o datos primitivos | `<b-tree> ::= <int>` |
| **Caso Recursivo** | Producción que contiene no-terminales en su lado derecho | Permite la expansión recursiva; corresponde a ramificaciones | `<lst> ::= <int> <lst>` |
| **Principio "Follow the Grammar"** | Principio de diseño: la estructura del código debe reflejar la estructura de la gramática | Asegura correspondencia entre especificación y implementación | Cada alternativa BNF es una rama `cond` |
| **Shift Conflict** | Ambigüedad que surge cuando dos producciones inician con el mismo símbolo | Dificulta el análisis sintáctico; se evita con gramáticas regulares por la izquierda | `var x` vs `var x = 10` |

### Comentarios Adicionales

- **Ventaja respecto a Representación Inductiva**: Mientras que la representación inductiva es más cercana a la lógica matemática y la teoría de conjuntos, la BNF es más cercana al procesamiento de lenguajes y análisis sintáctico. Ambas son equivalentes en expresividad para muchos casos.

- **Correspondencia Código-Gramática**: Una ventaja fundamental del enfoque BNF es que existe una correspondencia uno-a-uno entre las producciones de la gramática y las ramas del `cond` en el procedimiento de verificación. Esto hace que el código sea más fácil de mantener y validar.

- **Limitación de EOPL**: La restricción a gramáticas regulares por la izquierda es una limitación del analizador sintáctico de EOPL. En teoría, BNF puede expresar gramáticas más complejas (incluyendo gramáticas libres de contexto), pero EOPL requiere esta forma específica para evitar conflictos.

- **Relación con Autómatas**: Las gramáticas regulares por la izquierda pueden ser implementadas eficientemente usando autómatas finitos deterministas (AFD), lo que las hace computacionalmente eficientes.

- **Composición de Estructuras**: BNF permite definir estructuras complejas de manera composicional. Por ejemplo, un árbol binario que contiene listas puede especificarse combinando la gramática de árboles con la de listas.

- **Generación vs Verificación**: Mientras que las reglas BNF naturalmente describen cómo **generar** datos válidos, los procedimientos `in-tipo?` verifican si un dato **ya generado** es válido. Idealmente, un dato se considera válido si y solo si puede ser generado mediante las reglas BNF.

# Ejemplo dos casos bases

```ebnf
<arb> ::= '()
      ::= <int>
      ::= <symbol> <arb> <arb>
```

Nos da esta solución
```scheme
#lang eopl

#|
<b-tree> ::= '()
         ::= <int>
         ::= <symbol> <b-tree> <b-tree>
|#
;in-Bebe?: arbol -> booleano
(define in-Bebe?
  (lambda (arb)
    (cond
      [(null? arb) #T]
      [(number? arb) #T]
      [else
       (and
        (symbol? (car arb))
        (in-Bebe? (cadr arb))
        (in-Bebe? (caddr arb))
        )]
      )
    ))


(newline)
(display "arboles")
(newline)
(display (in-Bebe? 5))
(newline)
(display (in-Bebe? '(k 1 2)))
(newline)
(display (in-Bebe? '(a (b (c 1 2) (d 3 2)) (f (g (h 1 2) 3) 4))))
(newline)
(display (in-Bebe? '(a (b (c 1 2) (d () 2)) (f (g (h () 2) 3) ()))))
```

```ebnf
<lst> ::= '()
	  ::= <int> <lst>
	  ::= <symbol> <lst>
```

```scheme
#lang eopl
#|
<lst> ::= '()
	  ::= <int> <lst>
	  ::= <symbol> <lst>
|#

(define in-L?
  (lambda (l)
    (cond
      [(null? l) #T]
      [else
       (or
        (and
         (number? (car l))
         (in-L? (cdr l)))
        (and
         (symbol? (car l))
         (in-L? (cdr l)))
        )
       ]
      )
    )
  )

(display (in-L? '(1 2 3 a b c 1 2 3 a b c a 1 k)))
```