Vamos a hacer programas para procesar datos recursivos
1. Tener en cuenta el caso base
2. Tener en cuenta lo(s) caso(s) recursivo(s). Los llamados recursivos **deben recibir el mismo tipo de dato**

# Ejemplo

![](attachments/Pasted%20image%2020250828152003.png)
**Análisis del código:**

**Gramática BNC:**
```bnc
<arbol> ::= <int>
        ::= <symbol> <arbol> <arbol>
```

**Función in-S?:**
```scheme
(define in-S?
  (lambda (arb)
    (cond
      [(number? arb) #T]                    ; Caso base: número
      [(and
        (symbol? (car arb))                 ; Verifica símbolo
        (in-S? (cadr arb))                  ; Recursión subárbol izquierdo
        (in-S? (caddr arb)))                ; Recursión subárbol derecho
       #T]
      [else #F])))
```

- **Caso base:** `(number? arb) #T` - Un número es un árbol válido (hoja)
- **Caso recursivo:** Verifica que el primer elemento sea símbolo y ambos subárboles sean válidos mediante llamadas recursivas a `in-S?`

**Función sumar-arbol:**
```scheme
(define sumar-arbol
  (lambda (arb)
    (cond
     [(number? arb) arb]                    ; Caso base: retorna el número
     [(and
       (symbol? (car arb))                  ; Verifica símbolo
       (in-S? (cadr arb))                   ; Valida subárbol izquierdo
       (in-S? (caddr arb)))                 ; Valida subárbol derecho
      (+
       (sumar-arbol (cadr arb))             ; Suma recursiva subárbol izquierdo
       (sumar-arbol (caddr arb)))])))       ; Suma recursiva subárbol derecho
```

- **Caso base:** `(number? arb) arb` - Retorna el valor numérico de la hoja
- **Caso recursivo:** Suma recursivamente los valores de ambos subárboles

**Llamados recursivos con tipo árbol:**
Las llamadas `(in-S? (cadr arb))` y `(sumar-arbol (cadr arb))` se hacen con el tipo árbol porque:
1. `(cadr arb)` y `(caddr arb)` representan subárboles según la gramática
2. La recursión debe validar/operar sobre estos subárboles completos
3. Cada subárbol puede ser tanto una hoja (número) como un nodo interno (lista)

**Representación con listas:**
Las listas `'(k 1 2)` y `'(k (t 1 4) (s (p 1 2) (t 9 0)))` son solo una representación conveniente de la estructura de árbol:
- El primer elemento es el símbolo del nodo
- El segundo elemento es el subárbol izquierdo
- El tercer elemento es el subárbol derecho
- Esta representación permite manipular árboles usando operaciones de lista estándar mientras se mantiene la estructura lógica del tipo de dato árbol

**Análisis de la función arbol->lista:**

```scheme
(define arbol->lista
  (lambda (arb)
    (cond
      [(number? arb) '()]                   ; Caso base: hoja numérica → lista vacía
      [else
       (append
        (list (car arb))                    ; Añade símbolo del nodo actual
        (arbol->lista (cadr arb))           ; Recursión subárbol izquierdo
        (arbol->lista (caddr arb)))])))     ; Recursión subárbol derecho
```

**Casos:**
- **Caso base:** `(number? arb) '()` - Las hojas numéricas no contribuyen símbolos, retornan lista vacía
- **Caso recursivo:** Para nodos con símbolo, construye la lista concatenando:
  1. `(list (car arb))` - El símbolo del nodo actual
  2. `(arbol->lista (cadr arb))` - Símbolos del subárbol izquierdo (recursión)
  3. `(arbol->lista (caddr arb))` - Símbolos del subárbol derecho (recursión)

**Recorrido del árbol:**
La función realiza un recorrido **preorden** (raíz → izquierda → derecha):
1. Procesa el nodo actual primero
2. Luego procesa recursivamente el subárbol izquierdo
3. Finalmente procesa recursivamente el subárbol derecho

**Resultados:**
- `(arbol->lista arbol1)` → `'()` (árbol hoja 5, sin símbolos)
- `(arbol->lista arbol2)` → `'(k)` (nodo 'k con hojas 1 y 2, solo el símbolo k)
- `(arbol->lista arbol3)` → `'(k t p s t)` (recorrido: k → t → p → s → t)

**Estructura recursiva:**
Cada llamada recursiva `(arbol->lista (cadr arb))` y `(arbol->lista (caddr arb))` trata los subárboles como instancias completas del tipo árbol, aplicando la misma operación de extracción de símbolos de manera recursiva.