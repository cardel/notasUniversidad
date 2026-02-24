
# Donde vamos


1. Se vieron dos estrategias para representar datos: inductiva y mediante gramáticas.
2. Vimos que los programas que representan datos recursivos deben seguir su especificación:
    1. **Caso base**: El cual debemos terminar, dado que tiene respuesta inmediata.
    2. **Caso recursivo**: El cual nos impone componer una solución y llegar paulatinamente al caso base.

```ebnf
<tree-b> ::= <int> | <symbol> <tree-b> <tree-b>
```

```scheme
; tree->list: tree-b -> list of numbers
; Propósito: Convierte un árbol binario (tree-b) en una lista plana de números.
; El árbol puede ser un número (hoja) o un símbolo con dos subárboles.
(define tree->list
    (lambda (arb)
        (cond
            [(number? arb) (list arb)] ; Caso base: un número se convierte en una lista unitaria.
            [else
                ; Caso recursivo: el árbol es un nodo con dos hijos.
                ; Se procesan recursivamente ambos subárboles y se concatenan los resultados.
                (append
                    (tree->list (cadr arb))   ; Procesa el subárbol izquierdo (segundo elemento de la lista).
                    (tree->list (caddr arb))  ; Procesa el subárbol derecho (tercer elemento de la lista).
                )
            ]
        )
    )
)
```

Pero observen algo: dependemos de las listas como estructuras, lo que implica:

- `null?`: Predicado de la lista vacía.
- `car`, `cadr`, `caddr`, `caar`, etc.: Operaciones de listas.

En general, estamos dependiendo del tipo de dato, es decir, de las listas.

# Temas

1. [Abstraccion de datos](Abstraccion%20de%20datos.md)
2. [Estrategia para la construcción de TAD](Estrategia%20para%20la%20construcción%20de%20TAD.md)
3. [Ejemplo creacion TAD](Ejemplo%20TAD.md)
4. [Ejemplo Calculo Lambda](Ejemplo%20Calculo%20Lambda.md)