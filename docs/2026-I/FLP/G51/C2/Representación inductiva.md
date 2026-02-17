# Representación Inductiva

Es un método formal para representar datos recursivos. Por ejemplo, el conjunto de números pares:

$$
\begin{align}
2 \in S \\
n \in S \therefore n+2 \in S
\end{align}
$$

Ahora consideremos las listas de números naturales:

$$
\begin{align}
'() \in S \\
n \in \mathbb{N} \wedge l \in S \therefore n :: l \in S
\end{align}
$$

Para esto vamos a definir el procedimiento de pertenencia `in-S?` o `in-tipo?`, el cual usa la regla hacia atrás para llegar al caso base, verificando que los datos siguen la regla de generación.

```scheme
#lang eopl

#|
Números pares

2 ∈ P
n ∈ P → n+2 ∈ P
|#

; in-P?: número → booleano
; Verifica si un número pertenece al conjunto P de números pares.
; Utiliza la estrategia de descomposición recursiva: resta 2 repetidamente
; hasta alcanzar el caso base (2) o un número menor a 2.
(define in-P?
  (lambda (n)
    (cond
      [(= n 2) #T]           ; Caso base: 2 es par
      [(< n 2) #F]           ; Caso base: números menores a 2 no son pares válidos
      [else (in-P? (- n 2))] ; Caso recursivo: verifica n-2
      )
    )
  )

(display "Pares")
(newline)
(display (in-P? 10))  ; #T
(newline)
(display (in-P? 111)) ; #F

#|
Lista de tripletas (a,b,c):
- a es un número par
- b es un número impar
- c es un múltiplo de 5

Números pares:
2 ∈ P
n ∈ P → n+2 ∈ P

Números impares:
1 ∈ I
i ∈ I → i+2 ∈ I

Múltiplos de 5:
5 ∈ C
c ∈ C → c+5 ∈ C

Tripletas (no es recursivo):
a ∈ P ∧ b ∈ I ∧ c ∈ C → (a,b,c) ∈ T

Listas de tripletas (es recursivo):
'() ∈ L
t ∈ T ∧ l ∈ L → t :: l ∈ L
|#

; in-I?: número → booleano
; Verifica si un número es impar utilizando la misma estrategia recursiva.
; El caso base es 1 en lugar de 2.
(define in-I?
  (lambda (n)
    (cond
      [(= n 1) #T]           ; Caso base: 1 es el primer número impar
      [(< n 1) #F]           ; Caso base: números menores a 1 no son impares válidos
      [else (in-I? (- n 2))] ; Caso recursivo: verifica n-2
      )
    )
  )

; in-C?: número → booleano
; Verifica si un número es múltiplo de 5 usando descomposición recursiva.
(define in-C?
  (lambda (n)
    (cond
      [(= n 5) #T]           ; Caso base: 5 es el primer múltiplo de 5
      [(< n 5) #F]           ; Caso base: números menores a 5 no son múltiplos válidos
      [else (in-C? (- n 5))] ; Caso recursivo: verifica n-5
      )
    )
  )

; in-T?: tripleta → booleano
; Verifica si una tripleta (a,b,c) cumple con las condiciones:
; a ∈ P, b ∈ I, c ∈ C. Utiliza 'and' para combinar las tres condiciones.
(define in-T?
  (lambda (lst)
    (and
     (in-P? (car lst))      ; Verifica que el primer elemento sea par
     (in-I? (cadr lst))     ; Verifica que el segundo elemento sea impar
     (in-C? (caddr lst))    ; Verifica que el tercer elemento sea múltiplo de 5
     )
    )
  )

; in-L?: lista de tripletas → booleano
; Verifica si una lista contiene solo tripletas válidas.
; Caso base: lista vacía es válida.
; Caso recursivo: verifica la primera tripleta y luego recursiona sobre el resto.
(define in-L?
  (lambda (lst)
    (cond
      [(null? lst) #T]                              ; Caso base: lista vacía
      [else
       (and
        (in-T? (car lst))                           ; Verifica tripleta actual
        (in-L? (cdr lst)))                          ; Verifica resto de la lista
       ])))

; Pruebas
(newline)
(display "Tripletas")
(newline)
(display (in-L? '((2 15 100) (10 91 1000) (1000 1001 90))))  ; Debería ser #T
(newline)
(display (in-L? '((2 15 100) (10 91 1000) (1000 1001 91)))) ; Debería ser #F
```

