Los datos recursivos son aquellos que podemos representar usando recursión:
- Caso base
- Caso recursivo (inductivo)

$$
\begin{align}
\lceil 0 \rceil \in \mathbb{N}\\
n \in \mathbb{N}, n+1 \in \mathbb{N}
\end{align}
$$

Anotaciones
- En lenguajes como C++ o Java los datos están representados en orden de bits (int 32) (long 64) (long long 128)
- Lisp, Racket, Haskell, Earlang: Los datos recursivos: tail recursion. No tenemos limite para representar los datos, especialmente los numeros
- Python, Ruby representan los datos como objetos

# Ejemplos

## Listas de numeros naturales
$$
\begin{align}
'() \in S \\
n \in \mathbb{N} \wedge l \in S \therefore n :: l \in S
\end{align}
$$

## Multiplos de 7
$$
\begin{align}
7 \in S \\
p \in S \therefore p+7 \in S
\end{align}
$$
## Listas de multiplos de 8
$$
\begin{align}
'() \in S, 8 \in P \\
x \in P \therefore x+8 \in P \\
l \in S \wedge j \in P \therefore j :: l \in S
\end{align}
$$

**Análisis del código:**

```lisp
#lang eopl
#|
Lista de los pares de multiplos de 6 y 8
4 e A, 6 e B, '() \in S
a e A -> a+6 e A
b e B -> b+8 e B
l e S y a e A y b e B -> (a :: b) :: l e S
|#
;;in-S? <lista de pares> -> boolean
(define in-S?
  (lambda (exp)
    (cond
      [(null? exp) #T]
      [(and
        (in-A? (caar exp))
        (in-B? (cadar exp))
        )
       (in-S? (cdr exp))]
      [else
       #F])))

;;in-A?: numero -> boolean
(define in-A?
  (lambda (num)
    (cond
      [(= num 6) #T]
      [(> num 6) (in-A? (- num 6))]
      [else #F]
      )))
;;in-B? numero -> boolean
(define in-B?
  (lambda (num)
    (cond
      [(= num 8) #T]
      [(> num 8) (in-B? (- num 8))]
      [else #F]
      )))


(define listaA '((4 8) (12 6) (20 24)))
(display (in-S? listaA))
(define listaB '((6 8) (12 32) (18 24)))
(display (in-S? listaB))


```

**Estructura inductiva definida:**
- Conjunto A: números múltiplos de 6 (comenzando desde 6)
- Conjunto B: números múltiplos de 8 (comenzando desde 8)  
- Conjunto S: listas de pares donde cada par (a b) cumple a ∈ A y b ∈ B

**Función in-S?:**
1. `(null? exp) #T` - Caso base: lista vacía pertenece a S
2. Verifica que el primer elemento sea un par válido:
   - `(caar exp)` extrae el primer elemento del primer par
   - `(cadar exp)` extrae el segundo elemento del primer par
   - Verifica que ambos pertenezcan a sus conjuntos respectivos
3. Si el primer par es válido, aplica recursión a `(cdr exp)` (resto de la lista)
4. Si cualquier par falla la validación, retorna `#F`

**Función in-A?:**
- Caso base: `(= num 6) #T` - 6 es el elemento base
- Paso recursivo: `(> num 6) (in-A? (- num 6))` - resta 6 recursivamente hasta llegar al caso base
- Si num < 6: `#F` - no es múltiplo de 6

**Función in-B?:**
- Misma estructura que in-A? pero con múltiplos de 8

**Validación recursiva:**
La validación es posible porque:
1. Los conjuntos A y B están definidos inductivamente con casos base claros (6 y 8)
2. Las funciones verifican membresía restando el múltiplo hasta alcanzar el caso base
3. La estructura de S se define recursivamente: lista vacía + pares válidos concatenados
4. Cada llamada recursiva reduce el problema a una instancia más pequeña:
   - in-A?/in-B? reducen el número restando el múltiplo
   - in-S? procesa un elemento por llamada recursiva

**Resultados:**
- `listaA`: `((4 8) (12 6) (20 24))` → `#F` (4 no es múltiplo de 6)
- `listaB`: `((6 8) (12 32) (18 24))` → `#T` (todos los pares son válidos)