## Ejemplo

Definir la representación de listas de listas de tuplas $(a,b)$ donde $a$ es un número par y $b$ es una lista de símbolos.

**Números pares:**
$$
\begin{align}
2 \in P \\
n \in P \therefore n+2 \in P
\end{align}
$$

**Lista de símbolos:**
$$
\begin{align}
'() \in L_s \\
l \in L_s, s \in S \therefore s :: l \in L_s
\end{align}
$$

Donde $S$ representa el dominio de símbolos válidos (no es una definición recursiva).

**Tuplas $(a,b)$** donde $a$ es un número par y $b$ es una lista de símbolos (no es una definición recursiva):
$$
a \in P \wedge b \in L_s \therefore (a, b) \in T
$$

**Lista de tuplas:**
$$
\begin{align}
'() \in L_t \\
t \in T \wedge l \in L_t \therefore t :: l \in L_t
\end{align}
$$

**Lista de listas de tuplas:**
$$
\begin{align}
'() \in LL_t  \\
l_t \in L_t \wedge ll_t \in LL_t \therefore l_t :: ll_t \in LL_t
\end{align}
$$

Para este caso el código es:

```scheme
#lang eopl

; in-P?: número → booleano
; Verifica si un número pertenece al conjunto de números pares.
(define in-P?
  (lambda (n)
    (cond
      [(= n 2) #T]
      [(< n 2) #F]
      [else (in-P? (- n 2))]
      )))

; in-Ls?: lista de símbolos → booleano
; Verifica que todos los elementos de la lista sean símbolos.
; Caso base: lista vacía es válida.
; Caso recursivo: verifica que el primer elemento sea un símbolo
; y luego recursiona sobre el resto de la lista.
(define in-Ls?
  (lambda (lst)
    (cond
      [(null? lst) #T]                              ; Caso base
      [else
       (and
        (symbol? (car lst))                         ; Verifica si es símbolo
        (in-Ls? (cdr lst)))                         ; Recursiona
       ]
      )))

; in-Tu?: tupla → booleano
; Verifica que una tupla (a,b) cumpla con:
; a sea un número par (a ∈ P)
; b sea una lista de símbolos (b ∈ Ls)
(define in-Tu?
  (lambda (tu)
    (and
     (in-P? (car tu))      ; Verifica primer elemento: número par
     (in-Ls? (cadr tu))    ; Verifica segundo elemento: lista de símbolos
     )
    )
  )

; in-Lt?: lista de tuplas → booleano
; Verifica que una lista contiene solo tuplas válidas.
; Caso base: lista vacía.
; Caso recursivo: verifica la primera tupla y recursiona sobre el resto.
(define in-Lt?
  (lambda (lst)
    (if
     (null? lst)
     #T                                             ; Caso base
     (and
      (in-Tu? (car lst))                            ; Verifica tupla actual
      (in-Lt? (cdr lst))                            ; Recursiona
      )
     )
    )
  )

; in-LLtu?: lista de listas de tuplas → booleano
; Verifica que la estructura sea una lista válida de listas de tuplas.
; Caso base: lista vacía.
; Caso recursivo: verifica que el primer elemento sea una lista de tuplas válida
; y luego recursiona sobre el resto de la lista.
(define in-LLtu?
  (lambda (lltu)
    (if
     (null? lltu)
     #T                                             ; Caso base
     (and
      (in-Lt? (car lltu))                           ; Verifica lista de tuplas actual
      (in-LLtu? (cdr lltu))                         ; Recursiona
      ))))

(display "Pruebas")
(newline)
; Prueba exitosa: todos los elementos son válidos
(display (in-LLtu? '( ( (4 (x y z)) (6 (a b c d e f)) (8 (z x y z b a)))
                       ( (8 (a b c d e f)) (10 (q w e r t y)))
                       )
                    )
         )

(newline)
; Prueba fallida: el último elemento contiene 1 que no es un símbolo
(display (in-LLtu? '( ( (4 (x y z)) (6 (a b c d e f)) (8 (z x y z b a)))
                       ( (8 (a b c d e f)) (10 (q w e 1 t y)))
                       )
                    )
         )
```

## Generación de Datos

![](attachments/Pasted%20image%2020260217140859.png)

Las reglas de generación producen datos comenzando desde el caso inicial hasta generar los demás elementos. Es fundamental poder "descomponer" o "devolverse": si esto no se cumple, no es una especificación correcta. Por lo tanto, es necesario que una especificación use el dato actual para generar el siguiente dato de forma consistente y reversible. Esta propiedad garantiza que la estructura de datos sea bien definida y que el procedimiento de verificación (`in-tipo?`) pueda determinar correctamente si un dato pertenece o no al conjunto especificado.

---

## Tabla de Resumen

| Concepto | Definición | Características | Ejemplo |
|----------|-----------|-----------------|---------|
| **Representación Inductiva** | Método formal para definir conjuntos de datos recursivos mediante casos base y reglas de generación | Define estructuras completas a partir de elementos iniciales | Números pares: $2 \in P$; $n \in P \to n+2 \in P$ |
| **Caso Base** | Elemento(s) inicial(es) que no dependen de otros elementos | Detiene la recursión; garantiza la terminación | $2$ en números pares; $'()$ en listas |
| **Caso Recursivo** | Regla que construye nuevos elementos a partir de elementos ya existentes | Permite la generación infinita de datos | $n \in P \to n+2 \in P$ |
| **Procedimiento de Verificación** | Función que verifica si un dato pertenece al conjunto especificado | Usa estrategia de descomposición inversa; recurre hasta el caso base | `in-P?`, `in-Ls?`, `in-Tu?` |
| **Descomposición Recursiva** | Estrategia de verificación que reduce un dato aplicando la inversa de la regla de generación | Fundamental para verificación correcta | Restar 2 para verificar números pares |
| **Combinación de Especificaciones** | Crear nuevas especificaciones a partir de otras ya definidas | Permite modularidad y reutilización | Tuplas que combinan números pares y listas de símbolos |
| **Estructura Anidada** | Especificaciones que contienen otras especificaciones en niveles jerárquicos | Aumenta complejidad pero mantiene claridad modular | Lista de listas de tuplas |
| **Reversibilidad** | Propiedad que garantiza que se puede descomponer cualquier dato válido hasta su caso base | Criterio esencial para una especificación correcta | Toda lista no vacía puede reducirse a lista vacía |

### Comentarios Adicionales

- **Importancia de la reversibilidad**: Una especificación inductiva es correcta si y solo si todos los datos generables pueden ser descompuestos completamente hasta alcanzar el caso base. Esto garantiza que los procedimientos de verificación terminen correctamente.

- **Modularidad**: La representación inductiva permite definir tipos de datos complejos descomponiendo el problema en especificaciones más simples. Cada especificación se verifica independientemente antes de combinarse.

- **Eficiencia**: La estrategia de descomposición recursiva puede ser ineficiente para estructuras muy grandes. En práctica, se pueden aplicar optimizaciones como memoización o algoritmos iterativos equivalentes.

- **Relación con Estructuras de Datos Abstractas**: Las especificaciones inductivas formalizan lo que intuitivamente entendemos como tipos de datos abstractos (ADT), proporcionando una base matemática sólida para su implementación.

- **Validación de Datos**: Los procedimientos `in-tipo?` no solo verifican pertenencia, sino que actúan como validadores de entrada en programas que requieren garantías sobre la estructura de sus datos.